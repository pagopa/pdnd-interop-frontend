import React from 'react'
import RoutesWrapper from '../RoutesWrapper'
import { RouterProvider, createBrowserRouter, createMemoryRouter } from 'react-router-dom'
import { router } from '@/router/routes'
import { beforeEach, vi } from 'vitest'
import * as useTOSAgreement from '../../../hooks/useTOSAgreement'
import {
  mockUseCurrentRoute,
  mockUseGetActiveUserParty,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'
import { AuthHooks } from '@/api/auth'
import { TokenExchangeError } from '@/utils/errors.utils'

const useTOSAgreementSpy = vi.spyOn(useTOSAgreement, 'useTOSAgreement')

beforeEach(() => {
  useTOSAgreementSpy.mockReturnValue({
    isTOSAccepted: true,
    handleAcceptTOS: vi.fn(),
  })
  mockUseJwt()
  mockUseGetActiveUserParty()
})

vi.mock('@/api/hooks', () => ({
  useIsOrganizationAllowedToDelegations: vi.fn(() => ({ isAllowed: true, isLoading: false })),
}))

const mockRouter = createBrowserRouter([
  {
    element: <RoutesWrapper />,
    children: [
      {
        path: '/',
        element: <></>,
      },
    ],
  },
])

const ErrorComponent = () => {
  throw new Error('Error')
  return null
}

const mockRouterWithError = createBrowserRouter([
  {
    element: <RoutesWrapper />,
    children: [
      {
        element: <ErrorComponent />,
        children: [
          {
            path: '/',
            element: <></>,
          },
        ],
      },
    ],
  },
])

const renderRoutesWrapper = () => {
  return renderWithApplicationContext(
    <ThemeProvider theme={theme}>
      <RouterProvider router={mockRouter} />
    </ThemeProvider>,
    {
      withReactQueryContext: true,
    }
  )
}

const renderRoutesWrapperWithError = () => {
  return renderWithApplicationContext(
    <ThemeProvider theme={theme}>
      <RouterProvider router={mockRouterWithError} />
    </ThemeProvider>,
    {
      withReactQueryContext: true,
    }
  )
}

const renderRouterErrorPage = () => {
  vi.spyOn(AuthHooks, 'useJwt').mockImplementation(() => {
    throw new TokenExchangeError()
  })

  const routerWithError = createMemoryRouter(router.routes, {
    initialEntries: ['/'],
  })

  return renderWithApplicationContext(
    <ThemeProvider theme={theme}>
      <RouterProvider router={routerWithError} />
    </ThemeProvider>,
    {
      withReactQueryContext: true,
    }
  )
}

describe('RoutesWrapper', () => {
  it('should configure a React Router errorElement that covers every top-level route', () => {
    expect('errorElement' in router.routes[0]).toBe(true)
    expect(router.routes).toHaveLength(1)
  })

  it('should show the application ErrorPage when React Router catches a thrown error on a top-level route', () => {
    const screen = renderRouterErrorPage()

    expect(screen.getByText('tokenExchange.title')).toBeInTheDocument()
    expect(screen.getByText('tokenExchange.description')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.backToSelfcare' })).toBeInTheDocument()
  })

  it('should show the TOSAgreement when isPublic is false and TOS are not accepted', () => {
    mockUseCurrentRoute({ isPublic: false, routeKey: 'TOS' })
    useTOSAgreementSpy.mockReturnValue({
      isTOSAccepted: false,
      handleAcceptTOS: vi.fn(),
    })
    const screen = renderRoutesWrapper()
    const confirmTOSBtn = screen.getByRole('button', { name: 'confirmBtnLabel' })
    expect(confirmTOSBtn).toBeInTheDocument()
  })

  it('should show the ErrorPage when an error is thrown', () => {
    mockUseCurrentRoute({ isPublic: true, routeKey: 'TOS' })
    useTOSAgreementSpy.mockReturnValue({
      isTOSAccepted: true,
      handleAcceptTOS: vi.fn(),
    })
    const screen = renderRoutesWrapperWithError()
    expect(screen.queryByRole('button', { name: 'confirmBtnLabel' })).not.toBeInTheDocument()
  })
})
