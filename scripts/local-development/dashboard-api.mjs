import { execFile } from 'node:child_process'
import { open, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'

import {
  deriveOverallState,
  deriveStartupChecks,
  parseComposeServices,
  parseProcessRegistry,
  searchLogEntries,
} from './dashboard-data.mjs'

const execFileAsync = promisify(execFile)
const MAX_LOG_BYTES = 2 * 1024 * 1024
const SESSION_NAMES = ['interop-port-forwards', 'interop-backend', 'interop-frontend']

async function readFileOrEmpty(path) {
  try {
    return await readFile(path, 'utf8')
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') return ''
    throw error
  }
}

async function readProcessPort(backendRoot, processName) {
  const packageName = processName.replace(/^pagopa-interop-/, '')
  const environment = await readFileOrEmpty(join(backendRoot, 'packages', packageName, '.env'))
  const port = environment.match(/^PORT="?(\d+)"?$/m)?.[1]
  return port ? Number(port) : null
}

async function readLogMetadata(path) {
  try {
    const details = await stat(path)
    return {
      size: details.size,
      updatedAt: details.mtime.toISOString(),
    }
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') {
      return { size: 0, updatedAt: null }
    }
    throw error
  }
}

async function readLogRange(path, requestedCursor) {
  let file
  try {
    const details = await stat(path)
    const hasValidCursor =
      Number.isInteger(requestedCursor) && requestedCursor >= 0 && requestedCursor <= details.size
    let startOffset = hasValidCursor ? requestedCursor : Math.max(0, details.size - MAX_LOG_BYTES)
    const length = details.size - startOffset
    file = await open(path, 'r')
    const buffer = Buffer.alloc(length)
    await file.read(buffer, 0, length, startOffset)

    let contentStart = 0
    if (!hasValidCursor && startOffset > 0) {
      const firstNewline = buffer.indexOf('\n')
      contentStart = firstNewline === -1 ? buffer.length : firstNewline + 1
      startOffset += contentStart
    }

    const completeContent = buffer.subarray(contentStart)
    const lastNewline = completeContent.lastIndexOf('\n')
    const contentLength = lastNewline === -1 ? 0 : lastNewline + 1

    return {
      content: completeContent.subarray(0, contentLength).toString('utf8'),
      startOffset,
      cursor: startOffset + contentLength,
      reset: requestedCursor !== undefined && !hasValidCursor,
      size: details.size,
      updatedAt: details.mtime.toISOString(),
    }
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') {
      return {
        content: '',
        startOffset: 0,
        cursor: 0,
        reset: requestedCursor !== undefined && requestedCursor !== 0,
        size: 0,
        updatedAt: null,
      }
    }
    throw error
  } finally {
    await file?.close()
  }
}

function getLogPaths(frontendRoot) {
  const runtimeRoot = join(frontendRoot, '.local-development')
  const logRoot = join(runtimeRoot, 'logs')
  return [
    { source: 'startup', path: join(runtimeRoot, 'startup.log') },
    { source: 'backend', path: join(logRoot, 'interop-backend.log') },
    { source: 'frontend', path: join(logRoot, 'interop-frontend.log') },
    { source: 'port-forwards', path: join(logRoot, 'interop-port-forwards.log') },
  ]
}

async function readLogs(frontendRoot, selectedSource, cursors = {}) {
  return Promise.all(
    getLogPaths(frontendRoot)
      .filter(({ source }) => !selectedSource || source === selectedSource)
      .map(async ({ source, path }) => ({
        source,
        ...(await readLogRange(path, cursors[source])),
      }))
  )
}

async function readLogsMetadata(frontendRoot) {
  return Promise.all(
    getLogPaths(frontendRoot).map(async ({ source, path }) => ({
      source,
      ...(await readLogMetadata(path)),
    }))
  )
}

async function defaultComposePs(backendRoot) {
  const { stdout } = await execFileAsync(
    'docker',
    ['compose', '-f', join(backendRoot, 'docker/docker-compose.yml'), 'ps', '--format', 'json'],
    { cwd: backendRoot, maxBuffer: 4 * 1024 * 1024 }
  )
  return stdout
}

