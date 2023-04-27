import React from 'react'
import cloneDeep from 'lodash/cloneDeep'
import { QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory } from 'history'
import type { MemoryHistory } from 'history'
import { Route, Router, Routes } from 'react-router-dom'
import { render, renderHook } from '@testing-library/react'
import { LoadingOverlay, ToastNotification } from '@/components/layout'
import { Dialog } from '@/components/dialogs'
import { QueryClient } from '@tanstack/react-query'
import type { QueryClientConfig } from '@tanstack/react-query'
import { queryClientConfig } from '../config/query-client'
import { deepmerge } from '@mui/utils'
import noop from 'lodash/noop'
import { vi } from 'vitest'
import * as useJwtHook from '@/hooks/useJwt'

const queryClientConfigMock: QueryClientConfig = deepmerge(
  {
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    // Disables logging
    logger: {
      log: noop,
      warn: noop,
      error: noop,
    },
  },
  queryClientConfig
)

export const queryClientMock = new QueryClient(queryClientConfigMock)

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

/**
 * Create and returns a mock factory function
 */
export function createMockFactory<T>(defaultValue: T) {
  return (overwrites: RecursivePartial<T> = {}) => {
    return deepmerge(cloneDeep(defaultValue), overwrites) as T
  }
}

/**
 * Utility function to mock the useJwt hook
 * This mock is commonly used in tests that have a query mock that requires a valid jwt
 */
export function mockUseJwt(
  overwrites: RecursivePartial<ReturnType<typeof useJwtHook.useJwt>> = {}
) {
  const returnValue = deepmerge(
    cloneDeep({
      jwt: {
        aud: 'aud',
        exp: 1972913491,
        iat: 123,
        iss: 'iss',
        jti: 'jti',
        nbf: 123,
        organization: {
          name: 'orgName',
          roles: [{ partyRole: 'MANAGER' as const, role: 'admin' as const }],
          fiscal_code: 'AAAAAA11A11A111A',
        },
        selfcareId: 'selfcareId',
        uid: 'uid',
        name: 'name',
        family_name: 'family_name',
        organizationId: 'organizationId',
      },
      hasSessionExpired: () => false,
      isAdmin: true,
      isOperatorAPI: false,
      isOperatorSecurity: false,
      currentRoles: [],
    }),
    overwrites
  )
  vi.spyOn(useJwtHook, 'useJwt').mockReturnValue(returnValue)
}

type WrapperOptions = (
  | {
      withReactQueryContext?: boolean
      withDialogContext?: boolean
      withToastNotificationsContext?: boolean
      withLoadingOverlayContext?: boolean
    }
  | {
      withReactQueryContext: true
    }
) & {
  withErrorBoundary?: boolean
  withRouterContext?: boolean
}

/**
 * Generates a component wrapper that mocks the application context
 */
function generateWrapper(options: WrapperOptions & { history: MemoryHistory }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    let result = (
      <>
        {children}
        {(options.withReactQueryContext || options.withToastNotificationsContext) && (
          <ToastNotification />
        )}
        {(options.withReactQueryContext || options.withLoadingOverlayContext) && <LoadingOverlay />}
        {(options.withReactQueryContext || options.withDialogContext) && <Dialog />}
      </>
    )

    if (options.withReactQueryContext) {
      result = <QueryClientProvider client={queryClientMock}>{result}</QueryClientProvider>
    }

    if (options.withRouterContext) {
      result = (
        <Router location={options.history.location} navigator={options.history}>
          <Routes>
            <Route path="/" element={result} />
            <Route path="/test" element={result} />
            <Route path="*" element={result} />
          </Routes>
        </Router>
      )
    }

    return <>{result}</>
  }
}

export function renderWithApplicationContext(
  ui: React.ReactElement,
  options: WrapperOptions,
  history: MemoryHistory = createMemoryHistory()
) {
  const renderResult = render(ui, { wrapper: generateWrapper({ ...options, history }) })
  return { ...renderResult, history }
}

export function renderHookWithApplicationContext<Props, Result>(
  render: (initialProps: Props) => Result,
  options: WrapperOptions,
  history: MemoryHistory = createMemoryHistory()
) {
  const renderResult = renderHook(render, { wrapper: generateWrapper({ ...options, history }) })
  return { ...renderResult, history }
}
