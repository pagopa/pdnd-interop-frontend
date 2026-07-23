import assert from 'node:assert/strict'
import { appendFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { createDashboardApi } from './dashboard-api.mjs'

test('reads environment status and searches local logs', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-dashboard-api-'))
  const frontendRoot = join(root, 'frontend')
  const backendRoot = join(root, 'backend')
  const frontendRuntime = join(frontendRoot, '.local-development')
  const backendRuntime = join(backendRoot, '.local-development')
  const backendDatasetRoot = join(backendRoot, 'docker/local-development')
  const catalogRoot = join(backendRoot, 'packages/catalog-process')
  const logRoot = join(frontendRuntime, 'logs')

  try {
    await Promise.all([
      mkdir(logRoot, { recursive: true }),
      mkdir(backendRuntime, { recursive: true }),
      mkdir(backendDatasetRoot, { recursive: true }),
      mkdir(catalogRoot, { recursive: true }),
    ])
    await Promise.all([
      writeFile(join(frontendRuntime, 'startup.status'), 'ready\n'),
      writeFile(join(frontendRuntime, 'startup.log'), 'FULL STACK READY\n'),
      writeFile(
        join(logRoot, 'interop-backend.log'),
        '2026-07-22T13:43:10.058Z ERROR [catalog-process] - [CID=cid-123] Request failed\n'
      ),
      writeFile(join(logRoot, 'interop-frontend.log'), 'Frontend ready\n'),
      writeFile(join(backendRuntime, 'frontend-full.pids'), 'pagopa-interop-catalog-process 120\n'),
      writeFile(join(catalogRoot, '.env'), 'PORT=3000\n'),
      writeFile(
        join(backendDatasetRoot, 'dataset.json'),
        JSON.stringify({
          tenants: [
            {
              key: 'comune',
              name: 'Comune Demo',
              selfcareId: 'selfcare-comune',
            },
          ],
          users: [
            {
              id: 'user-1',
              memberships: [
                {
                  tenantSelfcareId: 'selfcare-comune',
                  roles: ['security', 'viewer'],
                },
              ],
              name: 'Mario',
              surname: 'Rossi',
              email: 'mario@comune.demo',
            },
          ],
        })
      ),
      writeFile(
        join(backendRuntime, 'state.json'),
        JSON.stringify({
          tenants: {
            comune: { id: '5470e567-de4c-416a-abd5-738dab94a5fd' },
          },
        })
      ),
    ])

    const generatedIdentityTokens = []
    const api = createDashboardApi({
      frontendRoot,
      backendRoot,
      composePs: async () =>
        `${JSON.stringify({ Service: 'kafka', Name: 'interop-kafka-1', State: 'running', Health: 'healthy' })}\n`,
      isProcessRunning: (pid) => pid === 120,
      isSessionRunning: async () => true,
      generateIdentityToken: async (identity) => {
        generatedIdentityTokens.push(identity)
        return 'local-session-token'
      },
    })

    const status = await api.getStatus()
    assert.equal(status.overall, 'ready')
    assert.equal(status.processes[0].name, 'pagopa-interop-catalog-process')
    assert.equal(status.processes[0].port, 3000)
    assert.equal(status.infrastructure[0].health, 'healthy')

    const logs = await api.searchLogs({
      query: 'cid-123',
      source: '',
      level: 'ERROR',
      service: 'catalog-process',
      limit: 200,
    })
    assert.equal(logs.results.length, 1)
    assert.equal(logs.results[0].correlationId, 'cid-123')
    assert.equal(logs.results[0].offset, 0)

    await appendFile(
      join(logRoot, 'interop-backend.log'),
      '2026-07-22T13:44:10.058Z INFO [catalog-process] - Request completed\n'
    )
    const incrementalLogs = await api.searchLogs({
      query: '',
      source: '',
      level: '',
      service: '',
      limit: 200,
      cursors: logs.cursors,
    })

    assert.equal(incrementalLogs.results.length, 1)
    assert.match(incrementalLogs.results[0].message, /Request completed/)
    assert.ok(incrementalLogs.results[0].offset > logs.results[0].offset)
    assert.ok(incrementalLogs.cursors.backend > logs.cursors.backend)

    await writeFile(join(logRoot, 'interop-backend.log'), 'Fresh log after rotation\n')
    const rotatedLogs = await api.searchLogs({
      query: '',
      source: '',
      level: '',
      service: '',
      limit: 200,
      cursors: incrementalLogs.cursors,
    })

    assert.deepEqual(rotatedLogs.resetSources, ['backend'])
    assert.equal(rotatedLogs.results.length, 1)
    assert.equal(rotatedLogs.results[0].message, 'Fresh log after rotation')

    assert.deepEqual(await api.getIdentities(), {
      tenants: [
        {
          key: 'comune',
          id: '5470e567-de4c-416a-abd5-738dab94a5fd',
          name: 'Comune Demo',
          users: [
            {
              id: 'user-1',
              name: 'Mario',
              surname: 'Rossi',
              email: 'mario@comune.demo',
              roles: ['security', 'viewer'],
            },
          ],
        },
      ],
    })
    assert.deepEqual(
      await api.createIdentityToken({
        tenantKey: 'comune',
        userId: 'user-1',
      }),
      { sessionToken: 'local-session-token' }
    )
    assert.deepEqual(generatedIdentityTokens, [
      { tenantKey: 'comune', userId: 'user-1' },
    ])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
