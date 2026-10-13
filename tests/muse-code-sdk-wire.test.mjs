import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, chmod, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createSdkMuseHostFactory, museCodeEnvironment } from '../src/muse-code-host.mjs'
import { EXPECTED_SCHEMA_FINGERPRINT } from '@muse-code/sdk'

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'dsh-muse-sdk-wire-'))
  const home = join(root, 'home'), dataRoot = join(root, 'data')
  await Promise.all([mkdir(home), mkdir(dataRoot)])
  const bin = join(root, 'muse-fixture.mjs')
  await writeFile(bin, `#!${process.execPath}
import { createInterface } from 'node:readline';
const send = frame => process.stdout.write(JSON.stringify({jsonrpc:'2.0',...frame})+'\\n');
const result = (id,value) => send({id,result:value});
let approvalRequest;
for await (const line of createInterface({input:process.stdin})) {
  const frame=JSON.parse(line);
  if (frame.id === 901) {
    result(approvalRequest,{approved:!frame.error,errorCode:frame.error?.code});
    continue;
  }
  if (frame.method === 'initialize') {
    result(frame.id,{experimentalApi:true,grantedCapabilities:[],museHome:process.env.HOME,
      platformFamily:'unix',platformOs:'linux',schema:{version:1,fingerprint:${JSON.stringify(EXPECTED_SCHEMA_FINGERPRINT)}},
      serverInfo:{name:'fixture',version:'1.4.7'},userAgent:'fixture',received:frame.params});
  } else if (frame.method === 'initialized') {
    continue;
  } else if (frame.method === 'fixture/environment') {
    result(frame.id,{args:process.argv.slice(2),cwd:process.cwd(),env:process.env});
  } else if (frame.method === 'account/loginStart') {
    result(frame.id,{verificationUrl:'https://auth.meta.com/fixture',userCode:'FIXTURE-CODE'});
    send({method:'account/loginCompleted',params:{outcome:'granted'}});
  } else if (frame.method === 'fixture/approval') {
    approvalRequest=frame.id;
    send({id:901,method:'userInput/request',params:{message:'Fixture approval'}});
  } else if (frame.method === 'turn/start') {
    result(frame.id,{commandId:frame.params.commandId,params:frame.params});
  } else {
    send({id:frame.id,error:{code:-32601,message:'method unavailable'}});
  }
}
`)
  await chmod(bin, 0o700)
  return { root, home, dataRoot, bin, cleanup: () => rm(root, { recursive: true, force: true }) }
}

test('official Muse SDK 1.4.7 factory negotiates MSP, delivers notification objects, rejects server tools, and isolates ambient accounts', { timeout: 15_000 }, async t => {
  const f = await fixture()
  let host
  try {
    const environment = {
      PATH: process.env.PATH, META_API_KEY: 'ambient-meta', OPENAI_API_KEY: 'ambient-openai',
      MUSE_AUTH_PATH: '/ambient/account.json', XDG_CONFIG_HOME: '/ambient/config', HOME: '/ambient/home',
      NODE_OPTIONS: '--require /ambient/inject.cjs', MUSE_EXPERIMENTAL_SDK_ENABLED: 'off',
    }
    host = await createSdkMuseHostFactory({ museBin: f.bin })({
      home: f.home, dataRoot: f.dataRoot, env: museCodeEnvironment(f.home, f.dataRoot, environment),
      signal: AbortSignal.any([t.signal, AbortSignal.timeout(10_000)]),
    })
    assert.deepEqual(host.initializeResult.received.capabilities, { experimentalApi: true, userInputDialogs: false })
    assert.equal(host.initializeResult.received.clientInfo.name, 'dsh_muse_code')
    const observed = await host.request('fixture/environment')
    assert.deepEqual(observed.args, ['serve'])
    assert.equal(observed.cwd, f.home)
    for (const key of ['META_API_KEY', 'OPENAI_API_KEY', 'MUSE_AUTH_PATH', 'NODE_OPTIONS']) assert.equal(observed.env[key], undefined)
    assert.equal(observed.env.HOME, f.home)
    assert.equal(observed.env.XDG_CONFIG_HOME, join(f.home, '.config'))
    assert.equal(observed.env.XDG_DATA_HOME, f.dataRoot)
    assert.equal(observed.env.TBH_CREDENTIAL_BACKEND, 'file')
    assert.equal(observed.env.MUSE_EXPERIMENTAL_SDK_ENABLED, 'on')
    const notifications = []
    const completed = new Promise(resolve => host.onNotification(frame => {
      notifications.push(frame)
      if (frame.method === 'account/loginCompleted') resolve()
    }))
    const started = await host.request('account/loginStart', { type: 'deviceCode' })
    assert.equal(started.userCode, 'FIXTURE-CODE')
    await completed
    assert.deepEqual(notifications[0], { jsonrpc: '2.0', method: 'account/loginCompleted', params: { outcome: 'granted' } })
    const approval = await host.request('fixture/approval')
    assert.equal(approval.approved, false)
    assert.equal(approval.errorCode, -32603)
    const turn = await host.command('turn/start', { sessionId: 'fixture-session', input: [{ type: 'text', text: 'fixture' }] })
    assert.equal(typeof turn.commandId, 'string')
    assert.equal(turn.params.sessionId, 'fixture-session')
  } finally { await host?.close(); await f.cleanup() }
})

test('aborting during SDK loading prevents a late Muse child from spawning', async () => {
  const f = await fixture()
  try {
    let resolveSdk, spawned = 0
    const loading = new Promise(resolve => { resolveSdk = resolve })
    const controller = new AbortController()
    const factory = createSdkMuseHostFactory({ museBin: f.bin, sdkLoader: () => loading })
    const started = factory({ home: f.home, dataRoot: f.dataRoot, env: museCodeEnvironment(f.home, f.dataRoot), signal: controller.signal })
    controller.abort()
    resolveSdk({ spawnMspConnection() { spawned++; throw new Error('Must not spawn an aborted account host') } })
    await assert.rejects(started)
    assert.equal(spawned, 0)
  } finally { await f.cleanup() }
})
