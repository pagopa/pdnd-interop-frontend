import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useMutation } from '@tanstack/react-query'
import { AxiosError, AxiosHeaders } from 'axios'
import i18n from 'i18next'
import errorEnNs from '@/static/locales/en/error.json'
import errorItNs from '@/static/locales/it/error.json'
import { queryClient } from '../query-client'
import { useDialogStore, useToastNotificationStore } from '@/stores'
import { useErrorDataStore } from '@/stores/error-data.store'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { ConfirmationDialogMeta } from '@tanstack/react-query'

const TestMutation = ({
  confirmationDialog,
  mutationFn,
}: {
  confirmationDialog: ConfirmationDialogMeta | Array<ConfirmationDialogMeta>
  mutationFn: () => Promise<void>
}) => {
  const { mutate } = useMutation({
    mutationFn,
    meta: {
      confirmationDialog,
    },
  })

  return <button onClick={() => mutate()}>submit</button>
}

const TestMutationError = ({ mutationFn }: { mutationFn: () => Promise<void> }) => {
  const { mutate } = useMutation({
    mutationFn,
    meta: {
      errorToastLabel: 'Operation-specific error',
    },
  })

  return <button onClick={() => mutate()}>submit</button>
}

beforeAll(async () => {
  await i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { error: errorEnNs },
      it: { error: errorItNs },
    },
  })
})

describe('queryClient confirmation dialogs', () => {
  beforeEach(() => {
    queryClient.clear()
    useDialogStore.setState({ dialog: null })
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

describe('queryClient mutation errors', () => {
  beforeEach(() => {
    queryClient.clear()
    useToastNotificationStore.setState({
      isShown: false,
      message: '',
      severity: 'success',
      correlationId: undefined,
    })
    useErrorDataStore.getState().clearErrorData()
  })

  it('shows the mapped toast and preserves correlation data for mapped Axios errors', async () => {
    const user = userEvent.setup()
    const mutationFn = vi.fn().mockRejectedValue(
      new AxiosError('Conflict', '409', undefined, undefined, {
        status: 409,
        statusText: 'Conflict',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: {
          correlationId: 'test-correlation-id',
          errors: [{ code: '008-0008' }],
        },
      })
    )

    renderWithApplicationContext(<TestMutationError mutationFn={mutationFn} />, {
      withReactQueryContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'submit' }))

    await waitFor(() => {
      expect(useToastNotificationStore.getState()).toMatchObject({
        isShown: true,
        message: 'eService not found',
        severity: 'error',
        correlationId: 'test-correlation-id',
      })
    })
    expect(useErrorDataStore.getState()).toMatchObject({
      correlationId: 'test-correlation-id',
      errorCode: '008-0008',
    })
  })

  it('falls back to the operation label for unmapped Axios errors', async () => {
    const user = userEvent.setup()
    const mutationFn = vi.fn().mockRejectedValue(
      new AxiosError('Conflict', '409', undefined, undefined, {
        status: 409,
        statusText: 'Conflict',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: {
          correlationId: 'test-correlation-id',
          errors: [{ code: '008-9999' }],
        },
      })
    )

    renderWithApplicationContext(<TestMutationError mutationFn={mutationFn} />, {
      withReactQueryContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'submit' }))

    await waitFor(() => {
      expect(useToastNotificationStore.getState()).toMatchObject({
        isShown: true,
        message: 'Operation-specific error',
        severity: 'error',
        correlationId: 'test-correlation-id',
      })
    })
  })
})
