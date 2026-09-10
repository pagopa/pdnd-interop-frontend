import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { z } from 'zod'

const claimsSchema = z
  .object({
    organizationId: z.string(),
    selfcareId: z.string(),
    uid: z.string(),
    'user-roles': z.string(),
  })
  .passthrough()
const viewerId = '10000000-0000-4000-8000-000000000005'
const oldTenantId = '29e0fcf1-bb91-4571-8260-1cd8ae5907c2'

async function expectCatalog(page: Page) {
  const accessButton = page.getByRole('button', { name: 'Accedi', exact: true })
  const heading = page.getByRole('heading', { name: 'Catalogo degli e-service' })
  await expect(accessButton.or(heading).first()).toBeVisible()
  if (await accessButton.isVisible()) await accessButton.click()
  await expect(heading).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/ui/it/local-identity-selection/')
  // Issue a real current token through Vite, then simulate storage left by an old seed.
  const session = z.object({ sessionToken: z.string() }).parse(
    await page.evaluate(async (userId) => {
      const response = await fetch('/__local-dashboard/api/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantKey: 'provider', userId }),
      })
      return response.json()
    }, viewerId)
  )
  const [header, payload, signature] = session.sessionToken.split('.')
  const claims = claimsSchema.parse(JSON.parse(Buffer.from(payload, 'base64url').toString()))
  const oldPayload = Buffer.from(
    JSON.stringify({ ...claims, organizationId: oldTenantId })
  ).toString('base64url')
  const oldToken = `${header}.${oldPayload}.${signature}`
  await page.evaluate((token) => localStorage.setItem('token', token), oldToken)
})

test('recovers the selected tenant and viewer before making application requests', async ({
  page,
}) => {
  const obsoleteRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().includes(`/tenants/${oldTenantId}`)) obsoleteRequests.push(request.url())
  })
  await page.goto('/ui/it/catalogo-e-service')
  await expectCatalog(page)
  await expect(page.getByText('Catalogo Demo', { exact: true })).toBeVisible()
  const claims = claimsSchema.parse(
    await page.evaluate(() => {
      const token = localStorage.getItem('token')
      return (
        token && JSON.parse(atob(token.split('.')[1].replaceAll('-', '+').replaceAll('_', '/')))
      )
    })
  )
  expect(claims.organizationId).not.toBe(oldTenantId)
  expect(claims.selfcareId).toBe('00000000-0000-4000-8000-000000000002')
  expect(claims.uid).toBe(viewerId)
  expect(claims['user-roles']).toBe('viewer')
  expect(obsoleteRequests).toEqual([])
})

test('waits for the completed seed without discarding the saved identity', async ({ page }) => {
  let ready = false
  let checks = 0
  const tenantRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().includes('/backend-for-frontend/tenants/')) tenantRequests.push(request.url())
  })
  await page.route('**/__local-dashboard/api/identities', async (route) => {
    checks++
    if (ready) await route.continue()
    else await route.fulfill({ json: { ready: false, tenants: [] } })
  })
  const oldToken = await page.evaluate(() => localStorage.getItem('token'))
  await page.goto('/ui/it/catalogo-e-service')
  await expect.poll(() => checks).toBeGreaterThanOrEqual(2)
  expect(await page.evaluate(() => localStorage.getItem('token'))).toBe(oldToken)
  expect(tenantRequests).toEqual([])
  expect(page.url()).not.toContain('local-identity-selection')
  ready = true
  await expectCatalog(page)
})

test('opens identity selection when the selected identity was removed', async ({ page }) => {
  await page.route('**/__local-dashboard/api/identities', (route) =>
    route.fulfill({ json: { ready: true, tenants: [] } })
  )
  await page.goto('/ui/it/catalogo-e-service')
  await expect(page).toHaveURL(/\/ui\/it\/local-identity-selection\/$/)
  expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull()
})

test('rechecks on focus and recovers after a temporary connection failure', async ({ page }) => {
  await page.goto('/ui/it/catalogo-e-service')
  await expectCatalog(page)
  const currentToken = await page.evaluate(() => localStorage.getItem('token'))
  const unchangedCheck = page.waitForResponse('**/__local-dashboard/api/identities')
  await page.evaluate(() => {
    document.body.dataset.sessionTest = 'same-document'
    window.dispatchEvent(new Event('focus'))
  })
  await unchangedCheck
  expect(await page.evaluate(() => localStorage.getItem('token'))).toBe(currentToken)
  await expect(page.locator('body')).toHaveAttribute('data-session-test', 'same-document')
  let checks = 0
  await page.route('**/__local-dashboard/api/identities', async (route) => {
    checks++
    if (checks === 1) await route.abort('connectionrefused')
    else await route.continue()
  })
  const oldToken = await page.evaluate((tenantId) => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Missing session')
    const [header, payload, signature] = token.split('.')
    const claims = JSON.parse(atob(payload.replaceAll('-', '+').replaceAll('_', '/')))
    const oldPayload = btoa(JSON.stringify({ ...claims, organizationId: tenantId }))
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replaceAll('=', '')
    const previousToken = `${header}.${oldPayload}.${signature}`
    localStorage.setItem('token', previousToken)
    window.dispatchEvent(new Event('focus'))
    return previousToken
  }, oldTenantId)
  await expect.poll(() => checks, { timeout: 5000 }).toBe(1)
  expect(await page.evaluate(() => localStorage.getItem('token'))).toBe(oldToken)
  await expect.poll(() => page.evaluate(() => localStorage.getItem('token'))).not.toBe(oldToken)
  expect(await page.evaluate(() => localStorage.getItem('token'))).not.toBe(currentToken)
  await expect(page.getByRole('heading', { name: 'Catalogo degli e-service' })).toBeVisible()
  await expect(page.locator('body')).not.toHaveAttribute('data-session-test', 'same-document')
})
