import { z } from 'zod'

const localIdentitiesSchema = z.object({
  ready: z.boolean(),
  tenants: z.array(
    z.object({
      key: z.string(),
      id: z.string().uuid(),
      selfcareId: z.string(),
      name: z.string(),
      users: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          surname: z.string(),
          email: z.string().email(),
          roles: z.array(z.string()),
        })
      ),
    })
  ),
})

const sessionTokenSchema = z.object({ sessionToken: z.string().min(1) })

const requestJson = async (path: string, init?: RequestInit) => {
  const controller = new AbortController()
  const abort = () => controller.abort()
  const timeout = setTimeout(abort, 10000)
  init?.signal?.addEventListener('abort', abort, { once: true })
  if (init?.signal?.aborted) abort()
  try {
    const response = await fetch(`/__local-dashboard/api/${path}`, {
      ...init,
      cache: 'no-store',
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`Local identity request failed with ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timeout)
    init?.signal?.removeEventListener('abort', abort)
  }
}

async function getIdentities(signal?: AbortSignal) {
  const identities = localIdentitiesSchema.parse(await requestJson('identities', { signal }))
  if (!identities.ready) throw new Error('Local seed is not ready')
  return identities
}

async function createIdentityToken(tenantKey: string, userId: string, signal?: AbortSignal) {
  return sessionTokenSchema.parse(
    await requestJson('identity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantKey, userId }),
      signal,
    })
  )
}

export const LocalIdentityServices = { getIdentities, createIdentityToken }
