import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DelegationServices } from '@/api/delegation'
import { Dialog } from '../Dialog'
import { SupportActionGuardProvider } from '@/hooks/useIsActionDisabledBySupport'
import { useDialogStore } from '@/stores'
import type { DialogRejectDelegationProps } from '@/types/dialog.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const reason = 'This delegation requires further review.'
const payload = { delegationId: 'delegation-to-reject', rejectionReason: reason }
const response = {} as Awaited<ReturnType<typeof DelegationServices.rejectProducerDelegation>>
const rejectProducer = vi.spyOn(DelegationServices, 'rejectProducerDelegation')
const rejectConsumer = vi.spyOn(DelegationServices, 'rejectConsumerDelegation')

function renderDialog(
  delegationKind: DialogRejectDelegationProps['delegationKind'],
  isSupport = false
) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  useDialogStore.getState().openDialog({
    type: 'rejectDelegation',
    delegationId: payload.delegationId,
    delegationKind,
  })
  renderWithApplicationContext(
    <QueryClientProvider client={client}>
      <SupportActionGuardProvider isSupport={isSupport}>
        <Dialog />
      </SupportActionGuardProvider>
    </QueryClientProvider>,
    {}
  )
  return client
}

describe.each([
  { kind: 'DELEGATED_PRODUCER' as const, mutation: rejectProducer, other: rejectConsumer },
  { kind: 'DELEGATED_CONSUMER' as const, mutation: rejectConsumer, other: rejectProducer },
])('DialogRejectDelegation $kind', ({ kind, mutation, other }) => {
  beforeEach(() => {
    rejectProducer.mockReset().mockResolvedValue(response)
    rejectConsumer.mockReset().mockResolvedValue(response)
  })

  it('renders the form, disables an empty reason and accepts exactly ten characters', async () => {
    const user = userEvent.setup()
    renderDialog(kind)
    expect(screen.getByRole('dialog', { name: 'title' })).toBeVisible()
    expect(screen.getByText('content.reason.infoLabel')).toBeVisible()
    const input = screen.getByRole('textbox', { name: 'content.reason.label' })
    const confirm = screen.getByRole('button', { name: 'actions.reject' })
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('maxlength', '250')
    expect(confirm).toBeDisabled()
    fireEvent.click(confirm)
    expect(mutation).not.toHaveBeenCalled()

    await user.type(input, 'x'.repeat(9))
    expect(confirm).toBeEnabled()
    await user.click(confirm)
    expect(await screen.findByText('validation.string.minLength')).toBeVisible()
    expect(mutation).not.toHaveBeenCalled()
    await user.clear(input)
    expect(confirm).toBeDisabled()

    await user.type(input, 'x'.repeat(10))
    await user.click(confirm)
    await waitFor(() =>
      expect(mutation).toHaveBeenCalledExactlyOnceWith({
        ...payload,
        rejectionReason: 'x'.repeat(10),
      })
    )
    expect(other).not.toHaveBeenCalled()
  })

  it('calls only the correct mutation and closes only once the pending request succeeds', async () => {
    let resolve!: (value: typeof response) => void
    mutation.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done
      })
    )
    const user = userEvent.setup()
    renderDialog(kind)
    await user.type(screen.getByRole('textbox'), reason)
    await user.click(screen.getByRole('button', { name: 'actions.reject' }))
    await waitFor(() => expect(mutation).toHaveBeenCalledExactlyOnceWith(payload))
    expect(other).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(screen.getByRole('textbox')).toHaveValue(reason)
    expect(useDialogStore.getState().dialog?.type).toBe('rejectDelegation')

    await act(async () => resolve(response))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(useDialogStore.getState().dialog).toBeNull()
  })

  it('preserves the reason after a failed request and retries the same payload successfully', async () => {
    let reject!: (error: Error) => void
    mutation.mockReturnValueOnce(
      new Promise((_resolve, fail) => {
        reject = fail
      })
    )
    const user = userEvent.setup()
    const client = renderDialog(kind)
    await user.type(screen.getByRole('textbox'), reason)
    await user.click(screen.getByRole('button', { name: 'actions.reject' }))
    await waitFor(() => expect(mutation).toHaveBeenCalledOnce())
    await act(async () => reject(new Error('Rejection failed')))
    await waitFor(() => expect(client.getMutationCache().getAll()[0].state.status).toBe('error'))
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(screen.getByRole('textbox')).toHaveValue(reason)
    expect(useDialogStore.getState().dialog?.type).toBe('rejectDelegation')

    await user.click(screen.getByRole('button', { name: 'actions.reject' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(mutation).toHaveBeenCalledTimes(2)
    expect(mutation).toHaveBeenNthCalledWith(1, payload)
    expect(mutation).toHaveBeenNthCalledWith(2, payload)
    expect(other).not.toHaveBeenCalled()
  })

  it('cancels a filled form without calling either mutation', async () => {
    const user = userEvent.setup()
    renderDialog(kind)
    await user.type(screen.getByRole('textbox'), reason)
    await user.click(screen.getByRole('button', { name: 'cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(useDialogStore.getState().dialog).toBeNull()
    expect(mutation).not.toHaveBeenCalled()
    expect(other).not.toHaveBeenCalled()
  })

  it('blocks support users even with a valid reason but allows cancellation', async () => {
    const user = userEvent.setup()
    renderDialog(kind, true)
    await user.type(screen.getByRole('textbox'), reason)
    const confirm = screen.getByRole('button', { name: 'actions.reject' })
    expect(confirm).toBeDisabled()
    fireEvent.click(confirm)
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(mutation).not.toHaveBeenCalled()
    expect(other).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'cancel' }))
    expect(useDialogStore.getState().dialog).toBeNull()
  })
})
