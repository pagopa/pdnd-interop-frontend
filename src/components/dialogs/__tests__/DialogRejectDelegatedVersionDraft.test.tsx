import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EServiceServices } from '@/api/eservice'
import { Dialog } from '../Dialog'
import { SupportActionGuardProvider } from '@/hooks/useIsActionDisabledBySupport'
import { useDialogStore } from '@/stores'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const reason = 'This draft needs further review before publication.'
const props = {
  type: 'rejectDelegatedVersionDraft' as const,
  eserviceId: 'eservice-to-reject',
  descriptorId: 'descriptor-to-reject',
}
const payload = {
  eserviceId: props.eserviceId,
  descriptorId: props.descriptorId,
  rejectionReason: reason,
}
const response = { id: props.descriptorId }
const rejectDraft = vi.spyOn(EServiceServices, 'rejectDelegatedVersionDraft')

function renderDialog(isSupport = false) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  useDialogStore.getState().openDialog(props)
  return {
    client,
    ...renderWithApplicationContext(
      <QueryClientProvider client={client}>
        <SupportActionGuardProvider isSupport={isSupport}>
          <Dialog />
        </SupportActionGuardProvider>
      </QueryClientProvider>,
      { withRouterContext: true }
    ),
  }
}

describe('DialogRejectDelegatedVersionDraft', () => {
  beforeEach(() => {
    rejectDraft.mockReset().mockResolvedValue(response)
  })

  it('renders the draft rejection copy and enforces required and minimum-length reasons', async () => {
    const user = userEvent.setup()
    renderDialog()

    expect(screen.getByRole('dialog', { name: 'title' })).toBeVisible()
    expect(screen.getByText('description')).toBeVisible()
    expect(screen.getByText('content.reason.infoLabel')).toBeVisible()
    const input = screen.getByRole('textbox', { name: 'content.reason.label' })
    expect(input).toHaveAttribute('maxlength', '1000')
    expect(input).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'reject' }))
    expect(await screen.findByText('validation.mixed.required')).toBeVisible()
    await user.type(input, 'x'.repeat(19))
    await user.click(screen.getByRole('button', { name: 'reject' }))
    expect(await screen.findByText('validation.string.minLength')).toBeVisible()
    expect(rejectDraft).not.toHaveBeenCalled()
    expect(useDialogStore.getState().dialog).toEqual(props)

    await user.type(input, 'x')
    await user.click(screen.getByRole('button', { name: 'reject' }))
    await waitFor(() =>
      expect(rejectDraft).toHaveBeenCalledExactlyOnceWith({
        ...payload,
        rejectionReason: 'x'.repeat(20),
      })
    )
  })

  it('sends the exact payload, stays open while pending, and closes and navigates only on success', async () => {
    let resolve!: (value: typeof response) => void
    rejectDraft.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done
      })
    )
    const user = userEvent.setup()
    const { history } = renderDialog()
    await user.type(screen.getByRole('textbox'), reason)
    await user.click(screen.getByRole('button', { name: 'reject' }))

    await waitFor(() => expect(rejectDraft).toHaveBeenCalledExactlyOnceWith(payload))
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(screen.getByRole('textbox')).toHaveValue(reason)
    expect(useDialogStore.getState().dialog).toEqual(props)
    expect(history.location.pathname).toBe('/')

    await act(async () => resolve(response))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(useDialogStore.getState().dialog).toBeNull()
    expect(history.location.pathname).toBe('/it/erogazione/e-service')
  })

  it('retains the dialog, reason and route after failure and allows a successful retry', async () => {
    let reject!: (error: Error) => void
    rejectDraft.mockReturnValueOnce(
      new Promise((_resolve, fail) => {
        reject = fail
      })
    )
    const user = userEvent.setup()
    const { client, history } = renderDialog()
    await user.type(screen.getByRole('textbox'), reason)
    await user.click(screen.getByRole('button', { name: 'reject' }))
    await waitFor(() => expect(rejectDraft).toHaveBeenCalledOnce())

    await act(async () => reject(new Error('Rejection failed')))
    await waitFor(() => expect(client.getMutationCache().getAll()[0].state.status).toBe('error'))
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(screen.getByRole('textbox')).toHaveValue(reason)
    expect(useDialogStore.getState().dialog).toEqual(props)
    expect(history.location.pathname).toBe('/')

    await user.click(screen.getByRole('button', { name: 'reject' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(rejectDraft).toHaveBeenCalledTimes(2)
    expect(rejectDraft).toHaveBeenNthCalledWith(1, payload)
    expect(rejectDraft).toHaveBeenNthCalledWith(2, payload)
    expect(history.location.pathname).toBe('/it/erogazione/e-service')
  })

  it('cancels a filled form without mutation or navigation', async () => {
    const user = userEvent.setup()
    const { history } = renderDialog()
    await user.type(screen.getByRole('textbox'), reason)
    await user.click(screen.getByRole('button', { name: 'cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(useDialogStore.getState().dialog).toBeNull()
    expect(rejectDraft).not.toHaveBeenCalled()
    expect(history.location.pathname).toBe('/')
  })

  it('blocks rejection for support users with a valid reason but permits cancellation', async () => {
    const user = userEvent.setup()
    const { history } = renderDialog(true)
    await user.type(screen.getByRole('textbox'), reason)
    const confirm = screen.getByRole('button', { name: 'reject' })
    expect(confirm).toBeDisabled()
    fireEvent.click(confirm)
    expect(rejectDraft).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'cancel' }))
    expect(useDialogStore.getState().dialog).toBeNull()
    expect(history.location.pathname).toBe('/')
  })
})
