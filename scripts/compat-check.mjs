import { mkdir, writeFile, readFile } from 'node:fs/promises'
import ts from 'typescript'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'
import { compileOfficial, ensureUpstream } from './upstream.mjs'
await ensureUpstream()
await mkdir('.cache',{recursive:true})
const patchSource=await readFile('.cache/upstream/vendor/include/src/index.ts','utf8')
const patchAst=ts.createSourceFile('include.ts',patchSource,ts.ScriptTarget.Latest,true)
await writeFile('.cache/official-entry-patches.ts',patchAst.statements.find(node=>node.name?.text==='applyEntryPatches').getText(patchAst))
await writeFile('.cache/host-entry.ts', `
export { Context } from './upstream/vendor/cordis/src/index.ts';
export { default as AuthorizationService } from './upstream/packages/credentials/authorization/src/index.ts';
export { MemoryCredentials } from './upstream/packages/credentials/authorization/tests/memory.ts';
export { HostConnectionService } from './upstream/packages/client/connection/src/rpc-host.ts';
export { BrowserAuth } from './upstream/packages/client/connection/src/browser-auth.ts';
export { credentialKey } from './upstream/packages/credentials/credentials/src/index.ts';
export * as PiPlugin from '../dist/index.js';
export { applyEntryPatches } from './official-entry-patches.ts';
export { toPiAssistant } from '../src/runtime/replay.ts';
export { connectionAuthFrom } from '../src/runtime/auth.ts';
`)
await compileOfficial('.cache/host-entry.ts','.cache/official-host.mjs')
const {Context,AuthorizationService,MemoryCredentials,HostConnectionService,PiPlugin:host}=await import(pathToFileURL(resolve('.cache/official-host.mjs')).href)
const ctx=new Context()
await ctx.plugin(MemoryCredentials)
await ctx.plugin(AuthorizationService)
await ctx.plugin(pluginCtx=>{new HostConnectionService(pluginCtx,[],{isAuthenticated:()=>true})})
ctx.provide('settings',{describe:()=>[{ns:'dsh-pi-login',value:{providers:{}},revision:3}],update:async()=>{}})
const key='llm-pi-ai/openai-codex'
ctx.authorization.registerFlow({key,label:'ChatGPT',methods:[{id:'oauth',label:'ChatGPT'}],async run(session){
 session.notify({message:'Continue',url:'https://accounts.example/authorize'})
 const value=await session.prompt({kind:'secret',message:'Key'})
 await session.commit({kind:'grant',payload:{token:value}})
}})
const fiber=ctx.plugin({apply:host.applyLoginUI,inject:['authorization','credentials','connection','settings']})
await fiber.await()
const handler=ctx.connection.createSharedFetchHandler('/api')
const owner=ctx.connection.browserPeer
async function call(method,payload={}) {
 const endpoint=`dsh-pi-login/${method}`
 const response=await handler.fetch(new Request(`http://localhost/api/${endpoint}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:'client-request',rpcId:'compat',method:endpoint,payload})}),owner)
 const value=await response.json()
 assert.equal(value.result.ok,true,JSON.stringify(value))
 return value.result.value
}
try {
 assert.equal((await call('list'))[0].configured,false)
 const {ticket}=await call('start',{key,method:'oauth'})
 await new Promise(resolve=>setImmediate(resolve))
 const state=await call('state',{ticket})
 assert.equal(state.prompt.kind,'secret')
 await call('answer',{ticket,id:state.prompt.id,value:'compat-secret'})
 await new Promise(resolve=>setImmediate(resolve))
 assert.equal((await call('state',{ticket})).status,'authorized')
 assert.equal((await call('list'))[0].configured,true)
 assert.equal((await ctx.credentials.readRecord(key)).payload.token,'compat-secret')
 const endpoint=new Request('http://localhost/api/dsh-pi-login/list',{method:'POST'})
 assert.equal((await handler.fetch(endpoint,{principal:{kind:'api'}})).status,403)
 await fiber.dispose()
 assert.equal((await handler.fetch(endpoint,owner)).status,404)
 console.log('Official Cordis / Authorization / Credentials / Connection: login, persistence, and unload passed')
} finally {await ctx.fiber.dispose()}
