import React from 'react'
import { describe, it, expect } from 'vitest'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { ConsumerPurposesTableRow } from '../ConsumerPurposesTableRow'
import type { Purpose, RiskAnalysisSigningState } from '@/api/api.generatedTypes'

type PurposeWithRiskAnalysisSigningState = Purpose & {
  riskAnalysisSigningState?: RiskAnalysisSigningState
}

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
  it('renders the info icon with the "approved" tooltip when riskAnalysisSigningState is SIGNED', () => {
    mockUseJwt()
    const purpose = createMockPurpose({
      riskAnalysisSigningState: 'SIGNED',
    } as PurposeWithRiskAnalysisSigningState)

    const { queryByLabelText } = renderRow(purpose)

    expect(queryByLabelText('list.riskAnalysisApproved')).toBeInTheDocument()
    expect(queryByLabelText('list.riskAnalysisRejected')).not.toBeInTheDocument()
  })

  it('renders the info icon with the "rejected" tooltip when riskAnalysisSigningState is REJECTED', () => {
    mockUseJwt()
    const purpose = createMockPurpose({
      riskAnalysisSigningState: 'REJECTED',
    } as PurposeWithRiskAnalysisSigningState)

    const { queryByLabelText } = renderRow(purpose)

    expect(queryByLabelText('list.riskAnalysisRejected')).toBeInTheDocument()
    expect(queryByLabelText('list.riskAnalysisApproved')).not.toBeInTheDocument()
  })

  it.each(['ASSIGNED', 'SUBMITTED', undefined] as const)(
    'does not render any info icon when riskAnalysisSigningState is %s',
    (signingState) => {
      mockUseJwt()
      const purpose = createMockPurpose({
        riskAnalysisSigningState: signingState,
      } as PurposeWithRiskAnalysisSigningState)

      const { queryByLabelText } = renderRow(purpose)

      expect(queryByLabelText('list.riskAnalysisApproved')).not.toBeInTheDocument()
      expect(queryByLabelText('list.riskAnalysisRejected')).not.toBeInTheDocument()
    }
  )
})
