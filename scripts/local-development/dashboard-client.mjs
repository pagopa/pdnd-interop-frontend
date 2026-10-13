import { pathToFileURL } from 'node:url'
import { resolveDashboardTarget } from './vite-config.mjs'

export async function requestJson(path, body) {
  const target = resolveDashboardTarget(process.env.INTEROP_DASHBOARD_URL)
  const endpoint = path === 'health' ? '/health' : `/__local-dashboard/api/${path}`
  const response = await fetch(`${target}${endpoint}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'error',
    signal: AbortSignal.timeout(10_000),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error ?? `Dashboard request failed (${response.status})`)
  return result
}

const pause = () => new Promise((resolve) => setTimeout(resolve, 1000))

export async function waitForDashboard({ request = requestJson, pause: wait = pause } = {}) {
  for (let attempt = 0; attempt < 600; attempt += 1) {
    try {
      if ((await request('health')).status === 'ok') return
    } catch {
      // The backend image may still be installing or building the dashboard.
    }
    await wait()
  }
  throw new Error('Dashboard did not become ready; inspect the dashboard container logs')
}

export async function waitForOperation(
  operationId,
  { request = requestJson, pause: wait = pause } = {}
) {
  for (let attempt = 0; attempt < 1800; attempt += 1) {
    const status = await request('status')
    const operation = status.operations.find(({ id }) => id === operationId)
    if (operation?.state === 'failed') {
      throw new Error(
        operation.error ??
          operation.phases.find(({ state }) => state === 'failed')?.error ??
          'Local operation failed'
      )
    }
    if (operation?.state === 'passed') return operation
    await wait()
  }
  throw new Error('Timed out waiting for the local operation; inspect http://localhost:8076')
}

export async function runAction(action, options = {}) {
  const request = options.request ?? requestJson
  const { operationId } = await request('actions', action)
  if (!operationId) throw new Error('Dashboard did not return an operation ID')
  return waitForOperation(operationId, options)
}

async function main([command, value, user]) {
  if (command === 'ready') {
    resolveDashboardTarget(process.env.INTEROP_DASHBOARD_URL)
    await waitForDashboard()
  } else if (command === 'status') {
    const status = await requestJson('status')
    const { createFrontendRuntime } = await import('./frontend-runtime.mjs')
    console.log(
      JSON.stringify({ ...status, frontend: await createFrontendRuntime().status() }, null, 2)
    )
  } else if (command === 'logs') {
    if (value === 'frontend') {
      const { createFrontendRuntime } = await import('./frontend-runtime.mjs')
      console.log(await createFrontendRuntime().logs())
      return
    }
    const parameters = new URLSearchParams({ limit: '200' })
    if (value) parameters.set('source', value)
    const logs = await requestJson(`logs?${parameters}`)
    console.log(logs.entries.map(({ source, message }) => `[${source}] ${message}`).join('\n'))
  } else if (
    [
      'start',
      'stop',
      'use-local',
      'use-dev',
      'identity',
      'reset',
      'frontend.stop',
      'serve',
      'startup-status',
      'startup-state',
    ].includes(command)
  ) {
    const { createFrontendRuntime } = await import('./frontend-runtime.mjs')
    const { createFrontendLauncher, serveFrontend } = await import('./frontend-launcher.mjs')
    const runtime = createFrontendRuntime()
    const launcher = createFrontendLauncher({ runtime })
    if (command === 'startup-status') {
      if ((await runtime.startup()).state !== 'passed' || !(await runtime.status()).running)
        process.exitCode = 1
    } else if (command === 'startup-state') {
      console.log((await runtime.startup()).state)
    } else if (command === 'serve') {
      await serveFrontend({ runtime, launcher })
    } else if (command === 'start') {
      await runtime.reportStartup({ state: 'running' })
      try {
        await launcher.start()
        await runtime.reportStartup({ state: 'passed' })
      } catch (error) {
        await runtime.reportStartup({ state: 'failed', error: error.message })
        throw error
      }
    } else {
      try {
        if (command === 'frontend.stop') await runtime.exclusive(() => runtime.stop())
        else if (command === 'identity') await launcher.selectIdentity(value, user)
        else if (command === 'use-local' || command === 'use-dev')
          await launcher.useMode(command.slice(4))
        else await launcher[command]()
        const running = (await runtime.status()).running
        await runtime.reportStartup({ state: running ? 'passed' : 'stopped' })
      } catch (error) {
        await runtime.reportStartup({ state: 'failed', error: error.message })
        throw error
      }
    }
  } else {
    const action =
      command === 'infra.reset'
        ? { type: command, confirm: true }
        : command === 'preset.start' || command === 'preset.stop'
          ? { type: command, id: value }
          : { type: command }
    const operation = await runAction(action)
    console.log(`${operation.kind}: ${operation.state}`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
