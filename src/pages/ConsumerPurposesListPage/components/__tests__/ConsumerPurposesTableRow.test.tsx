import React from 'react'
import { describe, it, expect } from 'vitest'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { ConsumerPurposesTableRow } from '../ConsumerPurposesTableRow'
import type {
  PurposeVersionState,
  ReviewerWorkflow,
  RiskAnalysisSigningState,
} from '@/api/api.generatedTypes'

const buildPurpose = (
  currentVersionState: PurposeVersionState,
  signingState: RiskAnalysisSigningState | undefined
) => {
  const reviewerWorkflow: ReviewerWorkflow | undefined = signingState
    ? {
        reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
        reviewerIds: [],
        signingState,
      }
    : undefined

  return createMockPurpose({
    currentVersion: { state: currentVersionState },
    reviewerWorkflow,
  })
}

mockUseJwt()

const renderRow = (purpose: ReturnType<typeof buildPurpose>) =>
  renderWithApplicationContext(
    <table>
      <tbody>
        <ConsumerPurposesTableRow purpose={purpose} />
      </tbody>
    </table>,
    { withRouterContext: true, withReactQueryContext: true }
  )

describe('ConsumerPurposesTableRow - risk analysis signing state info icon', () => {
  it('renders the info icon with aria-label "list.riskAnalysisApproved" when the purpose is a DRAFT and reviewerWorkflow.signingState is SIGNED', () => {
    const { queryByLabelText } = renderRow(buildPurpose('DRAFT', 'SIGNED'))

    expect(queryByLabelText('list.riskAnalysisApproved')).toBeInTheDocument()
    expect(queryByLabelText('list.riskAnalysisRejected')).not.toBeInTheDocument()
  })

  it('renders the info icon with aria-label "list.riskAnalysisRejected" when the purpose is a DRAFT and reviewerWorkflow.signingState is REJECTED', () => {
    const { queryByLabelText } = renderRow(buildPurpose('DRAFT', 'REJECTED'))

    expect(queryByLabelText('list.riskAnalysisRejected')).toBeInTheDocument()
    expect(queryByLabelText('list.riskAnalysisApproved')).not.toBeInTheDocument()
  })

  it.each(['ASSIGNED', 'SUBMITTED', undefined] as const)(
    'does not render the info icon for a DRAFT purpose when reviewerWorkflow.signingState is %s',
    (signingState) => {
      const { queryByLabelText } = renderRow(buildPurpose('DRAFT', signingState))

      expect(queryByLabelText('list.riskAnalysisApproved')).not.toBeInTheDocument()
      expect(queryByLabelText('list.riskAnalysisRejected')).not.toBeInTheDocument()
    }
  )

  it.each(['SIGNED', 'REJECTED'] as const)(
    'does not render the info icon when the purpose is not a DRAFT, even if reviewerWorkflow.signingState is %s',
    (signingState) => {
      const { queryByLabelText } = renderRow(buildPurpose('ACTIVE', signingState))

      expect(queryByLabelText('list.riskAnalysisApproved')).not.toBeInTheDocument()
      expect(queryByLabelText('list.riskAnalysisRejected')).not.toBeInTheDocument()
    }
  )
})
