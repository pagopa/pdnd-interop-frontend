import { expect, test } from '@playwright/test'
import { expectCatalog } from './helpers/local-session'

// The dashboard is served independently of the Vite frontend.
test('serves the backend dashboard and its API on their own origin', async ({ request }) => {
  const dashboardUrl = process.env.PLAYWRIGHT_DASHBOARD_URL ?? 'http://localhost:8076'
  const health = await request.get(`${dashboardUrl}/health`)
  expect(health.ok()).toBe(true)
  expect(await health.json()).toEqual({ status: 'ok' })
  const shell = await request.get(dashboardUrl)
  expect(shell.ok()).toBe(true)
  expect(shell.headers()['content-type']).toContain('text/html')
  const status = await request.get(`${dashboardUrl}/__local-dashboard/api/status`)
  expect(status.ok()).toBe(true)
  const runtime = await status.json()
  expect(runtime).not.toHaveProperty('frontendAvailable')
  expect(runtime).not.toHaveProperty('mode')
})

test('selects a local tenant and role-specific user from the local identity route', async ({
  page,
}) => {
  // This is the first frontend page load; cold Vite transforms on Docker Desktop
  // share the budget with identity selection, application startup, and logout.
  test.setTimeout(120_000)

  await page.goto('/ui/it/local-identity-selection/')
  await page.getByRole('alert').getByRole('button').click()

  await page.getByRole('combobox', { name: 'Ente', exact: true }).click()
  await page.getByRole('option', { name: 'Provider Demo' }).click()
  await page.getByRole('combobox', { name: 'Utente', exact: true }).click()
  await page.getByRole('option', { name: 'Utente Viewer' }).click()
  await page.getByRole('button', { name: 'Prosegui' }).click()

  await expect(page).not.toHaveURL(/local-identity-selection/)
  const selectedClaims = await page.evaluate(() => {
    const token = window.localStorage.getItem('token')
    if (!token) return null
    return JSON.parse(atob(token.split('.')[1].replaceAll('-', '+').replaceAll('_', '/')))
  })
  expect(selectedClaims).toMatchObject({
    organization: {
      id: '00000000-0000-4000-8000-000000000002',
      name: 'Provider Demo',
    },
    uid: '10000000-0000-4000-8000-000000000005',
    'user-roles': 'viewer',
  })

  await expectCatalog(page, 120_000)
  await page.getByRole('button', { name: 'Esci' }).click()

  await expect(page).toHaveURL(/\/ui\/it\/local-identity-selection\/$/)
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('token'))).toBeNull()
})
