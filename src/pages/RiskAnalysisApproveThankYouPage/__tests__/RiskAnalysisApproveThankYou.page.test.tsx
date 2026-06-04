import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RiskAnalysisApproveThankYouPage from '../RiskAnalysisApproveThankYou.page'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'

const navigateMock = vi.fn()

vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)

describe('RiskAnalysisApproveThankYouPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render title, description and action button', () => {
    renderWithApplicationContext(<RiskAnalysisApproveThankYouPage />, {
      withRouterContext: true,
    })

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'action',
      })
    ).toBeInTheDocument()
  })

  it('should navigate to risk analysis list when action button is clicked', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(<RiskAnalysisApproveThankYouPage />, {
      withRouterContext: true,
    })

    await user.click(
      screen.getByRole('button', {
        name: 'action',
      })
    )

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_LIST')
  })
})
