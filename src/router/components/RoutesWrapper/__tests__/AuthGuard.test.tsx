import React from 'react'
import { AuthGuard } from '@/router/components/RoutesWrapper/AuthGuard'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'

describe('determine whether business logic to check for user authorizazion works', () => {
  it('should not throw if user is authorized', () => {
    mockUseCurrentRoute({ isUserAuthorized: true })
    mockUseJwt()
    const authGuard = renderWithApplicationContext(<AuthGuard>test</AuthGuard>, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(authGuard.container).toHaveTextContent('test')
  })

  it('should not throw if jwt is not in session yet', () => {
    mockUseCurrentRoute({ isUserAuthorized: true })
    mockUseJwt({ jwt: undefined })
    const authGuard = renderWithApplicationContext(<AuthGuard>test</AuthGuard>, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(authGuard.container).toHaveTextContent('test')
  })

  it('should throw if user is not authorized', () => {
    mockUseCurrentRoute({ isUserAuthorized: false })
    mockUseJwt()

    expect(() =>
      renderWithApplicationContext(<AuthGuard>test</AuthGuard>, {
        withRouterContext: true,
        withReactQueryContext: true,
      })
    ).toThrowError()
  })
})
