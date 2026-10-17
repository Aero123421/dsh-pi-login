import assert from 'node:assert/strict'

/** Open the real composer menu and read one model's effort choices. */
async function effortNames(page, modelName, shot) {
  const trigger = () => page.getByRole('button', { name: /Select model/ })
  await trigger().click()
  await page.getByRole('menu', { name: 'Model and reasoning effort' })
    .or(page.getByRole('group', { name: 'Model and reasoning effort' })).waitFor()
  // rc.2 opens the model list directly until the first selection is saved.
  const modelPane = page.getByRole('menuitem', { name: /^Model\b/ })
  if (await modelPane.count()) await modelPane.click()
  const search = page.getByRole('searchbox', { name: 'Search models…' })
  if (await search.count()) await search.fill(modelName)
  const option = page.getByRole('menuitemradio', { name: modelName, exact: true })
  await option.click()
  const escaped = modelName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  await page.getByRole('button', { name: new RegExp(`Select model, current ${escaped}\\b`) }).waitFor()
  await trigger().click()
  await page.getByRole('menuitem', { name: /^Effort\b/ }).click()
  const menu = page.getByRole('menu', { name: 'Model and reasoning effort' })
  const names = (await menu.getByRole('menuitemradio').allTextContents()).map(name => name.trim()).filter(Boolean)
  if (shot) await page.screenshot({ path: shot })
  await page.keyboard.press('Escape')
  await page.keyboard.press('Escape')
  return names
}

/**
 * Standard and same-ID Contributor limits stay apart in the real model menu.
 * The account catalog is a local fixture; this does not call Meta.
 */
export async function checkContributorEffortMenu(page, { artifacts, workspacePath } = {}) {
  const errors = []
  const onError = error => errors.push(error.name)
  page.on('pageerror', onError)
  try {
    if (workspacePath) {
      const created = await page.evaluate(async path => {
        const method = 'workspace/create'
        const response = await fetch('/api/' + method, {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ type: 'client-request', rpcId: 'effort-workspace', method, payload: { args: { request: { path } } } }),
        })
        return response.json()
      }, workspacePath)
      if (created.result?.ok !== true) throw new Error('Workspace create failed: ' + JSON.stringify(created.result?.error ?? created))
      await page.reload()
    }
    const welcome = page.getByRole('button', { name: 'Continue', exact: true })
    const trigger = page.getByRole('button', { name: /Select model/ })
    await Promise.race([
      welcome.waitFor({ state: 'visible' }),
      trigger.waitFor({ state: 'visible' }),
    ])
    if (await welcome.isVisible()) {
      await welcome.click()
      await welcome.waitFor({ state: 'hidden' })
    }
    await trigger.waitFor()
    const contributor = await effortNames(page, 'muse-wonder-full-1.0 Contributor', artifacts ? `${artifacts}/contributor-efforts.png` : undefined)
    assert.deepEqual(contributor, ['High', 'Xhigh'])
    const standard = await effortNames(page, 'muse-wonder-full-1.0', artifacts ? `${artifacts}/standard-efforts.png` : undefined)
    assert.deepEqual(standard, ['High', 'Xhigh', 'Max'])
    assert.deepEqual(errors, [])
    console.log('Real DSH model menu: same-ID Contributor offers High and Xhigh, Standard also offers Max')
  } catch (error) {
    if (artifacts) await page.screenshot({ path: `${artifacts}/effort-menu-failed.png` }).catch(() => {})
    throw error
  } finally {
    page.off('pageerror', onError)
  }
}

