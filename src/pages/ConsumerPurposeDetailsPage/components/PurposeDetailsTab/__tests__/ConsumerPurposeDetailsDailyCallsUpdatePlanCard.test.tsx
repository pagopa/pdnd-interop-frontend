import { screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ConsumerPurposeDetailsDailyCallsUpdatePlanCard } from '../ConsumerPurposeDetailsDailyCallsUpdatePlanCard'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import type { PurposeVersion } from '@/api/api.generatedTypes'

vi.mock('@/api/purpose', () => ({
  PurposeMutations: {
    useDeleteVersion: () => ({ mutate: vi.fn() }),
  },
}))

mockUseJwt()

const waitingForApprovalVersion: PurposeVersion = {
  id: 'waiting-for-approval-version-id',
  state: 'WAITING_FOR_APPROVAL',
  createdAt: '2023-02-03T07:59:52.458Z',
  dailyCalls: 20,
}

describe('ConsumerPurposeDetailsDailyCallsUpdatePlanCard', () => {
  it('shows the remove change plan request link for admin consumers with a pending request', () => {
    renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsUpdatePlanCard
        purpose={createMockPurpose({ waitingForApprovalVersion })}
      />,
      { withReactQueryContext: true }
    )
    expect(screen.getByText('removeChangePlanRequestLink.label')).toBeInTheDocument()
  })

  it('hides the remove change plan request link for the delegator of an active delegation', () => {
    renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsUpdatePlanCard
        purpose={createMockPurpose({
          waitingForApprovalVersion,
          delegation: {
            id: 'delegation-id',
            delegator: { id: 'organizationId', name: 'Delegator' },
            delegate: { id: 'delegate-id', name: 'Delegate' },
          },
        })}
      />,
      { withReactQueryContext: true }
    )
    expect(screen.queryByText('removeChangePlanRequestLink.label')).not.toBeInTheDocument()
  })

  it('shows the remove change plan request link for the delegate of an active delegation', () => {
    renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsUpdatePlanCard
        purpose={createMockPurpose({
          waitingForApprovalVersion,
          delegation: {
            id: 'delegation-id',
            delegator: { id: 'delegator-id', name: 'Delegator' },
            delegate: { id: 'organizationId', name: 'Delegate' },
          },
        })}
      />,
      { withReactQueryContext: true }
    )
    expect(screen.getByText('removeChangePlanRequestLink.label')).toBeInTheDocument()
  })

  it('shows the remove change plan request link disabled when the current version is suspended', () => {
    renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsUpdatePlanCard
        purpose={createMockPurpose({
          waitingForApprovalVersion,
          currentVersion: { state: 'SUSPENDED' },
        })}
      />,
      { withReactQueryContext: true }
    )
    expect(screen.getByRole('button', { name: 'removeChangePlanRequestLink.label' })).toBeDisabled()
  })

  it('hides the remove change plan request link for non-admin users', () => {
    mockUseJwt({ isAdmin: false })
    renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsUpdatePlanCard
        purpose={createMockPurpose({ waitingForApprovalVersion })}
      />,
      { withReactQueryContext: true }
    )
    expect(screen.queryByText('removeChangePlanRequestLink.label')).not.toBeInTheDocument()
  })
})
