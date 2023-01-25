import { Paginated } from '../api/react-query-wrappers/react-query-wrappers.types'
import cloneDeep from 'lodash/cloneDeep'
import {
  DialogContextProvider,
  LoadingOverlayContextProvider,
  ToastNotificationContextProvider,
} from '@/stores'
import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientMock } from '@/__mocks__/query-client.mock'
import { createMemoryHistory, MemoryHistory } from 'history'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { Route, Router, Routes } from 'react-router-dom'
import { render, renderHook } from '@testing-library/react'

/**
 * Wraps the data passed in the pagination data structure
 * */
export function createPaginatedMockData<T>(
  data: Array<T>,
  pagination?: Partial<Paginated<T>['pagination']>
): Paginated<T> {
  return {
    results: data,
    pagination: {
      offset: pagination?.offset ?? 0,
      limit: pagination?.offset ?? 50,
      totalCount: pagination?.offset ?? data.length,
    },
  }
}

/**
 * Create and returns a mock factory function
 */
export function createMockFactory<T>(defaultValue: T) {
  return (overwrites: Partial<T> = {}) => {
    return cloneDeep({
      ...defaultValue,
      ...overwrites,
    }) as T
  }
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
    let result = children

    if (options.withRouterContext) {
      result = (
        <Router location={options.history.location} navigator={options.history}>
          <Routes>
            <Route path="/" element={result} />
          </Routes>
        </Router>
      )
    }

    if (options.withReactQueryContext || options.withToastNotificationsContext) {
      result = <ToastNotificationContextProvider>{result}</ToastNotificationContextProvider>
    }

    if (options.withReactQueryContext || options.withLoadingOverlayContext) {
      result = <LoadingOverlayContextProvider>{result}</LoadingOverlayContextProvider>
    }

    if (options.withReactQueryContext) {
      result = <QueryClientProvider client={queryClientMock}>{result}</QueryClientProvider>
    }

    if (options.withReactQueryContext || options.withDialogContext) {
      result = <DialogContextProvider>{result}</DialogContextProvider>
    }

    if (options.withErrorBoundary) {
      result = <ErrorBoundary FallbackComponent={() => <>Error boundary</>}>{result}</ErrorBoundary>
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
