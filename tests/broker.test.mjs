import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PiLoginBroker, dispatch } from '../src/broker.mjs'
import { applyLoginUI as apply } from '../src/routes.mjs'

const key = 'llm-pi-ai/openai-codex'
const pause = () => new Promise(resolve => setImmediate(resolve))
function setup(run, options) {
  const stored = new Map(), active = new Set()
  const entry = { key, label:'ChatGPT', methods:[{id:'oauth',label:'ChatGPT'}] }
  const credentials = { describeRecord: async id => ({configured:stored.has(id),writable:true}) }
  const authorization = {
    list:()=>[ {...entry,inFlight:active.has(key)}, {key:'other/example',label:'Other',methods:[]} ],
    describe:id=>id===key?{...entry,inFlight:active.has(key)}:undefined,
    async begin({key:id,signal,interaction}) {
      active.add(id)
      try { await run({signal,...interaction,commit:value=>stored.set(id,value)}); return {status:signal.aborted?'cancelled':'authorized'} }
      finally {active.delete(id)}
    },
  }
  const writes=[]
  const settings={describe:()=>[{ns:'dsh-pi-login',value:{providers:{}},revision:9}],update:async (...args)=>writes.push(args)}
  const broker=new PiLoginBroker(authorization,credentials,settings,options)
  return {broker,stored,active,writes,authorization,credentials,settings}
}

test('private OAuth ticket, safe links, and secret prompt persist only through the provider', async t=>{
 const fixture=setup(async session=>{
  session.notify({message:'Open browser',url:'https://accounts.example/authorize?state=private'})
  const secret=await session.prompt({kind:'secret',message:'API key'})
  session.commit(secret)
 })
 t.after(()=>fixture.broker.dispose())
 const {ticket}=fixture.broker.start(key,'oauth'); await pause()
 assert.throws(()=>fixture.broker.snapshot('other-tab-ticket'),/expired/)
 assert.deepEqual((await fixture.broker.list()).map(entry=>entry.provider),['openai-codex'])
 assert.equal(JSON.stringify(await fixture.broker.list()).includes('state=private'),false)
 const state=fixture.broker.snapshot(ticket)
 assert.equal(state.notice.url,'https://accounts.example/authorize?state=private')
 fixture.broker.answer(ticket,state.prompt.id,'test-secret-token')
 await fixture.broker.attempt(ticket).done
 assert.equal(fixture.stored.get(key),'test-secret-token')
 assert.deepEqual(fixture.broker.snapshot(ticket),{status:'authorized'})
 assert.equal(JSON.stringify(await fixture.broker.list()).includes('test-secret-token'),false)
})

test('cancellation releases the outstanding prompt without storing a credential', async t=>{
 const fixture=setup(async session=>session.commit(await session.prompt({kind:'secret',message:'Key'})))
 t.after(()=>fixture.broker.dispose())
 const {ticket}=fixture.broker.start(key,'oauth'); await pause()
 await fixture.broker.cancel(ticket)
 assert.equal(fixture.broker.snapshot(ticket).status,'cancelled')
 assert.equal(fixture.stored.size,0)
 assert.equal(fixture.active.size,0)
})

test('withdrawn callback prompt is removed while browser authentication may succeed', async t=>{
 let withdraw, finish
 const fixture=setup(async session=>{
  const ctrl=new AbortController(); withdraw=()=>ctrl.abort()
  const answer=session.prompt({kind:'text',message:'Code',signal:ctrl.signal}).catch(()=>undefined)
  await new Promise(resolve=>{finish=resolve}); await answer; session.commit('browser-result')
 })
 t.after(()=>fixture.broker.dispose())
 const {ticket}=fixture.broker.start(key,'oauth'); await pause()
 const id=fixture.broker.snapshot(ticket).prompt.id
 withdraw(); assert.equal(fixture.broker.snapshot(ticket).prompt,undefined)
 assert.throws(()=>fixture.broker.answer(ticket,id,'stale-code'),/expired-prompt/)
 finish(); await fixture.broker.attempt(ticket).done
 assert.equal(fixture.broker.snapshot(ticket).status,'authorized')
})

test('invalid selections and duplicate starts cannot hijack an attempt', async t=>{
 const fixture=setup(async session=>session.commit(await session.prompt({kind:'select',message:'Account',options:[{id:'account-1',label:'Account'}]})))
 t.after(()=>fixture.broker.dispose())
 const {ticket}=fixture.broker.start(key,'oauth'); await pause()
 assert.throws(()=>fixture.broker.start(key,'oauth'),/busy/)
 assert.throws(()=>fixture.broker.start('other/example','oauth'),/invalid-request/)
 const id=fixture.broker.snapshot(ticket).prompt.id
 assert.throws(()=>fixture.broker.answer(ticket,id,'account-2'),/invalid-choice/)
 fixture.broker.answer(ticket,id,'account-1'); await fixture.broker.attempt(ticket).done
})

