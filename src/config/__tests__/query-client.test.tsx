import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../query-client'
import { useDialogStore } from '@/stores'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { ConfirmationDialogMeta, MutationMeta } from '@tanstack/react-query'
import type * as CommonUtils from '@/utils/common.utils'
import { AxiosError, AxiosHeaders } from 'axios'
import { useErrorDataStore } from '@/stores/error-data.store'

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

describe('queryClient error toast details', () => {
  it.each([true, false, undefined])(
    'preserves diagnostic data and respects skipErrorToastDetails=%s',
    async (skipErrorToastDetails) => {
      const user = userEvent.setup()
      const error = new AxiosError('Request failed', undefined, undefined, undefined, {
        status: 500,
        statusText: 'Request failed',
        data: { correlationId: 'correlation-id', errors: [{ code: 'error-code' }] },
        headers: {},
        config: { headers: new AxiosHeaders() },
      })

      renderWithApplicationContext(
        <TestMutation
          mutationFn={vi.fn().mockRejectedValueOnce(error)}
          meta={{ errorToastLabel: 'mutation.error', skipErrorToastDetails }}
        />,
        { withReactQueryContext: true }
      )

      await user.click(screen.getByRole('button', { name: 'submit' }))

      expect(await screen.findByText('mutation.error')).toBeInTheDocument()
      const alert = within(screen.getByRole('alert'))
      if (skipErrorToastDetails) {
        expect(alert.queryByText('axiosError.correlationIdText')).not.toBeInTheDocument()
        expect(alert.queryByRole('textbox')).not.toBeInTheDocument()
        expect(alert.queryByRole('button')).not.toBeInTheDocument()
      } else {
        expect(alert.getByText('axiosError.correlationIdText')).toBeInTheDocument()
        expect(alert.getByRole('textbox')).toHaveValue('correlation-id')
        expect(alert.getByRole('button')).toBeInTheDocument()
      }
      expect(useErrorDataStore.getState()).toMatchObject({
        correlationId: 'correlation-id',
        errorCode: 'error-code',
      })
    }
  )
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
