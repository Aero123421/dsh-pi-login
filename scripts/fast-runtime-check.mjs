import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { zstdDecompressSync } from 'node:zlib'
import { PiPlugin, toPiAssistant } from '../.cache/official-host.mjs'
import { fastModelId } from '../src/runtime/fast.ts'

const model = 'gpt-6.1-sol', fast = fastModelId(model)
const token = `fixture.${Buffer.from(JSON.stringify({'https://api.openai.com/auth':{chatgpt_account_id:'fixture-account'}})).toString('base64url')}.fixture`
const requests = []
let rejectPriority = false
const reasoningItem = {id:'rs_fixture', type:'reasoning', summary:[{type:'summary_text',text:'thinking'}], encrypted_content:'encrypted-fixture'}
const textItem = {id:'msg_fixture', type:'message', role:'assistant', status:'completed', content:[{type:'output_text',text:'hello',annotations:[]}]}
const server = createServer(async (request, response) => {
  const chunks = []; for await (const chunk of request) chunks.push(chunk)
  const raw = Buffer.concat(chunks)
  const body = JSON.parse(request.headers['content-encoding'] === 'zstd' ? zstdDecompressSync(raw) : raw)
  requests.push({body,headers:request.headers})
  if (rejectPriority && body.service_tier === 'priority') {
    response.writeHead(400, {'content-type':'application/json'})
    response.end(JSON.stringify({error:{message:'Fast unavailable',type:'invalid_request_error',code:'unsupported_service_tier'}})); return
  }
  response.writeHead(200, {'content-type':'text/event-stream'})
  const events = [
    {type:'response.created',response:{id:'resp_fixture',model}},
    {type:'response.output_item.added',output_index:0,item:{...reasoningItem,summary:[]}},
    {type:'response.reasoning_summary_part.added',output_index:0,summary_index:0,part:{type:'summary_text',text:''}},
    {type:'response.reasoning_summary_text.delta',output_index:0,summary_index:0,delta:'thinking'},
    {type:'response.output_item.done',output_index:0,item:reasoningItem},
    {type:'response.output_item.added',output_index:1,item:{...textItem,content:[]}},
    {type:'response.content_part.added',output_index:1,content_index:0,part:{type:'output_text',text:'',annotations:[]}},
    {type:'response.output_text.delta',output_index:1,content_index:0,delta:'hello'},
    {type:'response.output_item.done',output_index:1,item:textItem},
    {type:'response.completed',response:{id:'resp_fixture',model,status:'completed',output:[reasoningItem,textItem],usage:{input_tokens:3,output_tokens:1,total_tokens:4}}},
  ]
  for (const event of events) response.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`)
  response.end()
})
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
const local = `http://127.0.0.1:${server.address().port}/responses`
const originalFetch = globalThis.fetch
// Keep the real SDK endpoint descriptors, but send every request to the fixture.
globalThis.fetch = (input, init) => {
  const url = new URL(input instanceof Request ? input.url : input)
  assert.ok(['api.openai.com','chatgpt.com'].includes(url.hostname), `Unexpected network destination: ${url.hostname}`)
  return originalFetch(local, input instanceof Request ? {method:input.method,headers:input.headers,body:input.body,duplex:'half',...init} : init)
}
try {
  for (const provider of ['openai','openai-codex']) {
    const source = { apiKeyEnv:'FIXTURE_KEY', transport:'sse', modelOverrides:{[model]:{maxTokens:777}}, headers:{'X-Fixture':'kept'} }
    let profiles = PiPlugin.resolveProfiles({[provider]:source}, 'strict')
    const adapter = new PiPlugin.PiAiAdapter({profiles:()=>profiles,resolveApiKey:async()=>token,auth:{}})
    assert.ok(!(await adapter.listModels(provider)).some(choice=>choice.id===fast))
    await assert.rejects(adapter.resolveModel(provider,fast))
    profiles = PiPlugin.resolveProfiles({[provider]:{...source,enabledFastModels:[fast]}}, 'strict')
    const normalInfo = await adapter.resolveModel(provider,model)
    const fastInfo = await adapter.resolveModel(provider,fast)
    const {id:normalId,name:normalName,...normalCaps} = normalInfo
    const {id:fastId,name:fastName,...fastCaps} = fastInfo
    assert.equal(fastName,`${normalName} Fast`); assert.deepEqual(fastCaps,normalCaps)
    assert.equal(fastInfo.defaultMaxTokens,777)
    const input = {provider,model:fast,reasoningEffort:'high',maxTokens:777,system:'Keep this instruction.',messages:[{role:'user',content:[{type:'text',text:'hello'}]}]}
    async function generate(options, prepared) {
      const chunks = []
      for await (const chunk of prepared ? prepared.stream(options) : adapter.stream(options)) chunks.push(chunk)
      return chunks
    }
    const result = await generate(input)
    const finish = result.find(chunk=>chunk.type==='finish')
    assert.ok(finish.replayState)
    assert.equal(requests.at(-1).body.model,model)
    assert.equal(requests.at(-1).body.service_tier,'priority')
    assert.equal(requests.at(-1).body.reasoning.effort,'high')
    assert.equal(requests.at(-1).headers['x-fixture'],'kept')
    const ordinary = await generate({...input,model})
    assert.equal(requests.at(-1).body.service_tier,'default')
    assert.equal(ordinary.find(chunk=>chunk.type==='finish').replayState.response.wireModel,undefined)

    const replay = finish.replayState
    assert.equal(replay.response.model,fast); assert.equal(replay.response.wireModel,model)
    const history = {role:'assistant',content:[{type:'reasoning',text:'thinking'},{type:'text',text:'hello'}],source:{provider,model:fast,replayState:replay}}
    const restored = toPiAssistant(JSON.parse(JSON.stringify(history)))
    assert.equal(restored.model,model)
    assert.ok(restored.content[0].thinkingSignature.includes('encrypted-fixture'))
    await generate({...input,model,messages:[...input.messages,history,{role:'user',content:[{type:'text',text:'continue'}]}]})
    assert.ok(requests.at(-1).body.input.some(item=>item.encrypted_content==='encrypted-fixture'))
    let degraded
    toPiAssistant({...history,source:{...history.source,replayState:{...replay,response:{...replay.response,wireModel:{}}}}},reason=>{degraded=reason})
    assert.match(degraded,/wireModel/)

    // Subscription grants use the same SDK auth path for ordinary and Fast choices.
    const {apiKeyEnv:_reference,...oauthSource} = source
    const oauthProfiles = PiPlugin.resolveProfiles({[provider]:{...oauthSource,enabledFastModels:[fast]}}, 'strict')
    const oauthAdapter = new PiPlugin.PiAiAdapter({profiles:()=>oauthProfiles,resolveApiKey:async()=>undefined,auth:{
      credentials:{read:async()=>({type:'oauth',access:token,refresh:'fixture-refresh',expires:Date.now()+3600000}),list:async()=>[],modify:async()=>{throw new Error('Unexpected token refresh')}},
    }})
    const oauthResult = []
    for await (const chunk of oauthAdapter.stream(input)) oauthResult.push(chunk)
    assert.ok(oauthResult.find(chunk=>chunk.type==='finish').replayState)
    assert.equal(requests.at(-1).body.service_tier,'priority')
    assert.equal(requests.at(-1).headers.authorization,`Bearer ${token}`)

    // Prepared calls keep their snapshot; subsequent calls use updated settings.
    const prepared = await adapter.prepareCall(provider,fast)
    profiles = PiPlugin.resolveProfiles({[provider]:{...source,disabledModels:[model],enabledFastModels:[fast]}}, 'strict')
    await assert.rejects(adapter.resolveModel(provider,model))
    assert.ok((await adapter.listModels(provider)).some(choice=>choice.id===fast))
    profiles = PiPlugin.resolveProfiles({[provider]:{...source,disabledModels:[model],enabledFastModels:[]}}, 'strict')
    await assert.rejects(adapter.resolveModel(provider,fast))
    await generate(input,prepared)
    assert.equal(requests.at(-1).body.service_tier,'priority')
    rejectPriority = true
    const before = requests.length
    const failed = await generate(input,prepared)
    assert.equal(requests.length,before+1)
    assert.equal(failed.find(chunk=>chunk.type==='finish').replayState,undefined)
    rejectPriority = false
  }
  console.log('Fast variants: real SDK/API payloads, independent model choices, capabilities, saved replay, prepared snapshots, and no fallback passed')
} finally {
  globalThis.fetch = originalFetch
  await new Promise(resolve=>server.close(resolve))
}
