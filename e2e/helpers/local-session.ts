import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'

export async function expectCatalog(page: Page, timeout?: number) {
  const accessButton = page.getByRole('button', { name: 'Accedi', exact: true })
  const heading = page.getByRole('heading', { name: 'Catalogo degli e-service' })
  await expect(accessButton.or(heading).first()).toBeVisible({ timeout })
  if (await accessButton.isVisible()) await accessButton.click()
  await expect(heading).toBeVisible({ timeout })
}
