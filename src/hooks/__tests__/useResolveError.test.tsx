import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { NotAuthorizedError, NotFoundError, TokenExchangeError } from '@/utils/errors.utils'
import { createMemoryHistory } from '@remix-run/router'
import { QueryClientProvider } from '@tanstack/react-query'
import { render, waitFor } from '@testing-library/react'
import React from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { Route, Router, Routes } from 'react-router-dom'
import useResolveError from '../useResolveError'
import { AxiosError } from 'axios'
import { queryClient } from '@/config/query-client'

const TestErrorComponent: React.FC<FallbackProps> = (props) => {
  const { title, description, content } = useResolveError(props)

  return (
    <div>
      <div>{title}</div>
      <div>{description}</div>
      <div>{content}</div>
    </div>
  )
}
const history = createMemoryHistory()
beforeEach(() => {
  history.push('/')
})

const PathTestComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary FallbackComponent={TestErrorComponent}>{children}</ErrorBoundary>
)

const ErrorBoundaryTest: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router location={history.location} navigator={history}>
        <Routes>
          <Route path="/" element={<PathTestComponent>{children}</PathTestComponent>} />
          <Route path="/it/404" element={<>Not Found</>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

const ThrowErrorComponent: React.FC<{ error: Error }> = ({ error }) => {
  throw error
  return null
}

describe('', () => {
  it('should correctly resolve the generic Error throw', () => {
    const screen = render(<ThrowErrorComponent error={new Error('test')} />, {
      wrapper: ErrorBoundaryTest,
    })

    expect(screen.getByText('default.title')).toBeInTheDocument()
    expect(screen.getByText('default.description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.reloadPage' })).toBeInTheDocument()
  })

  it('should redirect in the not found page if the NotFoundError is thrown ', async () => {
    const screen = render(<ThrowErrorComponent error={new NotFoundError()} />, {
      wrapper: ErrorBoundaryTest,
    })

    screen.rerender(<ThrowErrorComponent error={new NotFoundError()} />)

    await waitFor(() => {
      expect(screen.getByText('Not Found')).toBeDefined()
    })
  })

  it('should correctly resolve the NotAuthorizedError throw', () => {
    const screen = render(<ThrowErrorComponent error={new NotAuthorizedError()} />, {
      wrapper: ErrorBoundaryTest,
    })

    expect(screen.getByText('notAuthorized.title')).toBeInTheDocument()
    expect(screen.getByText('notAuthorized.description')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.backToHome' })).toBeInTheDocument()
  })

  it('should correctly resolve the AxiosError throw', () => {
    const screen = render(<ThrowErrorComponent error={new AxiosError()} />, {
      wrapper: ErrorBoundaryTest,
    })

    expect(screen.getByText('axiosError.title')).toBeInTheDocument()
    expect(screen.getByText('axiosError.description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.retry' })).toBeInTheDocument()
  })

  it('should correctly resolve the TokenExchangeError throw', () => {
    const screen = render(<ThrowErrorComponent error={new TokenExchangeError()} />, {
      wrapper: ErrorBoundaryTest,
    })

    expect(screen.getByText('tokenExchange.title')).toBeInTheDocument()
    expect(screen.getByText('tokenExchange.description')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.backToSelfcare' })).toBeInTheDocument()
  })
})
