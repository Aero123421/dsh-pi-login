import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PiLoginBroker, dispatch } from '../src/broker.mjs'
import { applyLoginUI as apply } from '../src/routes.mjs'
import { getBuiltinModels } from '@earendil-works/pi-ai/providers/all'
import { modelChoices, fastModelId } from '../src/runtime/fast.ts'
import { ConnectionManager } from '../src/connections.mjs'
import { IntegrationRegistry } from '../src/registry.mjs'

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

test('timeout and disposal cancel attempts; provider errors never echo credentials', async t=>{
 t.mock.timers.enable({apis:['setTimeout']})
 const fixture=setup(async session=>{await session.prompt({kind:'text',message:'Wait'})},{timeoutMs:20})
 const {ticket}=fixture.broker.start(key,'oauth'); await pause()
 t.mock.timers.tick(20); await pause()
 assert.equal(fixture.broker.snapshot(ticket).status,'cancelled')
 await fixture.broker.dispose(); assert.equal(fixture.broker.attempts.size,0)
 const failing=setup(async()=>{throw new Error('access-token-secret')})
 const second=failing.broker.start(key,'oauth'); await pause()
 assert.deepEqual(failing.broker.snapshot(second.ticket),{status:'failed'})
 await failing.broker.dispose()
})

test('a device code can complete after ten minutes within the SDK lifetime', async t => {
 t.mock.timers.enable({apis:['setTimeout']})
 const fixture=setup(async session=>{
  session.notify({message:'Enter code',code:'TEST-CODE',expiresInSeconds:15*60})
  session.commit(await session.prompt({kind:'text',message:'Wait for approval'}))
 })
 t.after(()=>fixture.broker.dispose())
 const {ticket}=fixture.broker.start(key,'oauth'); await pause()
 t.mock.timers.tick(10*60*1000); await pause()
 assert.equal(fixture.broker.snapshot(ticket).status,'running')
 t.mock.timers.tick(4*60*1000+59*1000)
 const {prompt}=fixture.broker.snapshot(ticket)
 fixture.broker.answer(ticket,prompt.id,'approved-credential')
 await fixture.broker.attempt(ticket).done
 assert.equal(fixture.broker.snapshot(ticket).status,'authorized')
 assert.equal(fixture.stored.get(key),'approved-credential')
})

test('a stalled device flow times out only after the SDK deadline and grace', async t => {
 t.mock.timers.enable({apis:['setTimeout']})
 const fixture=setup(async session=>{
  session.notify({message:'Enter code',code:'PRIVATE-CODE',expiresInSeconds:15*60})
  await session.prompt({kind:'text',message:'Wait'})
 })
 t.after(()=>fixture.broker.dispose())
 const {ticket}=fixture.broker.start(key,'oauth'); await pause()
 t.mock.timers.tick(15*60*1000); await pause()
 assert.equal(fixture.broker.snapshot(ticket).status,'running')
 t.mock.timers.tick(60*1000); await fixture.broker.attempt(ticket).done
 assert.deepEqual(fixture.broker.snapshot(ticket),{status:'cancelled',reason:'timeout'})
 assert.equal(fixture.stored.size,0)
})

test('SDK expiry and a user cancellation remain distinct without exposing errors', async t => {
 const cancelled=setup(async session=>session.prompt({kind:'text',message:'Wait'}))
 t.after(()=>cancelled.broker.dispose())
 for(const message of ['Device flow timed out','Device flow timed out after one or more slow_down responses. Provider guidance.']) {
  const expired=setup(async()=>{throw new Error(message)})
  try {
   const first=expired.broker.start(key,'oauth'); await expired.broker.attempt(first.ticket).done
   assert.deepEqual(expired.broker.snapshot(first.ticket),{status:'failed',reason:'provider-expired'})
  }finally{await expired.broker.dispose()}
 }
 const second=cancelled.broker.start(key,'oauth'); await pause()
 await cancelled.broker.cancel(second.ticket)
 assert.deepEqual(cancelled.broker.snapshot(second.ticket),{status:'cancelled'})
})

