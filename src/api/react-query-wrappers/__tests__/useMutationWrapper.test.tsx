import axiosInstance from '@/config/axios'
import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { act } from 'react-dom/test-utils'
import { useMutationWrapper } from '../useMutationWrapper'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'

const server = setupServer(
  rest.post('/test-success', (_, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.post('/test-error', (_, res, ctx) => {
    return res(ctx.status(500))
  })
)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

const mockMutationServices = {
  success: async () => {
    return await axiosInstance.post('/test-success')
  },
  error: async () => {
    return await axiosInstance.post('/test-error')
  },
}

describe('useMutationWrapper tests', () => {
  it('Should show and hide the loading overlay on mutate', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useMutationWrapper(mockMutationServices.success, {
          successToastLabel: 'success',
          errorToastLabel: 'error',
          loadingLabel: 'loading',
        }),
      { withReactQueryContext: true }
    )

    act(() => {
      result.current.mutate()
    })

    screen.getByRole('progressbar', { hidden: true })

    await waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))
  })

  it('Should show and hide the loading overlay on mutateAsync', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useMutationWrapper(mockMutationServices.success, {
          successToastLabel: 'success',
          errorToastLabel: 'error',
          loadingLabel: 'loading',
        }),
      { withReactQueryContext: true }
    )

    act(() => {
      result.current.mutateAsync()
    })

    screen.getByRole('progressbar', { hidden: true })

    await waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))
  })

  it('Should not show loading overlay', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useMutationWrapper(mockMutationServices.success, {
          successToastLabel: 'success',
          errorToastLabel: 'error',
          suppressLoadingOverlay: true,
        }),
      { withReactQueryContext: true }
    )

    act(() => {
      result.current.mutate()
    })

    expect(screen.queryByRole('progressbar', { hidden: true })).not.toBeInTheDocument()
  })

  it('Should show the success label on mutation success', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useMutationWrapper(mockMutationServices.success, {
          successToastLabel: 'success',
          errorToastLabel: 'error',
          loadingLabel: 'loading',
        }),
      { withReactQueryContext: true }
    )
    act(() => {
      result.current.mutate()
    })
    expect(await screen.findByRole('alert', { name: 'success' })).toBeInTheDocument()
  })

  it('Should show the error label on mutation error', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useMutationWrapper(mockMutationServices.error, {
          successToastLabel: 'success',
          errorToastLabel: 'error',
          loadingLabel: 'loading',
        }),
      { withReactQueryContext: true }
    )
    act(() => {
      result.current.mutate()
    })
    expect(await screen.findByRole('alert', { name: 'error' })).toBeInTheDocument()
  })

  it('Should not show the error label on mutation error', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useMutationWrapper(mockMutationServices.error, {
          successToastLabel: 'success',
          suppressErrorToast: true,
          loadingLabel: 'loading',
        }),
      { withReactQueryContext: true }
    )
    await act(() => {
      result.current.mutate()
    })
    expect(screen.queryByRole('alert', { name: 'error' })).not.toBeInTheDocument()
  })

  it('Should not show the success label on mutation success', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useMutationWrapper(mockMutationServices.success, {
          suppressSuccessToast: true,
          errorToastLabel: 'error',
          loadingLabel: 'loading',
        }),
      { withReactQueryContext: true }
    )
    await act(() => {
      result.current.mutate()
    })
    expect(screen.queryByRole('alert', { name: 'success' })).not.toBeInTheDocument()
  })

  it('Should show the confirmation modal on mutate', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useMutationWrapper(mockMutationServices.success, {
          successToastLabel: 'success',
          errorToastLabel: 'error',
          loadingLabel: 'loading',
          showConfirmationDialog: true,
          dialogConfig: {
            title: 'title',
            description: 'description',
          },
        }),
      { withReactQueryContext: true }
    )
    await act(() => {
      result.current.mutate()
    })

    expect(screen.getByRole('dialog', { name: 'title' })).toBeInTheDocument()
  })

  it('Should not show the confirmation modal on mutate', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useMutationWrapper(mockMutationServices.success, {
          successToastLabel: 'success',
          errorToastLabel: 'error',
          loadingLabel: 'loading',
          showConfirmationDialog: false,
          dialogConfig: {
            title: 'title',
            description: 'description',
          },
        }),
      { withReactQueryContext: true }
    )
    await act(() => {
      result.current.mutate()
    })

    expect(screen.queryByRole('dialog', { name: 'title' })).not.toBeInTheDocument()
  })

  it('Should show the confirmation modal on mutateAsync', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useMutationWrapper(mockMutationServices.success, {
          successToastLabel: 'success',
          errorToastLabel: 'error',
          loadingLabel: 'loading',
          showConfirmationDialog: true,
          dialogConfig: {
            title: 'title',
            description: 'description',
          },
        }),
      { withReactQueryContext: true }
    )
    await act(() => {
      result.current.mutateAsync()
    })

    expect(screen.getByRole('dialog', { name: 'title' })).toBeInTheDocument()
  })

  it('Should not show the confirmation modal on mutateAsync', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useMutationWrapper(mockMutationServices.success, {
          successToastLabel: 'success',
          errorToastLabel: 'error',
          loadingLabel: 'loading',
          showConfirmationDialog: false,
          dialogConfig: {
            title: 'title',
            description: 'description',
          },
        }),
      { withReactQueryContext: true }
    )
    await act(() => {
      result.current.mutateAsync()
    })

    expect(screen.queryByRole('dialog', { name: 'title' })).not.toBeInTheDocument()
  })

  it('Should show the confirmation modal and call the mutation on confirm button press', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useMutationWrapper(mockMutationServices.success, {
          successToastLabel: 'success',
          errorToastLabel: 'error',
          loadingLabel: 'loading',
          showConfirmationDialog: true,
          dialogConfig: {
            title: 'title',
            description: 'description',
          },
        }),
      { withReactQueryContext: true }
    )
    await act(() => {
      result.current.mutate()
    })

    expect(screen.queryByRole('dialog', { name: 'title' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'confirm' }))

    expect(screen.getByRole('progressbar', { hidden: true })).toBeInTheDocument()
  })

  it('Should show the confirmation modal and not call the mutation on cancel button press', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useMutationWrapper(mockMutationServices.success, {
          successToastLabel: 'success',
          errorToastLabel: 'error',
          loadingLabel: 'loading',
          showConfirmationDialog: true,
          dialogConfig: {
            title: 'title',
            description: 'description',
          },
        }),
      { withReactQueryContext: true }
    )
    await act(() => {
      result.current.mutate()
    })

    expect(screen.getByRole('dialog', { name: 'title' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'cancel' }))

    expect(screen.queryByRole('progressbar', { hidden: true })).not.toBeInTheDocument()
  })
})
