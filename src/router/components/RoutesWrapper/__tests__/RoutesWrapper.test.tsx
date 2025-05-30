import React from 'react'
import RoutesWrapper from '../RoutesWrapper'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import * as useTOSAgreement from '../../../hooks/useTOSAgreement'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'

const useTOSAgreementSpy = vi.spyOn(useTOSAgreement, 'useTOSAgreement')
useTOSAgreementSpy.mockReturnValue({
  isTOSAccepted: true,
  handleAcceptTOS: vi.fn(),
})

mockUseJwt()

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

describe('RoutesWrapper', () => {
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
