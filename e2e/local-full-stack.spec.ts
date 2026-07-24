import { expect, test } from '@playwright/test'

test('publishes the frontend instead of an internal backend endpoint', async ({ request }) => {
  const publicFrontendUrl =
    process.env.PLAYWRIGHT_PUBLIC_FRONTEND_URL ?? 'http://host.docker.internal:3000/ui/it/'
  const response = await request.get(publicFrontendUrl)
  const body = await response.text()

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/html')
  expect(body).toContain('<title>PDND Interoperabilità | PagoPA</title>')
  expect(body).not.toContain('Header has not been passed')
  expect(body).not.toContain('Missing X-Correlation-Id')
})

test('renders the e-service created by the local seed', async ({ page }) => {
  await page.goto('/ui/it/catalogo-e-service')
  const accessButton = page.getByRole('button', { name: 'Accedi' })
  if (await accessButton.isVisible()) {
    await accessButton.click()
  }

  await expect(page.getByRole('heading', { name: 'Catalogo degli e-service' })).toBeVisible()
  await expect(page.getByText('Catalogo Demo', { exact: true })).toBeVisible()
  await expect(page.getByText('Provider Demo', { exact: true })).toBeVisible()
})
