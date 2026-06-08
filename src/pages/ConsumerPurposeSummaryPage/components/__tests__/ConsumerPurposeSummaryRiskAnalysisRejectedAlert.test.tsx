import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ConsumerPurposeSummaryRiskAnalysisRejectedAlert } from '../ConsumerPurposeSummaryRiskAnalysisRejectedAlert'

const REASON = 'The provided data retention period is not compliant.'

// The i18n test mock returns bare keys, so the drawer title/intro assert as 'title'/'intro'.
describe('ConsumerPurposeSummaryRiskAnalysisRejectedAlert', () => {
  it('renders the error alert with the "read reason" action and the drawer closed', () => {
    render(<ConsumerPurposeSummaryRiskAnalysisRejectedAlert rejectionReason={REASON} />)

    expect(screen.getByText('label')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'action' })).toBeInTheDocument()
    // Drawer closed → its content is not mounted.
    expect(screen.queryByText(REASON)).not.toBeInTheDocument()
  })

  it('opens the rejection drawer with title, intro and the rejection reason on click', () => {
    render(<ConsumerPurposeSummaryRiskAnalysisRejectedAlert rejectionReason={REASON} />)

    fireEvent.click(screen.getByRole('button', { name: 'action' }))

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('intro')).toBeInTheDocument()
    expect(screen.getByText(REASON)).toBeInTheDocument()
  })

  it('closes the drawer via the standard close button', async () => {
    render(<ConsumerPurposeSummaryRiskAnalysisRejectedAlert rejectionReason={REASON} />)

    fireEvent.click(screen.getByRole('button', { name: 'action' }))
    expect(screen.getByText(REASON)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'closeIconAriaLabel' }))

    await waitFor(() => expect(screen.queryByText(REASON)).not.toBeInTheDocument())
  })
})
