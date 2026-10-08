// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { parseComposeServices } from './dashboard-data.mjs'

describe('local infrastructure status', () => {
  it.each([
    [0, 'passed'],
    [1, 'exited'],
  ])('reports RustFS seed exit code %s as %s', (exitCode, state) => {
    const output = JSON.stringify({
      Service: 'rustfs-seed',
      Name: 'interop-rustfs-seed-1',
      State: 'exited',
      ExitCode: exitCode,
    })

    expect(parseComposeServices(output)).toEqual([
      { name: 'rustfs-seed', container: 'interop-rustfs-seed-1', state, health: null },
    ])
  })
})
