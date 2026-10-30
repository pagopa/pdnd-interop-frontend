import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useMutation } from '@tanstack/react-query'
import { CancellationError, queryClient, queryClientConfig } from '../query-client'
import { useDialogStore, useLoadingOverlayStore, useToastNotificationStore } from '@/stores'
import { useErrorDataStore } from '@/stores/error-data.store'
import { NotFoundError } from '@/utils/errors.utils'
import { AxiosError } from 'axios'
import type { AxiosResponse } from 'axios'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { ConfirmationDialogMeta, MutationMeta } from '@tanstack/react-query'
import type * as CommonUtils from '@/utils/common.utils'

const { mockedSetExponentialInterval, mockedClearExponentialInterval } = vi.hoisted(() => ({
  mockedSetExponentialInterval: vi.fn(() => 'active-queries-polling-interval-id'),
  mockedClearExponentialInterval: vi.fn(),
}))

vi.mock('@/utils/common.utils', async () => {
  const actual = await vi.importActual<typeof CommonUtils>('@/utils/common.utils')

  return {
    ...actual,
    setExponentialInterval: mockedSetExponentialInterval,
    clearExponentialInterval: mockedClearExponentialInterval,
  }
})

describe('queryClient mutation cache lifecycle', () => {
  const cache = queryClient.getMutationCache()

  beforeEach(() => {
    queryClient.clear()
    mockedSetExponentialInterval.mockClear()
    mockedClearExponentialInterval.mockClear()
  })

  afterEach(() => vi.restoreAllMocks())

  function mutation(meta?: MutationMeta) {
    return cache.build<unknown, unknown, unknown, unknown>(queryClient, {
      mutationFn: async (variables) => variables,
      meta: meta ? { ...meta } : undefined,
    })
  }

  it('caps retry delay and retries only eventual-consistency NotFound errors four times', () => {
    const retry = queryClientConfig.defaultOptions!.mutations!.retry
    const delay = queryClientConfig.defaultOptions!.mutations!.retryDelay
    const queryDelay = queryClientConfig.defaultOptions!.queries!.retryDelay
    if (
      typeof retry !== 'function' ||
      typeof delay !== 'function' ||
      typeof queryDelay !== 'function'
    ) {
      throw new Error('Expected callable retry policies')
    }
    const error = new NotFoundError()
    expect(retry(0, error)).toBe(true)
    expect(retry(3, error)).toBe(true)
    expect(retry(4, error)).toBe(false)
    expect(retry(0, new Error('other failure'))).toBe(false)
    expect(delay(0, error)).toBe(1000)
    expect(delay(5, error)).toBe(30000)
    expect(queryDelay(2, error)).toBe(4000)
  })

  it('resolves functional labels with callback arguments and pairs overlay show/hide', async () => {
    const show = vi
      .spyOn(useLoadingOverlayStore.getState(), 'showOverlay')
      .mockImplementation(() => undefined)
    const hide = vi
      .spyOn(useLoadingOverlayStore.getState(), 'hideOverlay')
      .mockImplementation(() => undefined)
    const toast = vi
      .spyOn(useToastNotificationStore.getState(), 'showToast')
      .mockImplementation(() => undefined)
    const loadingLabel = vi.fn(() => 'saving')
    const successToastLabel = vi.fn(() => 'saved')
    const errorToastLabel = vi.fn(() => 'failed')
    const current = mutation({
      loadingLabel,
      successToastLabel,
      errorToastLabel,
      skipActiveQueriesPolling: true,
    })
    const variables = { id: 'item' }
    const data = { id: 'created' }
    const context = { previous: 'old' }
    await cache.config.onMutate!(variables, current)
    expect(show).toHaveBeenCalledWith('saving')
    cache.config.onSuccess!(data, variables, context, current)
    expect(successToastLabel).toHaveBeenLastCalledWith(data, variables, context)
    expect(toast).toHaveBeenCalledWith('saved', 'success')
    const error = new Error('failure')
    cache.config.onError!(error, variables, context, current)
    expect(errorToastLabel).toHaveBeenLastCalledWith(error, variables, context)
    expect(toast).toHaveBeenCalledWith('failed', 'error', undefined)
    cache.config.onSettled!(data, error, variables, context, current)
    expect(loadingLabel).toHaveBeenCalledWith(variables)
    expect(hide).toHaveBeenCalledTimes(1)
    expect(mockedSetExponentialInterval).not.toHaveBeenCalled()
  })

  it.each([
    {
      data: { correlationId: 'correlation', errors: [{ code: 'ERR' }] },
      storesError: true,
      correlation: 'correlation',
    },
    {
      data: { correlationId: 'correlation', errors: [] },
      storesError: false,
      correlation: 'correlation',
    },
    { data: { errors: [{ code: 'ERR' }] }, storesError: false, correlation: undefined },
    { data: {}, storesError: false, correlation: undefined },
    { data: undefined, storesError: false, correlation: undefined },
  ])('handles Axios error metadata: $data', ({ data, storesError, correlation }) => {
    const toast = vi
      .spyOn(useToastNotificationStore.getState(), 'showToast')
      .mockImplementation(() => undefined)
    const setError = vi
      .spyOn(useErrorDataStore.getState(), 'setErrorData')
      .mockImplementation(() => undefined)
    const response = data === undefined ? undefined : ({ data } as AxiosResponse)
    const error = new AxiosError('request failed', undefined, undefined, undefined, response)
    cache.config.onError!(error, {}, undefined, mutation({ errorToastLabel: 'failed' }))
    expect(toast).toHaveBeenCalledWith('failed', 'error', correlation)
    if (storesError) expect(setError).toHaveBeenCalledWith('correlation', 'ERR')
    else expect(setError).not.toHaveBeenCalled()
  })

  it('does not show error feedback for cancellation or absent metadata', async () => {
    const toast = vi
      .spyOn(useToastNotificationStore.getState(), 'showToast')
      .mockImplementation(() => undefined)
    const hide = vi
      .spyOn(useLoadingOverlayStore.getState(), 'hideOverlay')
      .mockImplementation(() => undefined)
    cache.config.onError!(
      new CancellationError(),
      {},
      undefined,
      mutation({ errorToastLabel: 'failed' })
    )
    const current = mutation()
    await cache.config.onMutate!({}, current)
    cache.config.onError!(new Error('silent'), {}, undefined, current)
    cache.config.onSettled!(undefined, null, {}, undefined, current)
    expect(toast).not.toHaveBeenCalled()
    expect(hide).not.toHaveBeenCalled()
  })

  it('resolves a single functional confirmation before loading and polls only stale active queries', async () => {
    const open = vi
      .spyOn(useDialogStore.getState(), 'openDialog')
      .mockImplementation(() => undefined)
    const show = vi
      .spyOn(useLoadingOverlayStore.getState(), 'showOverlay')
      .mockImplementation(() => undefined)
    const refetch = vi.spyOn(queryClient, 'refetchQueries').mockResolvedValue(undefined)
    const current = mutation({
      confirmationDialog: {
        title: (variables) => `Confirm ${(variables as { id: string }).id}`,
        description: (variables) => `Save ${(variables as { id: string }).id}`,
        proceedLabel: 'Save',
        checkbox: 'Accepted',
      },
      loadingLabel: 'saving',
    })
    const pending = cache.config.onMutate!({ id: 'item' }, current)
    expect(open).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Confirm item',
        description: 'Save item',
        proceedLabel: 'Save',
        checkbox: 'Accepted',
      })
    )
    expect(show).not.toHaveBeenCalled()
    const dialog = open.mock.calls[0][0]
    if (dialog.type !== 'basic') throw new Error('Expected basic confirmation')
    dialog.onProceed?.()
    await pending
    expect(show).toHaveBeenCalledWith('saving')
    cache.config.onSuccess!({}, {}, undefined, current)
    const poll = mockedSetExponentialInterval.mock.calls[0] as unknown as [VoidFunction, number]
    poll[0]()
    expect(refetch).toHaveBeenCalledWith({ type: 'active', stale: true })
    expect(mockedClearExponentialInterval).toHaveBeenCalledTimes(1)
  })
})

