import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import test from 'node:test'

import {
  createLocalDashboardMiddleware,
  localDashboardPlugin,
} from './vite-dashboard-plugin.mjs'

function createResponse() {
  return {
    statusCode: null,
    headers: {},
    body: '',
    writeHead(statusCode, headers = {}) {
      this.statusCode = statusCode
      this.headers = headers
    },
    end(body = '') {
      this.body = body
    },
  }
}

test('redirects the forwarded Vite root to the React dashboard route', async () => {
  const middleware = createLocalDashboardMiddleware({
    getStatus: async () => ({}),
    searchLogs: async () => ({}),
  })
  const response = createResponse()

  await middleware({ method: 'GET', url: '/' }, response, () => assert.fail('unexpected next'))

  assert.equal(response.statusCode, 302)
  assert.equal(response.headers.Location, '/ui/local-dashboard/')
})

test('serves status and log search from development-only endpoints', async () => {
  const calls = []
  const middleware = createLocalDashboardMiddleware({
    getStatus: async () => ({ overall: 'ready' }),
    searchLogs: async (parameters) => {
      calls.push(parameters)
      return { results: [] }
    },
  })
  const statusResponse = createResponse()
  const logsResponse = createResponse()

  await middleware({ method: 'GET', url: '/__local-dashboard/api/status' }, statusResponse, () =>
    assert.fail('unexpected next')
  )
  await middleware(
    {
      method: 'GET',
      url: `/__local-dashboard/api/logs?query=cid-123&source=backend&level=ERROR&service=catalog-process&limit=50&cursors=${encodeURIComponent(
        JSON.stringify({ backend: 120 })
      )}`,
    },
    logsResponse,
    () => assert.fail('unexpected next')
  )

  assert.deepEqual(JSON.parse(statusResponse.body), { overall: 'ready' })
  assert.deepEqual(calls, [
    {
      query: 'cid-123',
      source: 'backend',
      level: 'ERROR',
      service: 'catalog-process',
      limit: 50,
      cursors: { backend: 120 },
    },
  ])
  assert.deepEqual(JSON.parse(logsResponse.body), { results: [] })
})

test('serves local identities and creates the selected session token', async () => {
  const selections = []
  const middleware = createLocalDashboardMiddleware({
    getIdentities: async () => ({ tenants: [{ key: 'comune' }] }),
    createIdentityToken: async (selection) => {
      selections.push(selection)
      return { sessionToken: 'local-session-token' }
    },
  })
  const identitiesResponse = createResponse()
  const tokenResponse = createResponse()
  const tokenRequest = Readable.from([
    JSON.stringify({ tenantKey: 'comune', userId: 'user-1' }),
  ])
  tokenRequest.method = 'POST'
  tokenRequest.url = '/__local-dashboard/api/identity'

  await middleware(
    { method: 'GET', url: '/__local-dashboard/api/identities' },
    identitiesResponse,
    () => assert.fail('unexpected next')
  )
  await middleware(tokenRequest, tokenResponse, () => assert.fail('unexpected next'))

  assert.deepEqual(JSON.parse(identitiesResponse.body), {
    tenants: [{ key: 'comune' }],
  })
  assert.deepEqual(selections, [{ tenantKey: 'comune', userId: 'user-1' }])
  assert.deepEqual(JSON.parse(tokenResponse.body), {
    sessionToken: 'local-session-token',
  })
})

test('overrides the Selfcare login URL with the local identity selection route', () => {
  const selfcareLoginUrl = 'http://localhost:3000/ui/it/local-identity-selection/'
  const plugin = localDashboardPlugin({
    frontendRoot: '/workspace/frontend',
    backendRoot: '/workspace/backend',
    selfcareLoginUrl,
  })

  const transformed = plugin.transformIndexHtml()

  assert.equal(transformed.tags[0].tag, 'script')
  assert.match(
    transformed.tags[0].children,
    new RegExp(`SELFCARE_LOGIN_URL = ${JSON.stringify(selfcareLoginUrl)}`)
  )
})