/** Run the shipped client inside the real DSH Settings modal, not a fixture shell. */
export async function checkConnectionControls(page, { mode, artifacts }) {
  const errors = []
  const onError = error => errors.push(error.name)
  page.on('pageerror', onError)
  try {
    // The account is a local credential fixture. Do not mint a Meta key when
    // opening its settings; usage normalization is covered by runtime tests.
    await page.route('**/api/dsh-pi-login/usage', async route => {
      const envelope = route.request().postDataJSON()
      await route.fulfill({ json: { type: 'server-response', rpcId: envelope.rpcId,
        result: { ok: true, value: { status: 'unsupported', windows: [] } } } })
    })
    // The shell may show a first-run notice before the sidebar is interactive.
    // 0.2.1-alpha.2 keeps a Settings button in the sidebar. 0.2.1-alpha.3 puts
    // that command in the account menu; the Models page and its footer slot
    // are unchanged.
    const welcome = page.getByRole('button', { name: 'Continue', exact: true })
    const sidebarSettings = page.getByRole('button', { name: 'Settings', exact: true })
    const accountMenu = page.getByRole('button', { name: 'Account menu', exact: true })
    await Promise.race([
      welcome.waitFor({ state: 'visible' }),
      sidebarSettings.waitFor({ state: 'visible' }),
      accountMenu.waitFor({ state: 'visible' }),
    ])
    if (await welcome.isVisible()) {
      await welcome.click()
      await welcome.waitFor({ state: 'hidden' })
    }
    // The client replaces its connection after the shell renders. Opening
    // Settings during that reset dismisses the dialog.
    await page.waitForTimeout(1500)
    await Promise.race([
      sidebarSettings.waitFor({ state: 'visible' }),
      accountMenu.waitFor({ state: 'visible' }),
    ])
    await page.waitForTimeout(1500)
    if (await sidebarSettings.isVisible()) {
      await sidebarSettings.click()
    } else {
      await accountMenu.click()
      await page.getByRole('menuitem', { name: 'Settings', exact: true }).click()
    }
    await page.getByRole('button', { name: 'Models', exact: true }).click()
    await page.getByRole('heading', { name: 'AI connections', exact: true }).waitFor()
    const name = 'Restart Muse fixture'
    const manage = page.getByRole('button', { name: `Manage connection: ${name}`, exact: true })
    await manage.waitFor()
    assert.equal(await page.getByRole('button', { name: `Edit ${name}`, exact: true }).count(), 0,
      'Connection must not have a second editor whose Delete only unsets its profile')
    assert.equal(await page.getByRole('button', { name: `Delete ${name}`, exact: true }).count(), 0)
    if (mode !== 'delete') {
      await page.getByRole('button', { name: `Manage models: ${name}`, exact: true }).click()
      const dialog = page.getByRole('dialog', { name, exact: true })
      await dialog.getByRole('switch').first().waitFor()
      assert.equal(await dialog.getByRole('switch').count(), 8)
      const contributor = dialog.getByRole('switch', { name: 'Use model: muse-wonder-full-1.0 Contributor', exact: true })
      const standard = dialog.getByRole('switch', { name: 'Use model: muse-wonder-1.0', exact: true })
      if (mode === 'toggle') {
        assert.equal(await contributor.getAttribute('aria-checked'), 'true', 'Explicit old opt-in survives')
        await contributor.click()
        await page.waitForFunction(() => {
          const row = document.querySelector('[aria-label="Use model: muse-wonder-full-1.0 Contributor"]')
          return row?.getAttribute('aria-checked') === 'false' && !row.disabled
        })
        await standard.click()
        await page.waitForFunction(() => {
          const row = document.querySelector('[aria-label="Use model: muse-wonder-1.0"]')
          return row?.getAttribute('aria-checked') === 'false' && !row.disabled
        })
      }
      assert.equal(await contributor.getAttribute('aria-checked'), 'false')
      assert.equal(await standard.getAttribute('aria-checked'), 'false')
      assert.equal(await dialog.getByRole('alert').count(), 0)
      if (artifacts) {
        await page.waitForTimeout(250)
        await page.screenshot({ path: `${artifacts}/muse-models-${mode}.png` })
      }
      await dialog.getByRole('button', { name: 'Close', exact: true }).last().click()
    } else {
      await manage.click()
      const dialog = page.getByRole('dialog', { name, exact: true })
      await dialog.getByRole('button', { name: 'Delete connection', exact: true }).click()
      await dialog.getByText('Delete this connection and its saved credentials? Its models will no longer be available.', { exact: true }).waitFor()
      await dialog.getByRole('button', { name: 'Delete this connection', exact: true }).click()
      await dialog.waitFor({ state: 'hidden' })
      await manage.waitFor({ state: 'hidden' })
      if (artifacts) await page.screenshot({ path: `${artifacts}/connection-deleted.png` })
    }
    assert.deepEqual(errors, [])
  } catch (error) {
    if (artifacts) await page.screenshot({ path: `${artifacts}/failed-${mode}.png` }).catch(() => {})
    throw error
  } finally {
    await page.unroute('**/api/dsh-pi-login/usage')
    page.off('pageerror', onError)
  }
}
