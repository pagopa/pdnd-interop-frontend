import React from 'react'
import { renderHook, screen } from '@testing-library/react'
import { useQueryWrapper } from '../useQueryWrapper'
import { QueryClientProvider } from '@tanstack/react-query'
import { mockUseJwt, queryClientMock } from '@/utils/testing.utils'
import { act } from 'react-dom/test-utils'
import { ErrorBoundary } from 'react-error-boundary'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import axiosInstance from '@/config/axios'

const server = setupServer(
  rest.get('/test-success', (_, res, ctx) => {
    return res(ctx.json('success'))
  }),
  rest.get('/test-404', (_, res, ctx) => {
    return res(ctx.status(404))
  })
)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

afterEach(() => {
  queryClientMock.clear()
})

async function promiseResolvedMock() {
  const response = await axiosInstance.get('/test-success')
  return response.data
}

async function promiseRejectedMock() {
  return await axiosInstance.get('/test-404')
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClientMock}>{children}</QueryClientProvider>
)

const wrapperWithErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClientMock}>
    <ErrorBoundary FallbackComponent={() => <>Error boundary</>}>{children}</ErrorBoundary>
  </QueryClientProvider>
)

describe('useQueryWrapper tests', () => {
  it('Should not fetch when useJwt jwt property is falsy', async () => {
    const { result, rerender } = renderHook(() => useQueryWrapper(['TEST'], promiseResolvedMock), {
      wrapper,
    })
    await act(() => {
      rerender()
    })
    expect(result.current.data).toEqual(undefined)
  })

  it('Should fetch when useJwt jwt property is truthy', async () => {
    /** Mocks useJwt returns a truthy value for jwt property */
    mockUseJwt()
    const { result, rerender } = renderHook(() => useQueryWrapper(['TEST'], promiseResolvedMock), {
      wrapper,
    })
    await act(() => {
      rerender()
    })
    expect(result.current.data).toEqual('success')
  })

  it('Should not show error boundary when 404 error occurs', async () => {
    /** Mocks useJwt returns a truthy value for jwt property */
    mockUseJwt()
    const { rerender } = renderHook(
      () => useQueryWrapper(['TEST'], promiseRejectedMock, { skipThrowOn404Error: true }),
      {
        wrapper: wrapperWithErrorBoundary,
      }
    )
    await act(() => {
      rerender()
    })

    expect(screen.queryByText('Error boundary')).not.toBeInTheDocument()
  })

  it('Should show error boundary', async () => {
    /** Mocks useJwt returns a truthy value for jwt property */
    mockUseJwt()
    const { rerender } = renderHook(() => useQueryWrapper(['TEST'], promiseRejectedMock), {
      wrapper: wrapperWithErrorBoundary,
    })
    await act(() => {
      rerender()
    })

    expect(screen.getByText('Error boundary')).toBeInTheDocument()
  })
})
