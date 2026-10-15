// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest'
import { access, appendFile, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createStartupLogFollower, requestHostDashboard } from '../frontend-logs.mjs'
import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const roots = []
afterEach(async () => {
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
})

it('does not start the log task outside the devcontainer even if frontend runtime mode is set', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-logs-'))
  roots.push(root)
  await writeFile(join(root, 'node'), '#!/usr/bin/env bash\nexit 99\n', { mode: 0o755 })
  const result = await promisify(execFile)(
    'bash',
    [fileURLToPath(new URL('../follow-startup.sh', import.meta.url))],
    {
      env: {
        ...process.env,
        PATH: `${root}:${process.env.PATH}`,
        INTEROP_FRONTEND_RUNTIME: 'true',
        INTEROP_DEVCONTAINER: 'false',
      },
    }
  )
  expect(result.stdout).toContain('inside the frontend devcontainer')
})

it('requests the host browser without passing the published URL through the remote CLI', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-logs-'))
  roots.push(root)
  const state = join(root, '.local-development/frontend')
  const session = 'browser-open.A1b2C3d4'
  await mkdir(join(state, session), { recursive: true })
  await writeFile(join(state, 'browser-request'), session)
  await requestHostDashboard(root)
  expect(await readFile(join(state, session, 'ready'), 'utf8')).toBe('')
  await writeFile(join(state, 'browser-request'), '../outside')
  await expect(requestHostDashboard(root)).rejects.toThrow('Invalid browser request')
})

it.each([
  ['Linux', '', 'xdg-open'],
  ['Darwin', '', 'open'],
  ['Linux', 'wsl-interop', 'powershell.exe'],
])(
  'opens the published host port after the ready marker on %s (%s)',
  async (platform, interop, opener) => {
    const root = await mkdtemp(join(tmpdir(), 'interop-logs-'))
    roots.push(root)
    const bin = join(root, 'bin')
    const state = join(root, '.local-development/frontend')
    const called = join(root, 'browser-args')
    const waiting = join(root, 'browser-waiting')
    await mkdir(bin)
    await writeFile(
      join(bin, 'sleep'),
      '#!/bin/bash\ntouch "$INTEROP_TEST_BROWSER_WAITING"\nPATH="$INTEROP_TEST_SYSTEM_PATH" sleep 0.05\n',
      { mode: 0o755 }
    )
    await writeFile(join(bin, 'uname'), `#!/bin/bash\nprintf '%s\\n' '${platform}'\n`, {
      mode: 0o755,
    })
    for (const command of ['xdg-open', 'open', 'powershell.exe']) {
      await writeFile(
        join(bin, command),
        `#!/bin/bash\nprintf '%s\\n' '${command}' "$@" > "$INTEROP_TEST_BROWSER_ARGS"\n`,
        { mode: 0o755 }
      )
    }
    const execute = promisify(execFile)
    await execute(
      'bash',
      [
        fileURLToPath(new URL('../../../.devcontainer/open-dashboard.sh', import.meta.url)),
        'prepare',
        state,
      ],
      {
        env: {
          ...process.env,
          PATH: `${bin}:${process.env.PATH}`,
          WSL_INTEROP: interop,
          INTEROP_TEST_BROWSER_ARGS: called,
          INTEROP_TEST_BROWSER_WAITING: waiting,
          INTEROP_TEST_SYSTEM_PATH: process.env.PATH,
        },
      }
    )
    await vi.waitFor(() => access(waiting))
    await expect(access(called)).rejects.toThrow()
    const session = (await readFile(join(state, 'browser-request'), 'utf8')).trim()
    await requestHostDashboard(root, session)
    await vi.waitFor(
      async () => {
        const args = await readFile(called, 'utf8')
        expect(args.split('\n')[0]).toBe(opener)
        expect(args).toContain('http://localhost:8076/#/status')
        expect(args).not.toContain('8077')
        await expect(access(join(state, session))).rejects.toThrow()
      },
      { timeout: 3000 }
    )
  }
)

it('expires a superseded browser request without opening its ready marker', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-logs-'))
  roots.push(root)
  const session = 'browser-open.A1b2C3d4'
  await mkdir(join(root, session))
  await writeFile(join(root, 'browser-request'), 'browser-open.newTOKEN')
  await writeFile(join(root, session, 'ready'), '')
  for (const command of ['xdg-open', 'open', 'powershell.exe']) {
    await writeFile(join(root, command), '#!/bin/bash\nexit 99\n', { mode: 0o755 })
  }
  await promisify(execFile)(
    'bash',
    [
      fileURLToPath(new URL('../../../.devcontainer/open-dashboard.sh', import.meta.url)),
      'wait',
      root,
      session,
    ],
    { env: { ...process.env, PATH: `${root}:${process.env.PATH}` } }
  )
  await expect(access(join(root, session))).rejects.toThrow()
})