test('timeout and disposal cancel attempts; provider errors never echo credentials', async()=>{
 const fixture=setup(async session=>{await session.prompt({kind:'text',message:'Wait'})},{timeoutMs:20})
 const {ticket}=fixture.broker.start(key,'oauth'); await new Promise(resolve=>setTimeout(resolve,35))
 assert.equal(fixture.broker.snapshot(ticket).status,'cancelled')
 await fixture.broker.dispose(); assert.equal(fixture.broker.attempts.size,0)
 const failing=setup(async()=>{throw new Error('access-token-secret')})
 const second=failing.broker.start(key,'oauth'); await pause()
 assert.deepEqual(failing.broker.snapshot(second.ticket),{status:'failed'})
 await failing.broker.dispose()
})

test('unsafe provider URLs are stripped and account notices disappear on completion', async t=>{
 const fixture=setup(async session=>{session.notify({message:'Continue',url:'javascript:alert(1)'});await session.prompt({kind:'text',message:'Wait'})})
 t.after(()=>fixture.broker.dispose())
 const {ticket}=fixture.broker.start(key,'oauth');await pause()
 assert.deepEqual(fixture.broker.snapshot(ticket).notice,{message:'Continue'})
})

test('model activation preserves provider configuration and uses optimistic revisions',async t=>{
 const fixture=setup(async session=>session.commit('test-credential'))
 t.after(()=>fixture.broker.dispose())
 await assert.rejects(()=>fixture.broker.enable(key),/not-connected/)
 const {ticket}=fixture.broker.start(key,'oauth');await fixture.broker.attempt(ticket).done
 await fixture.broker.enable(key)
 assert.deepEqual(fixture.writes,[['dsh-pi-login',{providers:{'openai-codex':{enabled:true}}},9]])
 fixture.settings.describe=()=>[{ns:'dsh-pi-login',value:{providers:{'openai-codex':{apiKeyEnv:'EXISTING_KEY',models:[{id:'existing'}]}}},revision:10}]
 await assert.rejects(()=>fixture.broker.enable(key),/api-key-override/)
 assert.equal(fixture.writes.length,1)
})

test('Host registers authenticated Connection routes, rejects malformed envelopes, and redacts errors',async t=>{
 const fixture=setup(async()=>{})
 const effects=[],routes=new Map()
 apply({authorization:fixture.authorization,credentials:fixture.credentials,settings:fixture.settings,effect:body=>{effects.push(body())},connection:{fetch:{register:route=>routes.set(route.path,route)}}})
 t.after(async()=>{for(const effect of effects.reverse())await effect?.();await fixture.broker.dispose()})
 const route=routes.get('/api/dsh-pi-login/start')
 assert.equal(routes.size,10)
 const call=payload=>route.fetch(new Request('http://localhost/api/dsh-pi-login/start',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}))
 assert.equal((await call({})).status,400)
 const response=await call({type:'client-request',rpcId:'test-id',method:'dsh-pi-login/start',payload:{key:'other/credential',method:'oauth'}})
 assert.equal(response.headers.get('cache-control'),'no-store')
 assert.equal((await response.json()).result.error.code,'dsh-pi-login/invalid-request')
 await assert.rejects(()=>dispatch(fixture.broker,'answer',[]),/invalid-request/)
})

test('model and provider switches preserve settings and credentials and reject stale edits', async t => {
 const fixture=setup(async()=>{})
 t.after(()=>fixture.broker.dispose())
 fixture.stored.set(key,'preserved-token')
 let revision=12
 const profiles={'openai-codex':{enabled:true,apiKeyEnv:'OLD_KEY',headers:{'X-Deployment':'keep'},disabledModels:[]}}
 fixture.settings.describe=()=>[{ns:'dsh-pi-login',value:{providers:profiles},revision}]
 fixture.settings.update=async(ns,patch,expected)=>{
  assert.equal(ns,'dsh-pi-login');assert.equal(expected,revision);revision++
  for(const [id,change] of Object.entries(patch.providers))profiles[id]={...profiles[id],...change}
 }
 fixture.settings.mutate=async(ns,ops,expected)=>{
  assert.equal(ns,'dsh-pi-login');assert.equal(expected,revision);revision++
  assert.deepEqual(ops,[{op:'unset',path:['providers','openai-codex','apiKeyEnv']}])
  delete profiles['openai-codex'].apiKeyEnv
 }
 fixture.broker.catalog=()=>[{id:'model-one',name:'Model One'},{id:'model-two',name:'Model Two'}]
 await fixture.broker.setModel(key,'model-one',false,revision)
 assert.deepEqual(fixture.broker.models(key).models.map(model=>model.enabled),[false,true])
 await assert.rejects(fixture.broker.setModel(key,'model-two',false,12),/settings-changed/)
 await assert.rejects(fixture.broker.setModel(key,'unknown',false,revision),/invalid-request/)
 await fixture.broker.setProvider(key,false,revision)
 assert.equal(profiles['openai-codex'].enabled,false)
 assert.equal(fixture.stored.get(key),'preserved-token')
 assert.deepEqual(profiles['openai-codex'].headers,{'X-Deployment':'keep'})
 await assert.rejects(fixture.broker.enable(key),/api-key-override/)
 assert.equal(profiles['openai-codex'].apiKeyEnv,'OLD_KEY')
 await fixture.broker.useLogin(key)
 assert.equal(profiles['openai-codex'].apiKeyEnv,undefined)
 assert.equal(profiles['openai-codex'].enabled,true)
 assert.deepEqual(profiles['openai-codex'].disabledModels,['model-one'])
 assert.equal(fixture.stored.get(key),'preserved-token')
})
