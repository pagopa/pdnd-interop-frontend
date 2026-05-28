import React from 'react'
import { describe, it, expect } from 'vitest'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { ConsumerPurposesTableRow } from '../ConsumerPurposesTableRow'
import type {
  Purpose,
  PurposeVersionState,
  RiskAnalysisSigningState,
} from '@/api/api.generatedTypes'

type PurposeWithRiskAnalysisSigningState = Purpose & {
  riskAnalysisSigningState?: RiskAnalysisSigningState
}

const buildPurpose = (
  currentVersionState: PurposeVersionState,
  riskAnalysisSigningState: RiskAnalysisSigningState | undefined
) =>
  createMockPurpose({
    currentVersion: { state: currentVersionState },
    riskAnalysisSigningState,
  } as PurposeWithRiskAnalysisSigningState)

const renderRow = (purpose: Purpose) =>
  renderWithApplicationContext(
    <table>
      <tbody>
        <ConsumerPurposesTableRow purpose={purpose} />
      </tbody>
    </table>,
    { withRouterContext: true, withReactQueryContext: true }
  )

describe('ConsumerPurposesTableRow - risk analysis signing state info icon', () => {
  it('renders the info icon with aria-label "list.riskAnalysisApproved" when the purpose is a DRAFT and riskAnalysisSigningState is SIGNED', () => {
    mockUseJwt()
    const { queryByLabelText } = renderRow(buildPurpose('DRAFT', 'SIGNED'))

    expect(queryByLabelText('list.riskAnalysisApproved')).toBeInTheDocument()
    expect(queryByLabelText('list.riskAnalysisRejected')).not.toBeInTheDocument()
  })

  it('renders the info icon with aria-label "list.riskAnalysisRejected" when the purpose is a DRAFT and riskAnalysisSigningState is REJECTED', () => {
    mockUseJwt()
    const { queryByLabelText } = renderRow(buildPurpose('DRAFT', 'REJECTED'))

    expect(queryByLabelText('list.riskAnalysisRejected')).toBeInTheDocument()
    expect(queryByLabelText('list.riskAnalysisApproved')).not.toBeInTheDocument()
  })

  it.each(['ASSIGNED', 'SUBMITTED', undefined] as const)(
    'does not render the info icon for a DRAFT purpose when riskAnalysisSigningState is %s',
    (signingState) => {
      mockUseJwt()
      const { queryByLabelText } = renderRow(buildPurpose('DRAFT', signingState))

      expect(queryByLabelText('list.riskAnalysisApproved')).not.toBeInTheDocument()
      expect(queryByLabelText('list.riskAnalysisRejected')).not.toBeInTheDocument()
    }
  )

  it.each(['SIGNED', 'REJECTED'] as const)(
    'does not render the info icon when the purpose is not a DRAFT, even if riskAnalysisSigningState is %s',
    (signingState) => {
      mockUseJwt()
      const { queryByLabelText } = renderRow(buildPurpose('ACTIVE', signingState))

      expect(queryByLabelText('list.riskAnalysisApproved')).not.toBeInTheDocument()
      expect(queryByLabelText('list.riskAnalysisRejected')).not.toBeInTheDocument()
    }
  )
})
