import React from 'react'
import { vi, SpyInstance } from 'vitest'
import { renderWithApplicationContext } from '@/__mocks__/mock.utils'
import { AuthGuard } from '@/router/components/RoutesWrapper/AuthGuard'
import * as useCurrentRoute from '@/router/hooks/useCurrentRoute'
import * as useJwt from '@/hooks/useJwt'
import { mockUseJwt } from '@/__mocks__/hooks/user.mocks'
import { mockUseCurrentRoute } from '@/__mocks__/hooks/route.mocks'
import { NotAuthorizedError } from '@/utils/errors.utils'

describe('determine whether business logic to check for user authorizazion works', () => {
  let spyUseCurrentRoute: SpyInstance
  let spyUseJwt: SpyInstance
  beforeEach(() => {
    spyUseCurrentRoute = vi.spyOn(useCurrentRoute, 'default')
    spyUseJwt = vi.spyOn(useJwt, 'useJwt')
  })

  it('should not throw if user is authorized', () => {
    spyUseCurrentRoute.mockImplementation(() => mockUseCurrentRoute())
    spyUseJwt.mockImplementation(() => mockUseJwt())
    const authGuard = renderWithApplicationContext(<AuthGuard>test</AuthGuard>, {
      withRouterContext: true,
    })

    expect(authGuard.container).toHaveTextContent('test')
  })

  it('should not throw if jwt is not in session yet', () => {
    spyUseCurrentRoute.mockImplementation(() => mockUseCurrentRoute())
    spyUseJwt.mockImplementation(() => mockUseJwt({ jwt: undefined }))
    const authGuard = renderWithApplicationContext(<AuthGuard>test</AuthGuard>, {
      withRouterContext: true,
    })

    expect(authGuard.container).toHaveTextContent('test')
  })

  it('should throw if user is not authorized', () => {
    spyUseCurrentRoute.mockImplementation(() => mockUseCurrentRoute({ isUserAuthorized: false }))
    spyUseJwt.mockImplementation(() => mockUseJwt())
    let error = undefined
    try {
      renderWithApplicationContext(<AuthGuard>test</AuthGuard>, {
        withRouterContext: true,
      })
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
    expect(error).toEqual(new NotAuthorizedError())
  })
})
