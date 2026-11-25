import { afterEach, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

it('enables local identities without enabling a frontend dashboard', async () => {
  vi.stubEnv('DEV', true)
  vi.stubEnv('REACT_APP_LOCAL_IDENTITY_SELECTION', 'true')
  const { isLocalIdentitySelectionEnabled } = await import('../local-development')
  expect(isLocalIdentitySelectionEnabled).toBe(true)
})

it('does not enable local identities in a production build', async () => {
  vi.stubEnv('DEV', false)
  vi.stubEnv('REACT_APP_LOCAL_IDENTITY_SELECTION', 'true')
  const { isLocalIdentitySelectionEnabled } = await import('../local-development')
  expect(isLocalIdentitySelectionEnabled).toBe(false)
})
