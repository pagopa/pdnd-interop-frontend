import { requestJson, runAction, waitForDashboard } from './dashboard-client.mjs'
import { startFrontendObserver } from './frontend-observer.mjs'

const pause = () => new Promise((resolve) => setTimeout(resolve, 1000))

const startupPhases = [
  ['install', 'Frontend dependencies and browser'],
  ['dashboard', 'Backend dashboard API'],
  ['infra', 'Infrastructure'],
  ['backend', 'Frontend backend preset'],
  ['seed', 'Local seed'],
  ['identity', 'Local identity'],
  ['vite', 'Vite'],
  ['smoke', 'Smoke checks'],
  ['browser', 'Browser checks'],
]

export function createFrontendLauncher({ runtime, request = requestJson, pause: wait = pause }) {
  const checkedRequest = async (...args) => {
    runtime.assertActive?.()
    const result = await request(...args)
    runtime.assertActive?.()
    return result
  }
  const checkedPause = async () => {
    runtime.assertActive?.()
    await wait()
    runtime.assertActive?.()
  }
  function execute(ids, task) {
    return runtime.exclusive(async () => {
      let phases = startupPhases.map(([id, label]) => ({
        id,
        label,
        state: ids.includes(id) ? 'pending' : 'skipped',
      }))
      const report = () => runtime.reportStartup({ state: 'running', phases })
      const update = async (id, changes) => {
        phases = phases.map((phase) => (phase.id === id ? { ...phase, ...changes } : phase))
        await report()
      }
      const phase = async (id, work) => {
        await update(id, { state: 'running' })
        try {
          const result = await work((operationId) => update(id, { operationId }))
          await update(id, { state: 'passed' })
          return result
        } catch (error) {
          await update(id, { state: 'failed', error: error.message })
          throw error
        }
      }
      const action = (id, input) =>
        phase(id, (onAccepted) =>
          runAction(input, { request: checkedRequest, pause: checkedPause, onAccepted })
        )
      await report()
      try {
        return await task({ phase, action, skip: (id) => update(id, { state: 'skipped' }) })
      } catch (error) {
        phases = phases.map((item) =>
          item.state === 'pending' ? { ...item, state: 'skipped' } : item
        )
        await report()
        throw error
      }
    })
  }

  async function token(tenantKey, userKey) {
    const identities = await checkedRequest('identities')
    const tenant = identities.tenants.find((candidate) => candidate.key === tenantKey)
    const user = tenant?.users.find((candidate) => candidate.key === userKey)
    if (!identities.ready || !user) throw new Error('Unknown or unseeded local identity')
    const { sessionToken } = await checkedRequest('identity', { tenantKey, userId: user.id })
    await runtime.storeToken(sessionToken, { tenantKey, userKey })
  }

  return {
    start: ({ stopOnFailure = false } = {}) =>
      execute(
        startupPhases.map(([id]) => id),
        async ({ phase, action, skip }) => {
          try {
            const previous = await runtime.status()
            if (!previous.running) await phase('install', () => runtime.install())
            else await skip('install')
            console.log('Waiting for the backend dashboard API')
            await phase('dashboard', () =>
              waitForDashboard({ request: checkedRequest, pause: checkedPause })
            )
            console.log('Backend dashboard API is ready')
            await action('infra', { type: 'infra.start' })
            await action('backend', { type: 'preset.start', id: 'frontend-full' })
            await action('seed', { type: 'seed' })
            await phase('identity', async () => {
              const identity = await runtime.identity()
              await token(identity.tenantKey, identity.userKey)
            })
            await phase('vite', async () => {
              if (previous.running) await runtime.stop()
              await runtime.start('local')
            })
            await phase('smoke', () => runtime.smoke())
            await phase('browser', () => runtime.browserChecks())
          } catch (error) {
            if (stopOnFailure) await runtime.stop()
            throw error
          }
        }
      ),
    stop: () =>
      execute(['vite', 'backend'], async ({ phase, action }) => {
        await phase('vite', () => runtime.stop())
        await action('backend', { type: 'preset.stop', id: 'frontend-full' })
      }),
    useMode: (mode) =>
      execute(mode === 'local' ? ['identity', 'vite'] : ['vite'], async ({ phase }) => {
        if (!['local', 'dev'].includes(mode)) throw new Error(`Unknown frontend mode: ${mode}`)
        if (mode === 'local') {
          await phase('identity', async () => {
            const identity = await runtime.identity()
            await token(identity.tenantKey, identity.userKey)
          })
        }
        await phase('vite', async () => {
          await runtime.stop()
          await runtime.start(mode)
        })
      }),
    selectIdentity: (tenantKey, userKey) =>
      execute(['identity', 'vite'], async ({ phase }) => {
        await phase('identity', () => token(tenantKey, userKey))
        await phase('vite', async () => {
          await runtime.stop()
          await runtime.start('local')
        })
      }),
    reset: () =>
      execute(['vite', 'infra'], async ({ phase, action }) => {
        await phase('vite', () => runtime.stop())
        await action('infra', { type: 'infra.reset', confirm: true })
      }),
  }
}

export async function serveFrontend({
  runtime,
  launcher,
  signals = process,
  keepAlive = () => setInterval(() => {}, 60_000),
  clearKeepAlive = clearInterval,
  reportError = (error) => console.error(error.message),
  observe = () => startFrontendObserver({ runtime }),
}) {
  const timer = keepAlive()
  let observation
  let stopping = false
  const shutdown = () => {
    if (stopping) return
    stopping = true
    void (async () => {
      try {
        await runtime.shutdown()
      } finally {
        try {
          const observer = await observation?.catch(() => undefined)
          await observer?.close()
        } finally {
          clearKeepAlive(timer)
        }
      }
    })().catch(reportError)
  }
  signals.once('SIGINT', shutdown)
  signals.once('SIGTERM', shutdown)
  try {
    observation = Promise.resolve().then(observe)
    await observation
    if (stopping) return
    await launcher.start({ stopOnFailure: true })
    console.log('Frontend ready: http://localhost:3000/ui/it/')
  } catch (error) {
    reportError(error)
    console.error(
      'The frontend container remains available. Fix the error and retry pnpm local:start.'
    )
  }
}
