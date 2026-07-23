import { expect, test } from '@playwright/test'

test('shows local services and searches their logs', async ({ page }) => {
  await page.goto('/ui/local-dashboard/')

  await expect(page.getByRole('heading', { name: 'Ambiente locale' })).toBeVisible()
  await expect(page.getByText('pagopa-interop-catalog-process', { exact: true })).toBeVisible()

  const startupPanel = page
    .getByRole('heading', { name: /Avvio dell/ })
    .locator('..')
    .locator('..')
  const searchPanel = page
    .locator('.MuiPaper-root')
    .filter({ has: page.getByRole('searchbox', { name: 'Cerca nei log' }) })
  const servicesPanel = page.getByRole('heading', { name: 'Servizi' }).locator('..').locator('..')
  const logsPanel = page.getByRole('heading', { name: 'Log' }).locator('..').locator('..')
  const cardsContainer = servicesPanel.locator('..')
  const [startupBox, searchBox, servicesBox, logsBox, cardsBox] = await Promise.all([
    startupPanel.boundingBox(),
    searchPanel.boundingBox(),
    servicesPanel.boundingBox(),
    logsPanel.boundingBox(),
    cardsContainer.boundingBox(),
  ])

  expect(startupBox).not.toBeNull()
  expect(searchBox).not.toBeNull()
  expect(servicesBox).not.toBeNull()
  expect(logsBox).not.toBeNull()
  expect(cardsBox).not.toBeNull()
  expect(startupBox?.y ?? 0).toBeLessThan(searchBox?.y ?? 0)
  expect(searchBox?.y ?? 0).toBeLessThan(servicesBox?.y ?? 0)
  expect(Math.abs((servicesBox?.x ?? 0) - (startupBox?.x ?? 0))).toBeLessThanOrEqual(1)
  expect((logsBox?.x ?? 0) + (logsBox?.width ?? 0)).toBeLessThanOrEqual(
    (startupBox?.x ?? 0) + (startupBox?.width ?? 0) + 1
  )
  expect((servicesBox?.y ?? 0) + (servicesBox?.height ?? 0)).toBeLessThanOrEqual(
    (cardsBox?.y ?? 0) + (cardsBox?.height ?? 0) + 1
  )

  const [rootBox, dashboardBox] = await Promise.all([
    page.locator('#root').boundingBox(),
    page.getByTestId('local-development-dashboard').boundingBox(),
  ])
  expect(rootBox).not.toBeNull()
  expect(dashboardBox).not.toBeNull()
  expect(rootBox?.height ?? 0).toBeGreaterThanOrEqual((dashboardBox?.height ?? 0) - 1)

  const renderedLogRows = page.getByRole('list', { name: 'Log' }).getByRole('listitem')
  await expect(renderedLogRows.first()).toBeVisible()
  expect(await renderedLogRows.count()).toBeLessThan(50)

  await page.getByRole('searchbox', { name: 'Cerca nei log' }).fill('Local infrastructure is ready')
  await expect(page.getByText('Local infrastructure is ready', { exact: false })).toBeVisible()
})