test('invalid provider expiry does not overflow or extend the fallback timer', async t => {
 t.mock.timers.enable({apis:['setTimeout']})
 for(const expiresInSeconds of ['900',Infinity,-1,Number.MAX_SAFE_INTEGER]) {
  const fixture=setup(async session=>{
   session.notify({message:'Wait',expiresInSeconds})
   await session.prompt({kind:'text',message:'Wait'})
  },{timeoutMs:100})
  const {ticket}=fixture.broker.start(key,'oauth'); await pause()
  t.mock.timers.tick(99)
  assert.equal(fixture.broker.snapshot(ticket).status,'running')
  t.mock.timers.tick(1); await fixture.broker.attempt(ticket).done
  assert.deepEqual(fixture.broker.snapshot(ticket),{status:'cancelled',reason:'timeout'})
  await fixture.broker.dispose()
 }
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
 apply({get:()=>undefined,authorization:fixture.authorization,credentials:fixture.credentials,settings:fixture.settings,effect:body=>{effects.push(body())},connection:{fetch:{register:route=>routes.set(route.path,route)}}})
 t.after(async()=>{for(const effect of effects.reverse())await effect?.();await fixture.broker.dispose()})
 const route=routes.get('/api/dsh-pi-login/start')
 for(const method of ['connection-list','connection-create','connection-update','connection-clone','connection-delete','connection-cleanup','usage']) assert.ok(routes.has(`/api/dsh-pi-login/${method}`))
 const call=payload=>route.fetch(new Request('http://localhost/api/dsh-pi-login/start',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}))
 assert.equal((await call({})).status,400)
 const response=await call({type:'client-request',rpcId:'test-id',method:'dsh-pi-login/start',payload:{key:'other/credential',method:'oauth'}})
 assert.equal(response.headers.get('cache-control'),'no-store')
 assert.equal((await response.json()).result.error.code,'dsh-pi-login/invalid-request')
 await assert.rejects(()=>dispatch(fixture.broker,'answer',[]),/invalid-request/)
})