function defaultIsProcessRunning(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

async function defaultIsSessionRunning(name) {
  try {
    await execFileAsync('tmux', ['has-session', '-t', name])
    return true
  } catch {
    return false
  }
}

async function defaultGenerateIdentityToken(backendRoot, { tenantKey, userId }) {
  const { stdout } = await execFileAsync(
    'node',
    [
      'scripts/local-development/cli.mjs',
      'token',
      '--tenant',
      tenantKey,
      '--user',
      userId,
    ],
    { cwd: backendRoot, maxBuffer: 1024 * 1024 }
  )
  return stdout.trim()
}

export function createDashboardApi({
  frontendRoot,
  backendRoot,
  composePs = () => defaultComposePs(backendRoot),
  isProcessRunning = defaultIsProcessRunning,
  isSessionRunning = defaultIsSessionRunning,
  generateIdentityToken = (identity) => defaultGenerateIdentityToken(backendRoot, identity),
}) {
  const getIdentities = async () => {
    const [dataset, state] = await Promise.all([
      readFile(join(backendRoot, 'docker/local-development/dataset.json'), 'utf8').then(JSON.parse),
      readFile(join(backendRoot, '.local-development/state.json'), 'utf8').then(JSON.parse),
    ])

    return {
      tenants: dataset.tenants.flatMap((tenant) => {
        const tenantState = state.tenants[tenant.key]
        if (!tenantState) return []

        return [
          {
            key: tenant.key,
            id: tenantState.id,
            name: tenant.name,
            users: dataset.users
              .flatMap((user) => {
                const membership = user.memberships.find(
                  (candidate) => candidate.tenantSelfcareId === tenant.selfcareId
                )
                return membership
                  ? [
                      {
                        id: user.id,
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                        roles: membership.roles,
                      },
                    ]
                  : []
              }),
          },
        ]
      }),
    }
  }

  return {
    async getStatus() {
      const frontendRuntime = join(frontendRoot, '.local-development')
      const [startupStateContent, startupLog, pidRegistry, composeOutput, sessions, logs] =
        await Promise.all([
          readFileOrEmpty(join(frontendRuntime, 'startup.status')),
          readFileOrEmpty(join(frontendRuntime, 'startup.log')),
          readFileOrEmpty(join(backendRoot, '.local-development/frontend-full.pids')),
          composePs().catch(() => ''),
          Promise.all(
            SESSION_NAMES.map(async (name) => ({
              name,
              state: (await isSessionRunning(name)) ? 'running' : 'stopped',
            }))
          ),
          readLogsMetadata(frontendRoot),
        ])
      const startupState = startupStateContent.trim() || 'stopped'
      const processes = await Promise.all(
        parseProcessRegistry(pidRegistry, isProcessRunning).map(async (process) => ({
          ...process,
          port: await readProcessPort(backendRoot, process.name),
        }))
      )
      const infrastructure = parseComposeServices(composeOutput)

      return {
        timestamp: new Date().toISOString(),
        overall: deriveOverallState({ startupState, processes, infrastructure }),
        startup: {
          state: startupState,
          checks: deriveStartupChecks(startupState, startupLog),
        },
        sessions,
        processes,
        infrastructure,
        logs: logs.map(({ source, size, updatedAt }) => ({ source, size, updatedAt })),
      }
    },

    async searchLogs({ query, source, level = '', service = '', limit, cursors = {} }) {
      const safeLimit = Number.isInteger(limit) ? Math.min(500, Math.max(1, limit)) : 200
      const logs = await readLogs(frontendRoot, source, cursors)
      return {
        query,
        source: source || null,
        level: level || null,
        service: service || null,
        results: searchLogEntries(logs, { query, level, service, limit: safeLimit }),
        cursors: Object.fromEntries(logs.map((log) => [log.source, log.cursor])),
        resetSources: logs.filter((log) => log.reset).map((log) => log.source),
      }
    },

    getIdentities,

    async createIdentityToken({ tenantKey, userId }) {
      const identities = await getIdentities()
      const tenant = identities.tenants.find((candidate) => candidate.key === tenantKey)
      const user = tenant?.users.find((candidate) => candidate.id === userId)
      if (!tenant || !user) {
        throw new Error('Invalid local identity selection')
      }

      return {
        sessionToken: await generateIdentityToken({ tenantKey, userId }),
      }
    },
  }
}
