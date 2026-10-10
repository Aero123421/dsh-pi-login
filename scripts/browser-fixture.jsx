import React from 'react'
import * as ReactDom from 'react-dom'
import * as ReactJsxRuntime from 'react/jsx-runtime'
import { Context } from '@deepseek-ai/cordis'
import { apply as renderer } from '@deepseek-ai/dsh-client-ui-renderer/client'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { createWebConnectionRpc } from '../.cache/upstream/packages/client/connection/src/client/rpc.ts'

const factories=new Map()
window.__ModuleLoader__={load:({id,factory})=>factories.set(id,factory)}
window.mountPlugins=async()=>{
 const ctx=new Context()
 const locale=new LocaleRuntime(ctx)
 // Simulate a host with Japanese available; this fixture loads no language pack.
 ctx.effect(()=>locale.addLanguage({id:'ja',label:'日本語',fallback:'en'}))
 locale.register('settings.models',{en:{nav:'Models'},ja:{nav:'モデル'}})
 ctx.provide('locale',locale)
 ctx.provide('connection',{rpc:createWebConnectionRpc(),isLoopback:true})
 const root=ctx.plugin(renderer);await root.await()
 const absent=Object.freeze({key:undefined,hooks:{},keyedHooks:{},props:{}})
 const source={getSnapshot:()=>absent,subscribe:()=>()=>{}}
 ctx.slots.installScope('session',{current:source,bindingSource:()=>source})
 ctx.slots.register({name:'root',id:'compat-models',children:{'settings.models.footer':{kind:'list',scope:'root'},'settings.models.provider-card':{kind:'keyed',scope:'root'}}},({renderSlot})=><main style={{maxWidth:720,margin:'32px auto',padding:24,fontFamily:'var(--dsw-font-family)',color:'var(--dsw-alias-label-primary)'}}>
  <h1 style={{fontSize:22,fontWeight:500}}>DeepSeek Harness</h1>
  <h2 style={{fontSize:18,fontWeight:500}}>{locale.bind('settings.models')('nav')}</h2>
  <div style={{padding:16,border:'1px solid var(--dsw-alias-border-l2)',borderRadius:12}}><span>ChatGPT</span>{renderSlot('settings.models.provider-card',{provider:{provider:'openai-codex',displayName:'ChatGPT',settingsNs:'dsh-pi-login',settingsPath:['providers','openai-codex'],active:false},configured:false,keyConfigured:false},{entryKey:'dsh-pi-login'})}</div>
  {renderSlot('settings.models.footer',{})}
 </main>)
 const loaded=[]
 for(const id of ['@local/dsh-pi-login']){
  const shared={'react':React,'react-dom':ReactDom,'react/jsx-runtime':ReactJsxRuntime}
  const plugin=factories.get(id)(specifier=>{if(specifier in shared)return shared[specifier];throw new Error(`Unexpected external ${specifier}`)})
  const fiber=ctx.plugin(plugin);await fiber.await();loaded.push(fiber)
 }
 await locale.setLocale('ja')
 document.documentElement.lang='ja'
 const unmount=ctx.uiRenderer.mount(document.getElementById('app'))
 window.testRuntime={ctx,locale,dispose:async()=>{unmount();for(const fiber of loaded.reverse())await fiber.dispose();await root.dispose();await ctx.fiber.dispose()}}
}