test('Fast model selection is independent, preserves credentials, and rejects stale writes', async t => {
 const fixture=setup(async()=>{})
 t.after(()=>fixture.broker.dispose())
 fixture.stored.set(key,'preserved-token')
 let revision=22
 const profiles={'openai-codex':{enabled:true,apiKeyEnv:'SAFE_KEY',headers:{'X-Keep':'true'},disabledModels:[]}}
 fixture.settings.describe=()=>[{ns:'dsh-pi-login',value:{providers:profiles},revision}]
 fixture.settings.update=async (ns,patch,expected)=>{
   assert.equal(ns,'dsh-pi-login');assert.equal(expected,revision);revision++
   for(const [id,change] of Object.entries(patch.providers)) profiles[id]={...profiles[id],...change}
 }
 const model=getBuiltinModels('openai-codex').find(model=>model.id==='gpt-6.1-sol')
 const fast=fastModelId(model.id)
 fixture.broker.catalog=(provider,profile)=>modelChoices(provider,[model],profile)
 assert.deepEqual(fixture.broker.models(key).models.map(model=>model.enabled),[true,false])
 await fixture.broker.setModel(key,fast,true,revision)
 await fixture.broker.setModel(key,model.id,false,revision)
 assert.deepEqual(fixture.broker.models(key).models.map(model=>model.enabled),[false,true])
 await assert.rejects(fixture.broker.setModel(key,'unknown::fast',true,revision),/invalid-request/)
 await assert.rejects(fixture.broker.setModel(key,fast,false,22),/settings-changed/)
 await fixture.broker.setProvider(key,false,revision)
 assert.deepEqual(profiles['openai-codex'].enabledFastModels,[fast])
 assert.deepEqual(profiles['openai-codex'].disabledModels,[model.id])
 assert.equal(fixture.stored.get(key),'preserved-token')
 await fixture.broker.setProvider(key,true,revision)
 await fixture.broker.setModel(key,fast,false,revision)
 assert.deepEqual(profiles['openai-codex'].enabledFastModels,[])
 assert.deepEqual(profiles['openai-codex'].headers,{'X-Keep':'true'})
 assert.equal(profiles['openai-codex'].apiKeyEnv,'SAFE_KEY')
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

function connectionSetup(run = async () => {}) {
 const stored = new Map(), active = new Set(), events = []
 const registry = new IntegrationRegistry('profile-a')
 registry.register({integrationId:'pi',label:'Pi',source:'fixture',listConnections:()=>[],listServices:()=>[{
  serviceId:'openai-codex',label:'Codex',methods:[{id:'oauth',label:'Sign in'}],capabilities:{auth:true,models:true,settings:true},
 }]})
 let revision = 1, raw = Object.fromEntries(['a','b'].map(account=>[`c-account-${account}`,{
  integrationId:'pi',serviceId:'openai-codex',routeId:`pi-c-account-${account}`,credentialRecordId:`c-account-${account}`,
  credentialGeneration:0,authMethod:'oauth',displayName:`Account ${account}`,enabled:false,
  profile:{disabledModels:[],enabledFastModels:[]},
 }]))
 const settings = {
  describe:()=>[{ns:'dsh-pi-login',revision,writable:true,value:{connections:raw,connectionMigrationVersion:1,trustedEndpointOrigins:['https://models.example']}}],
  async mutate(ns,ops,expected) {
   assert.equal(ns,'dsh-pi-login'); assert.equal(expected,revision)
   for(const op of ops) { assert.equal(op.op,'set'); assert.deepEqual(op.path,['connections']); raw=structuredClone(op.value) }
   revision++
  },
 }
 const credentials = {
  describeRecord:async key=>({configured:stored.has(key),writable:true}),
  readRecord:async key=>stored.get(key),listRecords:async()=>[],
 }
 const connections = new ConnectionManager({settings,credentials,registry})
 const entries = new Map(['a','b'].map(account=>{const key=`llm-pi-ai/c-account-${account}`;return [key,{key,label:`Account ${account}`,methods:[{id:'oauth',label:'Sign in'}]}]}))
 const authorization = {
  list:()=>[...entries.values()].map(entry=>({...entry,inFlight:active.has(entry.key)})),
  describe:key=>entries.has(key)?{...entries.get(key),inFlight:active.has(key)}:undefined,
  async begin({key,signal,interaction}) {
   const id=Object.keys(raw).find(id=>connections.authKey(raw[id])===key)
   events.push({type:'begin',id,generation:connections.lookup(id).credentialGeneration})
   active.add(key)
   try { await run({id,signal,...interaction,commit:value=>stored.set(key,value)}); return {status:signal.aborted?'cancelled':'authorized'} }
   finally {active.delete(key)}
  },
 }
 const catalogs = new Map(['a','b'].map(account=>[`c-account-${account}`,{
  state:()=>({canRefresh:true}),validate:async()=>{},refresh:async()=>events.push({type:'refresh',id:`c-account-${account}`}),
 }]))
 const broker = new PiLoginBroker(authorization,credentials,settings,{
  connections,catalogsFor:connection=>catalogs.get(connection.connectionId),
  syncFlows:()=>events.push({type:'sync'}),
  catalog:(_service,profile)=>[
   {id:'regular',name:'Regular',enabled:!profile.disabledModels?.includes('regular')},
   {id:'regular::fast',name:'Fast',serviceTier:'priority',enabled:profile.enabledFastModels?.includes('regular::fast')},
  ],
 })
 return {broker,connections,registry,stored,events,catalogs,entries,get raw(){return raw},get revision(){return revision},
  payload:extra=>({profileKey:registry.profileKey,generation:registry.generation,...extra})}
}

test('connection tickets bump only their credential generation and enforce account and profile ownership', async t => {
 const f=connectionSetup(async session=>session.commit(await session.prompt({kind:'secret',message:'Account credential'})))
 t.after(()=>f.broker.dispose())
 await assert.rejects(dispatch(f.broker,'start',{connectionId:'c-account-a',method:'oauth'}),/profile-changed/)
 const a=await dispatch(f.broker,'start',f.payload({connectionId:'c-account-a',method:'oauth'}))
 const b=await dispatch(f.broker,'start',f.payload({connectionId:'c-account-b',method:'oauth'}))
 await pause()
 assert.deepEqual(f.events.filter(event=>event.type==='begin').map(event=>event.generation),[1,1])
 assert.equal(f.connections.pendingLogins.size,2)
 const promptA=f.broker.snapshot(a.ticket).prompt, promptB=f.broker.snapshot(b.ticket).prompt
 await assert.rejects(dispatch(f.broker,'answer',f.payload({connectionId:'c-account-b',ticket:a.ticket,id:promptA.id,value:'wrong-account'})),/invalid-request/)
 await dispatch(f.broker,'answer',f.payload({connectionId:'c-account-a',ticket:a.ticket,id:promptA.id,value:'account-a-token'}))
 await dispatch(f.broker,'answer',f.payload({connectionId:'c-account-b',ticket:b.ticket,id:promptB.id,value:'account-b-token'}))
 await Promise.all([f.broker.attempt(a.ticket).done,f.broker.attempt(b.ticket).done])
 assert.equal(f.stored.get('llm-pi-ai/c-account-a'),'account-a-token')
 assert.equal(f.stored.get('llm-pi-ai/c-account-b'),'account-b-token')
 assert.equal(f.connections.pendingLogins.size,0)
 assert.doesNotMatch(JSON.stringify(await f.broker.list()),/account-a-token|account-b-token/)
})

test('connection model selections, catalog refresh and activation leave the other account unchanged', async t => {
 const f=connectionSetup(); t.after(()=>f.broker.dispose())
 f.stored.set('llm-pi-ai/c-account-a','account-a-token');f.stored.set('llm-pi-ai/c-account-b','account-b-token')
 const untouched=structuredClone(f.raw['c-account-b'])
 await f.broker.setModel('c-account-a','regular::fast',true,f.revision)
 await f.broker.setModel('c-account-a','regular',false,f.revision)
 await f.broker.enable('c-account-a')
 await f.broker.refreshModels('c-account-a')
 assert.deepEqual(f.raw['c-account-b'],untouched)
 assert.deepEqual(f.broker.models('c-account-a').models.map(model=>model.enabled),[false,true])
 assert.deepEqual(f.broker.models('c-account-b').models.map(model=>model.enabled),[true,false])
 assert.deepEqual(f.events.filter(event=>event.type==='refresh'),[{type:'refresh',id:'c-account-a'}])
 assert.equal(f.raw['c-account-a'].credentialGeneration,0)
 assert.equal(f.raw['c-account-a'].enabled,true)
 await assert.rejects(f.broker.setModel('c-account-a','regular',true,1),/settings-changed/)
 assert.throws(()=>f.broker.models('llm-pi-ai/c-account-a'),/invalid-request/)
 assert.throws(()=>f.broker.models('llm-pi-ai/openai-codex'),/invalid-request/)
})

test('profile switch withdraws connection prompts and rejects delayed model refresh results', async t => {
 const f=connectionSetup(async session=>{await session.prompt({kind:'text',message:'Approve'})})
 t.after(()=>f.broker.dispose())
 const {ticket}=await dispatch(f.broker,'start',f.payload({connectionId:'c-account-a',method:'oauth'}))
 await pause()
 const prompt=f.broker.snapshot(ticket).prompt
 let release
 f.catalogs.get('c-account-b').refresh=()=>new Promise(resolve=>{release=resolve})
 const refreshing=f.broker.refreshModels('c-account-b')
 f.registry.switchProfile('profile-b');release()
 await assert.rejects(refreshing,/connection-changed/)
 await f.broker.attempt(ticket).done
 assert.deepEqual(f.broker.snapshot(ticket),{status:'cancelled',reason:'connection-changed'})
 assert.throws(()=>f.broker.answer(ticket,prompt.id,'stale-answer'),/connection-changed/)
 assert.equal(f.stored.size,0)
 assert.equal(f.connections.pendingLogins.size,0)
})

test('endpoint changes reject delayed catalog results while retaining the account generation', async t => {
 const f=connectionSetup();t.after(()=>f.broker.dispose())
 let release
 f.catalogs.get('c-account-a').refresh=()=>new Promise(resolve=>{release=resolve})
 const refreshing=f.broker.refreshModels('c-account-a')
 await f.connections.update('c-account-a',{endpointUrl:'https://models.example/v1'},f.revision)
 release()
 await assert.rejects(refreshing,/connection-changed/)
 assert.equal(f.raw['c-account-a'].credentialGeneration,0)
 assert.equal(f.raw['c-account-a'].profile.baseURL,'https://models.example/v1')
})

test('independent integration auth and activation remain owned by its namespace', async t => {
 const f=connectionSetup(async session=>session.commit(await session.prompt({kind:'secret',message:'Independent account'})))
 t.after(()=>f.broker.dispose())
 const ownKey=connection=>`independent-auth/${connection.credentialRecordId}`
 let activated=0
 f.registry.register({integrationId:'independent-fixture',label:'Independent',listConnections:()=>[],
  listServices:()=>[{serviceId:'subscription',label:'Subscription',methods:[{id:'oauth',label:'Sign in'}],capabilities:{auth:true,settings:true}}],
  authKey:ownKey,describeConnection:async connection=>({configured:f.stored.has(ownKey(connection)),writable:true}),
  validateConnection:()=>{},
  enable:async()=>{activated++;return {enabled:true}},
 })
 f.raw['c-independent']={integrationId:'independent-fixture',serviceId:'subscription',routeId:'independent-fixture',credentialRecordId:'c-independent',credentialGeneration:0,authMethod:'oauth',displayName:'Independent account',enabled:false,profile:{}}
 f.entries.set('independent-auth/c-independent',{key:'independent-auth/c-independent',label:'Independent account',methods:[{id:'oauth',label:'Sign in'}]})
 const {ticket}=await dispatch(f.broker,'start',f.payload({connectionId:'c-independent',method:'oauth'}))
 await pause()
 const prompt=f.broker.snapshot(ticket).prompt
 await dispatch(f.broker,'answer',f.payload({connectionId:'c-independent',ticket,id:prompt.id,value:'independent-token'}))
 await f.broker.attempt(ticket).done
 assert.deepEqual(f.broker.snapshot(ticket),{status:'authorized'})
 assert.equal(f.stored.get('independent-auth/c-independent'),'independent-token')
 assert.equal(f.stored.has('llm-pi-ai/c-independent'),false)
 await f.broker.enable('c-independent')
 assert.equal(activated,1)
 assert.throws(()=>f.broker.start('independent-auth/c-independent','oauth'),/connection-unavailable/)
})

test('Muse Code login failures expose no provider messages or logs', async t => {
 const logged=[]
 t.mock.method(console,'error',(...args)=>{logged.push(args)})
 t.mock.method(console,'warn',(...args)=>{logged.push(args)})
 const f=connectionSetup(async()=>{throw Object.assign(new Error('private-account-token in provider error'),{code:'private-account-token'})});t.after(()=>f.broker.dispose())
 f.registry.register({integrationId:'meta-muse-code',label:'Meta',listConnections:()=>[],
  listServices:()=>[{serviceId:'muse-code',label:'Muse Code',methods:[{id:'oauth',label:'Sign in with Meta'}],capabilities:{auth:true,settings:true}}],
  authKey:connection=>`llm-pi-ai/${connection.credentialRecordId}`,
  describeConnection:async()=>({configured:false,writable:true}),validateConnection:()=>{},
 })
 f.raw['c-muse']={integrationId:'meta-muse-code',serviceId:'muse-code',routeId:'muse-c-muse',credentialRecordId:'c-muse',credentialGeneration:0,authMethod:'oauth',displayName:'Muse fixture',enabled:false,profile:{}}
 f.entries.set('llm-pi-ai/c-muse',{key:'llm-pi-ai/c-muse',label:'Muse Code',methods:[{id:'oauth',label:'Sign in with Meta'}]})
 const {ticket}=await dispatch(f.broker,'start',f.payload({connectionId:'c-muse',method:'oauth'}))
 await f.broker.attempt(ticket).done
 const snapshot=f.broker.snapshot(ticket)
 assert.deepEqual(snapshot,{status:'failed'})
 assert.doesNotMatch(JSON.stringify(snapshot),/private-account-token|provider error/)
 assert.equal(f.connections.pendingLogins.size,0)
 assert.deepEqual(logged,[])
})

test('unverified configured gateway models retain their independent capability warning', async t => {
 const legacy=setup(async()=>{});t.after(()=>legacy.broker.dispose())
 legacy.broker.catalog=()=>[{id:'gateway-model',name:'Gateway model',capabilityUnverified:true}]
 assert.equal(legacy.broker.models(key).models[0].capabilityUnverified,true)
 assert.equal(legacy.broker.models(key).models[0].discovered,undefined)
 const connected=connectionSetup();t.after(()=>connected.broker.dispose())
 connected.broker.catalog=()=>[{id:'gateway-model',name:'Gateway model',capabilityUnverified:true}]
 assert.equal(connected.broker.models('c-account-a').models[0].capabilityUnverified,true)
 assert.equal(connected.broker.models('c-account-a').models[0].discovered,undefined)
})

test('scoped model reads and writes reject previous profile and authentication generations before any catalog work', async t => {
 const f=connectionSetup(async()=>{})
 t.after(()=>f.broker.dispose())
 const id='c-account-a'
 const before=structuredClone(f.raw[id].profile)
 let validated=0
 f.catalogs.get(id).validate=async()=>{validated++}
 const old=f.payload({connectionId:id,credentialGeneration:0})
 assert.equal((await dispatch(f.broker,'models',old)).connectionId,id)
 assert.equal(validated,1)
 await f.connections.beginLogin(id)
 for(const method of ['models','refresh-models','set-model']) {
  await assert.rejects(dispatch(f.broker,method,{...old,model:'regular',enabled:false,revision:f.revision}),error=>error.code==='connection-changed')
 }
 assert.equal(validated,1)
 assert.deepEqual(f.raw[id].profile,before)
 f.registry.switchProfile('other-profile')
 await assert.rejects(dispatch(f.broker,'models',{...old,credentialGeneration:1}),error=>error.code==='profile-changed')
 assert.equal(validated,1)
})
