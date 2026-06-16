import { screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ConsumerPurposeDetailsDailyCallsPlanCard } from '../ConsumerPurposeDetailsDailyCallsPlanCard'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'

mockUseJwt()

vi.mock('../ConsumerPurposeDetailsDailyCallsUpdateDrawer', () => ({
  ConsumerPurposeDetailsDailyCallsUpdateDrawer: () => <div data-testid="update-drawer" />,
}))

describe('ConsumerPurposeDetailsDailyCallsPlanCard', () => {
  it('shows the change plan request link for admin users', () => {
    renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsPlanCard purpose={createMockPurpose()} />,
      { withReactQueryContext: true }
    )
    expect(screen.getByText('changePlanRequestLink.label')).toBeInTheDocument()
  })

  it('hides the change plan request link for non-admin (viewer) users', () => {
    mockUseJwt({ isAdmin: false })
    renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsPlanCard purpose={createMockPurpose()} />,
      { withReactQueryContext: true }
    )
    expect(screen.queryByText('changePlanRequestLink.label')).not.toBeInTheDocument()
  })
})