const TestMutation = ({
  confirmationDialog,
  mutationFn,
  meta,
}: {
  confirmationDialog?: ConfirmationDialogMeta | Array<ConfirmationDialogMeta>
  mutationFn: () => Promise<void>
  meta?: MutationMeta
}) => {
  const { mutate } = useMutation({
    mutationFn,
    meta: {
      confirmationDialog,
      ...meta,
    },
  })

  return <button onClick={() => mutate()}>submit</button>
}

describe('queryClient confirmation dialogs', () => {
  beforeEach(() => {
    queryClient.clear()
    useDialogStore.setState({ dialog: null })
    mockedSetExponentialInterval.mockClear()
    mockedClearExponentialInterval.mockClear()
  })

  it('should wait for ordered confirmation dialogs before running the mutation', async () => {
    const user = userEvent.setup()
    const mutationFn = vi.fn().mockResolvedValue(undefined)

    renderWithApplicationContext(
      <TestMutation
        mutationFn={mutationFn}
        confirmationDialog={[
          {
            title: 'Delegation confirmation',
            description: 'Confirm the delegated request',
          },
          {
            title: 'Async exchange confirmation',
            description: 'Confirm the async exchange integration',
            checkbox: 'I understand that a technical integration is required',
          },
        ]}
      />,
      { withReactQueryContext: true }
    )

    await user.click(screen.getByRole('button', { name: 'submit' }))

    expect(await screen.findByRole('heading', { name: 'Delegation confirmation' })).toBeVisible()
    expect(mutationFn).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'confirm' }))

    expect(
      await screen.findByRole('heading', { name: 'Async exchange confirmation' })
    ).toBeVisible()
    const confirmButton = screen.getByRole('button', { name: 'confirm' })
    expect(confirmButton).toBeDisabled()

    await user.click(
      screen.getByRole('checkbox', {
        name: 'I understand that a technical integration is required',
      })
    )
    expect(confirmButton).toBeEnabled()

    await user.click(confirmButton)

    await waitFor(() => expect(mutationFn).toHaveBeenCalledTimes(1))
  })

  it('should not request active queries polling when the mutation opts out', async () => {
    const user = userEvent.setup()
    const mutationFn = vi.fn().mockResolvedValue(undefined)

    renderWithApplicationContext(
      <TestMutation mutationFn={mutationFn} meta={{ skipActiveQueriesPolling: true }} />,
      { withReactQueryContext: true }
    )

    await user.click(screen.getByRole('button', { name: 'submit' }))

    await waitFor(() => expect(mutationFn).toHaveBeenCalledTimes(1))
    expect(mockedSetExponentialInterval).not.toHaveBeenCalled()
  })

  it('should request active queries polling when the mutation does not opt out', async () => {
    const user = userEvent.setup()
    const mutationFn = vi.fn().mockResolvedValue(undefined)

    renderWithApplicationContext(<TestMutation mutationFn={mutationFn} />, {
      withReactQueryContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'submit' }))

    await waitFor(() => expect(mutationFn).toHaveBeenCalledTimes(1))
    expect(mockedSetExponentialInterval).toHaveBeenCalledWith(expect.any(Function), 20 * 1000)
  })

  it('should not run the mutation when a confirmation dialog is cancelled', async () => {
    const user = userEvent.setup()
    const mutationFn = vi.fn().mockResolvedValue(undefined)

    renderWithApplicationContext(
      <TestMutation
        mutationFn={mutationFn}
        confirmationDialog={[
          {
            title: 'Delegation confirmation',
          },
          {
            title: 'Async exchange confirmation',
            checkbox: 'I understand that a technical integration is required',
          },
        ]}
      />,
      { withReactQueryContext: true }
    )

    await user.click(screen.getByRole('button', { name: 'submit' }))
    await user.click(await screen.findByRole('button', { name: 'confirm' }))

    expect(
      await screen.findByRole('heading', { name: 'Async exchange confirmation' })
    ).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'cancel' }))

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: 'Async exchange confirmation' })
      ).not.toBeInTheDocument()
    })
    expect(mutationFn).not.toHaveBeenCalled()
  })
})
