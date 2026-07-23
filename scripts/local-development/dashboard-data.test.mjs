import assert from 'node:assert/strict'
import test from 'node:test'

import {
  deriveOverallState,
  deriveStartupChecks,
  parseComposeServices,
  parseProcessRegistry,
  searchLogEntries,
} from './dashboard-data.mjs'

test('degrades a ready environment when an application session stops', () => {
  assert.equal(
    deriveOverallState({
      startupState: 'ready',
      sessions: [
        { name: 'interop-dashboard', state: 'running' },
        { name: 'interop-backend', state: 'stopped' },
      ],
      processes: [],
      infrastructure: [],
    }),
    'degraded'
  )
  assert.equal(
    deriveOverallState({
      startupState: 'stopped',
      sessions: [],
      processes: [],
      infrastructure: [],
    }),
    'stopped'
  )
})

test('derives startup progress from the existing status and log contract', () => {
  const checks = deriveStartupChecks(
    'starting',
    [
      'Local infrastructure is ready',
      '[4/7] Backend services are ready',
      'Seed completed successfully',
      '[7/7] Starting the frontend',
    ].join('\n')
  )

  assert.deepEqual(
    checks.map(({ id, state }) => ({ id, state })),
    [
      { id: 'infrastructure', state: 'passed' },
      { id: 'backend', state: 'passed' },
      { id: 'seed', state: 'passed' },
      { id: 'token', state: 'passed' },
      { id: 'frontend', state: 'running' },
      { id: 'smoke', state: 'pending' },
      { id: 'browser', state: 'pending' },
    ]
  )
})

test('marks the active startup check as failed', () => {
  const checks = deriveStartupChecks(
    'failed',
    '[5/7] Seeding tenants, events, and readmodels\nFULL-STACK STARTUP FAILED'
  )

  assert.equal(checks.find(({ id }) => id === 'seed')?.state, 'failed')
})

test('parses the backend process registry without executing process commands', () => {
  const processes = parseProcessRegistry(
    'pagopa-interop-catalog-process 120\npagopa-interop-backend-for-frontend 121\n',
    (pid) => pid === 120
  )

  assert.deepEqual(processes, [
    { name: 'pagopa-interop-catalog-process', pid: 120, state: 'running' },
    { name: 'pagopa-interop-backend-for-frontend', pid: 121, state: 'stopped' },
  ])
})

test('normalizes Docker compose JSON output', () => {
  const services = parseComposeServices(
    [
      JSON.stringify({
        Service: 'kafka',
        Name: 'interop-kafka-1',
        State: 'running',
        Health: 'healthy',
      }),
      JSON.stringify({ Service: 'minio', Name: 'interop-minio-1', State: 'exited', Health: '' }),
    ].join('\n')
  )

  assert.deepEqual(services, [
    { name: 'kafka', container: 'interop-kafka-1', state: 'running', health: 'healthy' },
    { name: 'minio', container: 'interop-minio-1', state: 'exited', health: null },
  ])
})

test('finds a correlation ID and preserves its service and severity', () => {
  const correlationId = '472fc99a-76eb-47a5-b4ab-7528d2cf96f0'
  const results = searchLogEntries(
    [
      {
        source: 'backend',
        startOffset: 0,
        content: [
          '2026-07-22T13:43:10.057Z INFO [catalog-process] - Request started',
          `2026-07-22T13:43:10.058Z ERROR [catalog-process] - [CID=${correlationId}] Request failed`,
        ].join('\n'),
      },
    ],
    { query: correlationId, level: '', service: '', limit: 100 }
  )

  assert.equal(results.length, 1)
  assert.deepEqual(results[0], {
    source: 'backend',
    line: 2,
    offset: 66,
    timestamp: '2026-07-22T13:43:10.058Z',
    level: 'ERROR',
    service: 'catalog-process',
    correlationId,
    message: `2026-07-22T13:43:10.058Z ERROR [catalog-process] - [CID=${correlationId}] Request failed`,
  })
})

test('filters logs by severity and service before applying the limit', () => {
  const results = searchLogEntries(
    [
      {
        source: 'backend',
        startOffset: 0,
        content: [
          '2026-07-22T13:43:10.057Z INFO [catalog-process] - Catalog ready',
          '2026-07-22T13:43:10.058Z ERROR [catalog-process] - Catalog failed',
          '2026-07-22T13:43:10.059Z ERROR [backend-for-frontend] - BFF failed',
        ].join('\n'),
      },
    ],
    { query: '', level: 'ERROR', service: 'catalog-process', limit: 1 }
  )

  assert.equal(results.length, 1)
  assert.match(results[0].message, /Catalog failed/)
})
