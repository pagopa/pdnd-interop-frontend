import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../query-client'
import { useDialogStore } from '@/stores'
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
