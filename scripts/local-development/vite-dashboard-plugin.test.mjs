import assert from 'node:assert/strict'
import test from 'node:test'

import { createLocalDashboardMiddleware } from './vite-dashboard-plugin.mjs'

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
