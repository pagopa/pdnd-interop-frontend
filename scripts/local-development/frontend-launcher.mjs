import { requestJson, runAction, waitForDashboard } from './dashboard-client.mjs'

const pause = () => new Promise((resolve) => setTimeout(resolve, 1000))

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
  const action = (input) => runAction(input, { request: checkedRequest, pause: checkedPause })

  async function token(tenantKey, userKey) {
    const identities = await checkedRequest('identities')
    const tenant = identities.tenants.find((candidate) => candidate.key === tenantKey)
    const user = tenant?.users.find((candidate) => candidate.key === userKey)
    if (!identities.ready || !user) throw new Error('Unknown or unseeded local identity')
    const { sessionToken } = await checkedRequest('identity', { tenantKey, userId: user.id })
    await runtime.storeToken(sessionToken, { tenantKey, userKey })
  }

  return {
    start: () =>
      runtime.exclusive(async () => {
        const previous = await runtime.status()
        if (!previous.running) await runtime.install()
        await waitForDashboard({ request: checkedRequest, pause: checkedPause })
        await action({ type: 'infra.start' })
        await action({ type: 'preset.start', id: 'frontend-full' })
        await action({ type: 'seed' })
        const identity = await runtime.identity()
        await token(identity.tenantKey, identity.userKey)
        if (previous.running) await runtime.stop()
        await runtime.start('local')
        await runtime.smoke()
        await runtime.browserChecks()
      }),
    stop: () =>
      runtime.exclusive(async () => {
        await runtime.stop()
        await action({ type: 'preset.stop', id: 'frontend-full' })
      }),
    useMode: (mode) =>
      runtime.exclusive(async () => {
        if (!['local', 'dev'].includes(mode)) throw new Error(`Unknown frontend mode: ${mode}`)
        if (mode === 'local') {
          const identity = await runtime.identity()
          await token(identity.tenantKey, identity.userKey)
        }
        await runtime.stop()
        await runtime.start(mode)
      }),
    selectIdentity: (tenantKey, userKey) =>
      runtime.exclusive(async () => {
        await token(tenantKey, userKey)
        await runtime.stop()
        await runtime.start('local')
      }),
    reset: () =>
      runtime.exclusive(async () => {
        await runtime.stop()
        await action({ type: 'infra.reset', confirm: true })
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
}) {
  const timer = keepAlive()
  const shutdown = () => {
    void runtime.shutdown().finally(() => clearKeepAlive(timer))
  }
  signals.once('SIGINT', shutdown)
  signals.once('SIGTERM', shutdown)
  await runtime.reportStartup({ state: 'running' })
  try {
    await launcher.start()
    await runtime.reportStartup({ state: 'passed' })
    console.log('Frontend ready: http://localhost:3000/ui/it/')
  } catch (error) {
    await runtime.reportStartup({ state: 'failed', error: error.message })
    await runtime.stop()
    reportError(error)
    console.error(
      'The frontend container remains available. Fix the error and retry pnpm local:start.'
    )
  }
}
