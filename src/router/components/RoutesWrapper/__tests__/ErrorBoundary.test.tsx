import React from 'react'
import { renderWithApplicationContext } from '@/__mocks__/mock.utils'
import { ErrorBoundary } from '@/router/components/RoutesWrapper/ErrorBoundary'

describe('determine whether ErrorBoundary renders without errors', () => {
  it('renders correctly', async () => {
    renderWithApplicationContext(<ErrorBoundary>test</ErrorBoundary>, { withRouterContext: true })
  })
})
