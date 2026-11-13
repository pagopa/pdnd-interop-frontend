// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest'
import { readFile, readdir } from 'node:fs/promises'
import { createFrontendRuntime } from '../frontend-runtime.mjs'

vi.mock('node:fs/promises', async (importOriginal) => ({
  ...(await importOriginal()),
  readFile: vi.fn(),
  readdir: vi.fn(),
}))

afterEach(() => vi.resetAllMocks())

function processGroup(memberExit, environmentError) {
  let exited = false
  readdir.mockResolvedValue(['4242', '4243'])
  readFile.mockImplementation(async (path) => {
    switch (path) {
      case '/frontend/.local-development/frontend/process.json':
        return JSON.stringify({ pid: 4242, owner: 'runtime-owner', mode: 'local' })
      case '/proc/4242/stat':
        return '4242 (launcher) S 1 4242'
      case '/proc/4242/environ':
        return 'INTEROP_FRONTEND_OWNER=runtime-owner\0'
      case '/proc/4243/stat':
        if (exited && memberExit === 'removed')
          throw Object.assign(new Error('Process no longer exists'), { code: 'ENOENT' })
        return `4243 (helper) ${exited && memberExit === 'zombie' ? 'Z' : 'R'} 4242 4242`
      case '/proc/4243/environ':
        // A child can exit after stat reports it live. Its environment becomes unavailable.
        exited = true
        if (environmentError)
          throw Object.assign(new Error('Cannot read process environment'), {
            code: environmentError,
          })
        return ''
      default:
        throw new Error(`Unexpected process file: ${path}`)
    }
  })
  return createFrontendRuntime({ root: '/frontend' })
}

it.each(['zombie', 'removed'])(
  'keeps the owned group running when a helper becomes %s during inspection',
  async (memberExit) => {
    expect(await processGroup(memberExit).status()).toMatchObject({ running: true, pid: 4242 })
  }
)

it('keeps the owned group running when an exited helper environment becomes inaccessible', async () => {
  expect(await processGroup('zombie', 'EACCES').status()).toMatchObject({
    running: true,
    pid: 4242,
  })
})

it.each([undefined, 'EACCES'])(
  'rejects a group with a live process whose owner cannot be verified (environment error=%s)',
  async (environmentError) => {
    expect(await processGroup('live', environmentError).status()).toMatchObject({
      running: false,
      pid: 4242,
    })
  }
)
