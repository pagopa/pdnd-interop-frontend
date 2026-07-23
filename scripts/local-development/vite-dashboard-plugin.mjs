import { createDashboardApi } from './dashboard-api.mjs'

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(body))
}

function parseCursors(value) {
  if (!value) return {}
  const parsed = JSON.parse(value)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}

  return Object.fromEntries(
    Object.entries(parsed).filter(
      ([source, cursor]) => source.length > 0 && Number.isInteger(cursor) && cursor >= 0
    )
  )
}

async function readJsonBody(request) {
  const chunks = []
  let length = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    length += buffer.length
    if (length > 64 * 1024) throw new Error('Local dashboard request body is too large')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

export function createLocalDashboardMiddleware(api) {
  return async (request, response, next) => {
    try {
      const url = new URL(request.url ?? '/', 'http://localhost')
      if (request.method === 'GET' && url.pathname === '/') {
        response.writeHead(302, { Location: '/ui/local-dashboard/' })
        response.end()
        return
      }

      if (request.method === 'GET' && url.pathname === '/__local-dashboard/api/status') {
        sendJson(response, 200, await api.getStatus())
        return
      }

      if (request.method === 'GET' && url.pathname === '/__local-dashboard/api/logs') {
        const requestedLimit = Number(url.searchParams.get('limit') ?? 200)
        sendJson(
          response,
          200,
          await api.searchLogs({
            query: url.searchParams.get('query') ?? '',
            source: url.searchParams.get('source') ?? '',
            level: url.searchParams.get('level') ?? '',
            service: url.searchParams.get('service') ?? '',
            limit: requestedLimit,
            cursors: parseCursors(url.searchParams.get('cursors')),
          })
        )
        return
      }

      if (request.method === 'GET' && url.pathname === '/__local-dashboard/api/identities') {
        sendJson(response, 200, await api.getIdentities())
        return
      }

      if (request.method === 'POST' && url.pathname === '/__local-dashboard/api/identity') {
        sendJson(response, 200, await api.createIdentityToken(await readJsonBody(request)))
        return
      }

      next()
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : 'Unexpected local dashboard error',
      })
    }
  }
}

export function localDashboardPlugin({ frontendRoot, backendRoot }) {
  const api = createDashboardApi({ frontendRoot, backendRoot })
  const middleware = createLocalDashboardMiddleware(api)

  return {
    name: 'interop-local-dashboard',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
  }
}
