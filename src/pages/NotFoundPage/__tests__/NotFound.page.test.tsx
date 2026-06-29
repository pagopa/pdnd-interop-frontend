import React from 'react'
import { screen } from '@testing-library/react'
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
})
