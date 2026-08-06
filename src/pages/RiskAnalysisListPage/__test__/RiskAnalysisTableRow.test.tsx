import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { RiskAnalysisTableRow } from '../components/RiskAnalysisTableRow'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import type { Purpose, RiskAnalysisSigningState } from '@/api/api.generatedTypes'

mockUseJwt({ isAdmin: false, isReviewer: true, jwt: { uid: 'reviewer-1' } })

function renderRow(signingState: RiskAnalysisSigningState) {
  const purpose: Purpose = {
    ...createMockPurpose({ id: 'purpose-id-001' }),
    reviewerWorkflow: {
      signingState,
      signedBy: 'reviewer-1',
      reviewers: [
        {
          userId: 'reviewer-1',
          name: 'Mario',
          familyName: 'Rossi',
          sentToReviewerAt: '2026-03-10T10:00:00.000Z',
        },
      ],
    },
  }

  return renderWithApplicationContext(
    <table>
      <tbody>
        <RiskAnalysisTableRow purpose={purpose} />
      </tbody>
    </table>,
    { withRouterContext: true, withReactQueryContext: true }
  )
}

describe('RiskAnalysisTableRow', () => {
  it.each<RiskAnalysisSigningState>(['SIGNED', 'REJECTED'])(
    'should link a %s risk analysis to the purpose detail page',
    async (signingState) => {
      const { history } = renderRow(signingState)

      await userEvent.setup().click(screen.getByRole('link'))

      expect(history.location.pathname).toBe('/it/analisi-del-rischio/purpose-id-001/dettaglio')
    }
  )

  it('should link an assigned risk analysis to the compilation info page', async () => {
    const { history } = renderRow('ASSIGNED')

    await userEvent.setup().click(screen.getByRole('link'))

    expect(history.location.pathname).toBe('/it/analisi-del-rischio/purpose-id-001')
  })

  it('should link a submitted risk analysis to the approval page', async () => {
    const { history } = renderRow('SUBMITTED')

    await userEvent.setup().click(screen.getByRole('link'))

    expect(history.location.pathname).toBe('/it/analisi-del-rischio/purpose-id-001/approvazione')
  })

  it('should not render a link for a draft risk analysis', () => {
    renderRow('DRAFT')

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
