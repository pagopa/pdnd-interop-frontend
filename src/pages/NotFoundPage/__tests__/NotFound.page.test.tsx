import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NotFoundPage from '../NotFound.page'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'

describe('NotFound page', () => {
  it('should render title, description and back button', () => {
    mockUseJwt({
      isReviewer: false,
    })

    renderWithApplicationContext(<NotFoundPage />, {
      withRouterContext: true,
      withReactQueryContext: false,
    })

    expect(screen.getByText('notFound.title')).toBeInTheDocument()
    expect(screen.getByText('notFound.description')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.backToHome' })).toBeInTheDocument()
  })

  it('should navigate to PROVIDE_ESERVICE_LIST when user is not reviewer', async () => {
    mockUseJwt({
      isReviewer: false,
    })

    const { history } = renderWithApplicationContext(<NotFoundPage />, {
      withRouterContext: true,
      withReactQueryContext: false,
    })

    await userEvent.click(screen.getByRole('link', { name: 'actions.backToHome' }))

    expect(history.location.pathname).toContain('/erogazione/e-service')
  })

  it('should navigate to SUBSCRIBE_RISK_ANALYSIS_LIST when user is reviewer', async () => {
    mockUseJwt({
      isReviewer: true,
    })

    const { history } = renderWithApplicationContext(<NotFoundPage />, {
      withRouterContext: true,
      withReactQueryContext: false,
    })

    await userEvent.click(screen.getByRole('link', { name: 'actions.backToHome' }))

    expect(history.location.pathname).toContain('/analisi-del-rischio')
  })
})
