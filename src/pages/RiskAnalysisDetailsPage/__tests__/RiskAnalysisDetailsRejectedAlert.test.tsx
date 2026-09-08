import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RiskAnalysisDetailsRejectedAlert } from '../components/RiskAnalysisDetailsRejectedAlert'
import { renderWithApplicationContext } from '@/utils/testing.utils'

function renderAlert(rejectionReason: string) {
  return renderWithApplicationContext(
    <RiskAnalysisDetailsRejectedAlert rejectionReason={rejectionReason} />,
    { withRouterContext: true, withReactQueryContext: true }
  )
}

describe('RiskAnalysisDetailsRejectedAlert', () => {
  it('should render the alert without opening the drawer', () => {
    renderAlert('Motivazione del rifiuto')

    expect(screen.getByText('rejectedAlert.label')).toBeInTheDocument()
    expect(screen.queryByText('Motivazione del rifiuto')).not.toBeInTheDocument()
  })

  it('should open the drawer with the rejection reason', async () => {
    const user = userEvent.setup()

    renderAlert('Motivazione del rifiuto')

    await user.click(screen.getByRole('button', { name: 'rejectedAlert.action' }))

    expect(screen.getByText('Motivazione del rifiuto')).toBeInTheDocument()
  })

  it('should fall back to the no reason copy when the reason is empty', async () => {
    const user = userEvent.setup()

    renderAlert('')

    await user.click(screen.getByRole('button', { name: 'rejectedAlert.action' }))

    expect(screen.getByText('noReason')).toBeInTheDocument()
  })
})
