// @vitest-environment node
import { expect, it } from 'vitest'
import * as configuration from '../vite-config.mjs'

it('proxies local identity endpoints to the standalone loopback dashboard', () => {
  expect(configuration.resolveDashboardTarget()).toBe('http://127.0.0.1:8076')
  expect(configuration.resolveDashboardTarget('http://localhost:8077')).toBe(
    'http://localhost:8077'
  )
})

it.each([
  'https://example.com',
  'http://127.0.0.1.evil.test',
  'http://user:secret@localhost:8076',
  'http://localhost:8076/path',
])('rejects a dashboard target outside the local runtime (%s)', (target) => {
  expect(() => configuration.resolveDashboardTarget(target)).toThrow('loopback HTTP origin')
})

it('accepts the dashboard Compose DNS only in the dedicated frontend container', () => {
  expect(configuration.resolveDashboardTarget('http://dashboard:8076', true)).toBe(
    'http://dashboard:8076'
  )
  expect(() => configuration.resolveDashboardTarget('http://dashboard:8076')).toThrow(
    'loopback HTTP origin'
  )
  expect(() => configuration.resolveDashboardTarget('http://remote:8076', true)).toThrow(
    'loopback HTTP origin'
  )
})
