// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest'
import createConfiguration from '../../../vite.config.ts'

afterEach(() => vi.unstubAllEnvs())

function dashboardProxyFor(url) {
  vi.stubEnv('INTEROP_LOCAL_DEVELOPMENT', 'true')
  vi.stubEnv('INTEROP_DASHBOARD_URL', 'http://127.0.0.1:8076')
  const config = createConfiguration({ command: 'serve', mode: 'development' })
  // Match Vite's proxy-context semantics against the actual frontend config.
  return Object.entries(config.server.proxy).find(([context]) =>
    context.startsWith('^') ? new RegExp(context).test(url) : url.startsWith(context)
  )?.[1]
}

it.each([
  '/__local-dashboard/api/identities',
  '/__local-dashboard/api/identity',
  '/__local-dashboard/api/identities?tenant=comune',
  '/__local-dashboard/api/identity?tenant=comune',
])('forwards the local identity endpoint %s to the dashboard', (url) => {
  expect(dashboardProxyFor(url)).toMatchObject({
    target: 'http://127.0.0.1:8076',
    changeOrigin: false,
  })
})

it.each([
  '/__local-dashboard/api/infrastructure/reset',
  '/__local-dashboard/api/frontend/actions',
  '/__local-dashboard/api/presets',
  '/__local-dashboard/api/identities/unexpected',
  '/__local-dashboard/api/identity/../infrastructure/reset',
  '/__local-dashboard/api/identity-extra',
])('does not proxy dashboard management requests through the frontend (%s)', (url) => {
  expect(dashboardProxyFor(url)).toBeUndefined()
})
