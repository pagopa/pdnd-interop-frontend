import React from 'react'
import { vi } from 'vitest'
import type { SpyInstance } from 'vitest'
import { AuthGuard } from '@/router/components/RoutesWrapper/AuthGuard'
import * as useCurrentRoute from '@/router/hooks/useCurrentRoute'
import { mockUseCurrentRoute } from '__mocks__/data/route.mocks'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'

describe('determine whether business logic to check for user authorizazion works', () => {
  let spyUseCurrentRoute: SpyInstance
  beforeEach(() => {
    spyUseCurrentRoute = vi.spyOn(useCurrentRoute, 'default')
  })

  it('should not throw if user is authorized', () => {
    spyUseCurrentRoute.mockImplementation(() => mockUseCurrentRoute())
    mockUseJwt()
    const authGuard = renderWithApplicationContext(<AuthGuard>test</AuthGuard>, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(authGuard.container).toHaveTextContent('test')
  })

  it('should not throw if jwt is not in session yet', () => {
    spyUseCurrentRoute.mockImplementation(() => mockUseCurrentRoute())
    mockUseJwt({ jwt: undefined })
    const authGuard = renderWithApplicationContext(<AuthGuard>test</AuthGuard>, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(authGuard.container).toHaveTextContent('test')
  })

  it('should throw if user is not authorized', () => {
    spyUseCurrentRoute.mockImplementation(() => mockUseCurrentRoute({ isUserAuthorized: false }))
    mockUseJwt()

    expect(() =>
      renderWithApplicationContext(<AuthGuard>test</AuthGuard>, {
        withRouterContext: true,
        withReactQueryContext: true,
      })
    ).toThrowError()
  })
})