it('retries an unavailable dashboard and incrementally follows frontend and orchestration logs without replay', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-logs-'))
  roots.push(root)
  const directory = join(root, '.local-development/frontend')
  await mkdir(directory, { recursive: true })
  const startup = join(directory, 'startup.log')
  await writeFile(startup, 'Installing dependencies\n')
  const write = vi.fn()
  const request = vi
    .fn()
    .mockRejectedValueOnce(new Error('not ready'))
    .mockResolvedValueOnce({
      entries: [{ source: 'orchestration', message: 'Infrastructure ready' }],
      cursors: { orchestration: 'generation:1' },
    })
    .mockResolvedValueOnce({ entries: [], cursors: { orchestration: 'generation:1' } })
  const follower = createStartupLogFollower({ root, request, write })
  await follower.poll()
  await appendFile(startup, 'Vite ready\n')
  await follower.poll()
  await follower.poll()
  const output = write.mock.calls.flat().join('')
  expect(output.match(/Installing dependencies/g)).toHaveLength(1)
  expect(output.match(/Vite ready/g)).toHaveLength(1)
  expect(output.match(/Infrastructure ready/g)).toHaveLength(1)
  expect(output).toContain('Waiting for backend dashboard logs')
  const query = new URLSearchParams(request.mock.calls[2][0].split('?')[1])
  expect(query.get('source')).toBe('orchestration')
  expect(JSON.parse(query.get('cursors'))).toEqual({ orchestration: 'generation:1' })
  expect(request.mock.calls.every(([path]) => path.startsWith('logs?'))).toBe(true)
})

it('bounds frontend reads and follows a truncated startup log', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-logs-'))
  roots.push(root)
  const directory = join(root, '.local-development/frontend')
  await mkdir(directory, { recursive: true })
  const startup = join(directory, 'startup.log')
  await writeFile(startup, 'x'.repeat(100_000))
  const write = vi.fn()
  const follower = createStartupLogFollower({
    root,
    request: async () => ({ entries: [], cursors: {} }),
    write,
  })
  await follower.poll()
  expect(write.mock.calls[0][0].length).toBeLessThan(65_600)
  await writeFile(startup, 'Retrying startup\n')
  await follower.poll()
  expect(write.mock.calls.flat().join('')).toContain('Retrying startup')
})

it('opens the status page only after dashboard health, once per terminal attachment', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-logs-'))
  roots.push(root)
  let healthy = false
  const openDashboard = vi.fn(async () => {})
  const request = vi.fn(async (path) => {
    if (path === 'health') {
      if (!healthy) throw new Error('Dashboard building')
      return { status: 'ok' }
    }
    return { entries: [], cursors: {} }
  })
  const follower = createStartupLogFollower({ root, request, write: () => {}, openDashboard })
  await follower.poll()
  expect(openDashboard).not.toHaveBeenCalled()
  healthy = true
  await follower.poll()
  await follower.poll()
  expect(openDashboard).toHaveBeenCalledExactlyOnceWith('http://localhost:8076/#/status')
  const reattached = createStartupLogFollower({ root, request, write: () => {}, openDashboard })
  await reattached.poll()
  expect(openDashboard).toHaveBeenCalledTimes(2)
})

it('keeps following logs and prints one useful URL if the host opener is unavailable', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-logs-'))
  roots.push(root)
  const write = vi.fn()
  const openDashboard = vi.fn(async () => {
    throw new Error('host opener unavailable')
  })
  const follower = createStartupLogFollower({
    root,
    request: async (path) =>
      path === 'health'
        ? { status: 'ok' }
        : { entries: [{ source: 'orchestration', message: 'Backend running' }], cursors: {} },
    openDashboard,
    write,
  })
  await follower.poll()
  await follower.poll()
  expect(openDashboard).toHaveBeenCalledOnce()
  const output = write.mock.calls.flat().join('')
  expect(output.match(/Cannot request automatic browser opening/g)).toHaveLength(1)
  expect(output).toContain('http://localhost:8076/#/status')
  expect(output).toContain('Backend running')
})
