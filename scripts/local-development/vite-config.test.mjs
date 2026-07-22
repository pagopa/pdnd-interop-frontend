import assert from 'node:assert/strict'
import { test } from 'node:test'
import { resolveBackendProxy, resolveBackendTarget } from './vite-config.mjs'

test('keeps the shared development backend as the default', () => {
  assert.equal(resolveBackendTarget(undefined), 'https://selfcare.dev.interop.pagopa.it')
})

test('uses the explicitly selected local backend', () => {
  assert.equal(resolveBackendTarget('http://localhost:3600'), 'http://localhost:3600')
})

test('rewrites the gateway-style frontend path only for a local backend', () => {
  const localProxy = resolveBackendProxy('http://localhost:3600')
  const sharedProxy = resolveBackendProxy(undefined)

  assert.equal(
    localProxy.rewrite('/0.0/backend-for-frontend/catalog'),
    '/backend-for-frontend/0.0/catalog'
  )
  assert.equal(sharedProxy.rewrite, undefined)
})
