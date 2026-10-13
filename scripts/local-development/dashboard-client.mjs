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

async function main([command, value]) {
  if (command === 'ready') {
    resolveDashboardTarget(process.env.INTEROP_DASHBOARD_URL)
    for (let attempt = 0; attempt < 600; attempt += 1) {
      try {
        const health = await requestJson('health')
        if (health.status === 'ok') return
      } catch {
        // Image initialization can finish before the API is listening.
      }
      await pause()
    }
    throw new Error('Dashboard did not become ready; inspect the dashboard container logs')
  } else if (command === 'status') {
    console.log(JSON.stringify(await requestJson('status'), null, 2))
  } else if (command === 'logs') {
    const parameters = new URLSearchParams({ limit: '200' })
    if (value) parameters.set('source', value)
    const logs = await requestJson(`logs?${parameters}`)
    console.log(logs.entries.map(({ source, message }) => `[${source}] ${message}`).join('\n'))
  } else {
    const action =
      command === 'infra.reset'
        ? { type: command, confirm: true }
        : command === 'frontend.restart'
          ? { type: command, mode: value }
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
