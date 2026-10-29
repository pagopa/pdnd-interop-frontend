import { pathToFileURL } from 'node:url'
import { setTimeout } from 'node:timers/promises'
import { resolveDashboardTarget } from './vite-config.mjs'

export async function requestJson(path, body, { signal } = {}) {
  const target = resolveDashboardTarget(process.env.INTEROP_DASHBOARD_URL)
  const endpoint = path === 'health' ? '/health' : `/__local-dashboard/api/${path}`
  const response = await fetch(`${target}${endpoint}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'error',
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(10_000)])
      : AbortSignal.timeout(10_000),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error ?? `Dashboard request failed (${response.status})`)
  return result
}

const pause = (signal) => setTimeout(1000, undefined, { signal })

async function checkedRequest(request, path, body, signal) {
  signal?.throwIfAborted()
  const result = signal
    ? await request(path, body, { signal })
    : body === undefined
      ? await request(path)
      : await request(path, body)
  signal?.throwIfAborted()
  return result
}

export async function waitForDashboard({
  request = requestJson,
  pause: wait = pause,
  signal,
} = {}) {
  for (let attempt = 0; attempt < 600; attempt += 1) {
    try {
      if ((await checkedRequest(request, 'health', undefined, signal)).status === 'ok') return
    } catch {
      // The backend image may still be installing or building the dashboard.
    }
    signal?.throwIfAborted()
    await wait(signal)
  }
  throw new Error('Dashboard did not become ready; inspect the dashboard container logs')
}

export async function runFrontendAction(
  action,
  { request = requestJson, pause: wait = pause, signal } = {}
) {
  const { operationId } = await checkedRequest(request, 'frontend/actions', action, signal)
  if (!operationId) throw new Error('Dashboard did not return a frontend operation ID')
  for (let attempt = 0; attempt < 1800; attempt += 1) {
    const { frontend } = await checkedRequest(request, 'status', undefined, signal)
    if (frontend?.operationId !== operationId) {
      throw new Error('Frontend operation lost or superseded; retry pnpm local:start')
    }
    if (frontend?.operationId === operationId) {
      if (frontend.state === 'failed')
        throw new Error(
          frontend.error ??
            frontend.phases?.find(({ state }) => state === 'failed')?.error ??
            'Frontend operation failed'
        )
      if (frontend.state === 'passed') return frontend
      if (frontend.state === 'stopped') {
        if (['stop', 'reset'].includes(action.type)) return frontend
        throw new Error('Frontend stopped before the operation completed; retry pnpm local:start')
      }
    }
    signal?.throwIfAborted()
    await wait(signal)
  }
  throw new Error('Timed out waiting for the frontend operation; inspect http://localhost:8076')
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
  await options.onAccepted?.(operationId)
  return waitForOperation(operationId, options)
}

async function main([command, value, user]) {
  if (command === 'status') {
    console.log(JSON.stringify(await requestJson('status'), null, 2))
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
  } else if (command === 'runtime-health') {
    const { createFrontendRuntime } = await import('./frontend-runtime.mjs')
    if (!(await createFrontendRuntime().status()).running) process.exitCode = 1
  } else if (['ready', 'startup-status', 'startup-state'].includes(command)) {
    const { frontend } = await requestJson('status')
    const { createFrontendRuntime } = await import('./frontend-runtime.mjs')
    const running = (await createFrontendRuntime().status()).running
    const state =
      frontend?.state === 'passed' && !running ? 'stopped' : (frontend?.state ?? 'pending')
    if (command === 'startup-state') console.log(state)
    else if (state !== 'passed' || !running) process.exitCode = 1
  } else if (command === 'serve') {
    const { createFrontendRuntime } = await import('./frontend-runtime.mjs')
    const { serveFrontend } = await import('./frontend-agent.mjs')
    await serveFrontend({ runtime: createFrontendRuntime() })
  } else if (['start', 'stop', 'use-local', 'use-dev', 'identity', 'reset'].includes(command)) {
    await runFrontendAction(
      command === 'identity'
        ? { type: command, tenantKey: value, userKey: user }
        : { type: command }
    )
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
