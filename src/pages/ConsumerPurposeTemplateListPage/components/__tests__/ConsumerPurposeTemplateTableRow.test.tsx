import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import {
  mockUseGetActiveUserParty,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { ConsumerPurposeTemplateTableRow } from '../ConsumerPurposeTemplateTableRow'
import type { CreatorPurposeTemplate } from '@/api/api.generatedTypes'

vi.mock('@/hooks/useGetConsumerPurposeTemplatesActions', () => ({
  default: () => ({ actions: [] }),
}))

const draftTemplate = {
  id: 'pt-1',
  purposeTitle: 'My draft template',
  state: 'DRAFT',
  targetTenantKind: 'PA',
} as CreatorPurposeTemplate

function renderRow(purposeTemplate: CreatorPurposeTemplate = draftTemplate) {
  return renderWithApplicationContext(
    <table>
      <tbody>
        <ConsumerPurposeTemplateTableRow purposeTemplate={purposeTemplate} />
      </tbody>
    </table>,
    { withRouterContext: true, withReactQueryContext: true }
  )
}

describe('ConsumerPurposeTemplateTableRow', () => {
  beforeEach(() => {
    mockUseGetActiveUserParty()
  })

  it('navigates a viewer to the read-only summary for a draft template', async () => {
    mockUseJwt({ isAdmin: false, isViewer: true })

    const { getByRole, history } = renderRow()
    await userEvent.setup().click(getByRole('link'))

    expect(history.location.pathname).toBe(
      '/it/fruizione/template-finalita/pt-1/modifica/riepilogo'
    )
  })

  it('navigates a non-viewer to the draft edit page for a draft template', async () => {
    mockUseJwt()

    const { getByRole, history } = renderRow()
    await userEvent.setup().click(getByRole('link'))

    expect(history.location.pathname).toBe('/it/fruizione/template-finalita/pt-1/modifica')
  })
})
