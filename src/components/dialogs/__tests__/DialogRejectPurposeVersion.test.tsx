import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PurposeServices } from '@/api/purpose'
import { Dialog } from '../Dialog'
import { SupportActionGuardProvider } from '@/hooks/useIsActionDisabledBySupport'
import { useDialogStore } from '@/stores'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const reason = 'This purpose version requires further review.'
const props = {
  type: 'rejectPurposeVersion' as const,
  purposeId: 'purpose-to-reject',
  versionId: 'version-to-reject',
}
const payload = {
  purposeId: props.purposeId,
  versionId: props.versionId,
  rejectionReason: reason,
}
const response = {} as Awaited<ReturnType<typeof PurposeServices.rejectVersion>>
const rejectVersion = vi.spyOn(PurposeServices, 'rejectVersion')

function renderDialog(isChangePlanRequest: boolean, isSupport = false) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  useDialogStore.getState().openDialog({ ...props, isChangePlanRequest })
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
  { isChangePlanRequest: false, copy: 'newPurpose', otherCopy: 'changePlan' },
  { isChangePlanRequest: true, copy: 'changePlan', otherCopy: 'newPurpose' },
])('DialogRejectPurposeVersion $copy', ({ isChangePlanRequest, copy, otherCopy }) => {
  beforeEach(() => {
    rejectVersion.mockReset().mockResolvedValue(response)
  })

  it('renders the matching copy and validates required and minimum-length reasons', async () => {
    const user = userEvent.setup()
    renderDialog(isChangePlanRequest)
    expect(screen.getByRole('dialog', { name: `title.${copy}` })).toBeVisible()
    expect(screen.getByText(`subtitle.${copy}`)).toBeVisible()
    expect(screen.getByText(`content.reason.infoLabel.${copy}`)).toBeVisible()
    expect(screen.queryByText(`title.${otherCopy}`)).not.toBeInTheDocument()
    expect(screen.queryByText(`subtitle.${otherCopy}`)).not.toBeInTheDocument()
    expect(screen.queryByText(`content.reason.infoLabel.${otherCopy}`)).not.toBeInTheDocument()
    const input = screen.getByRole('textbox', { name: 'content.reason.label' })
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('maxlength', '1000')

    await user.click(screen.getByRole('button', { name: 'actions.confirmLabel' }))
    expect(await screen.findByText('validation.mixed.required')).toBeVisible()
    await user.type(input, 'x'.repeat(19))
    await user.click(screen.getByRole('button', { name: 'actions.confirmLabel' }))
    expect(await screen.findByText('validation.string.minLength')).toBeVisible()
    expect(rejectVersion).not.toHaveBeenCalled()
    expect(useDialogStore.getState().dialog).not.toBeNull()

    await user.type(input, 'x')
    await user.click(screen.getByRole('button', { name: 'actions.confirmLabel' }))
    await waitFor(() =>
      expect(rejectVersion).toHaveBeenCalledExactlyOnceWith({
        ...payload,
        rejectionReason: 'x'.repeat(20),
      })
    )
  })

  it('submits the exact identifiers and reason and closes only after the pending request succeeds', async () => {
    let resolve!: (value: typeof response) => void
    rejectVersion.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done
      })
    )
    const user = userEvent.setup()
    renderDialog(isChangePlanRequest)
    await user.type(screen.getByRole('textbox'), reason)
    await user.click(screen.getByRole('button', { name: 'actions.confirmLabel' }))

    await waitFor(() => expect(rejectVersion).toHaveBeenCalledExactlyOnceWith(payload))
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(screen.getByRole('textbox')).toHaveValue(reason)
    expect(useDialogStore.getState().dialog).toEqual({ ...props, isChangePlanRequest })

    await act(async () => resolve(response))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(useDialogStore.getState().dialog).toBeNull()
  })

  it('retains the form after failure and closes after retrying successfully', async () => {
    let reject!: (error: Error) => void
    rejectVersion.mockReturnValueOnce(
      new Promise((_resolve, fail) => {
        reject = fail
      })
    )
    const user = userEvent.setup()
    const client = renderDialog(isChangePlanRequest)
    await user.type(screen.getByRole('textbox'), reason)
    await user.click(screen.getByRole('button', { name: 'actions.confirmLabel' }))
    await waitFor(() => expect(rejectVersion).toHaveBeenCalledOnce())
    await act(async () => reject(new Error('Rejection failed')))
    await waitFor(() => expect(client.getMutationCache().getAll()[0].state.status).toBe('error'))

    expect(screen.getByRole('dialog')).toBeVisible()
    expect(screen.getByRole('textbox')).toHaveValue(reason)
    expect(useDialogStore.getState().dialog).toEqual({ ...props, isChangePlanRequest })
    await user.click(screen.getByRole('button', { name: 'actions.confirmLabel' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(rejectVersion).toHaveBeenCalledTimes(2)
    expect(rejectVersion).toHaveBeenNthCalledWith(1, payload)
    expect(rejectVersion).toHaveBeenNthCalledWith(2, payload)
  })

  it('cancels a filled form without submitting', async () => {
    const user = userEvent.setup()
    renderDialog(isChangePlanRequest)
    await user.type(screen.getByRole('textbox'), reason)
    await user.click(screen.getByRole('button', { name: 'actions.cancelLabel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(useDialogStore.getState().dialog).toBeNull()
    expect(rejectVersion).not.toHaveBeenCalled()
  })

  it('disables rejection for support users with a valid reason but keeps cancel available', async () => {
    const user = userEvent.setup()
    renderDialog(isChangePlanRequest, true)
    await user.type(screen.getByRole('textbox'), reason)
    const confirm = screen.getByRole('button', { name: 'actions.confirmLabel' })
    expect(confirm).toBeDisabled()
    fireEvent.click(confirm)
    expect(rejectVersion).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'actions.cancelLabel' }))
    expect(useDialogStore.getState().dialog).toBeNull()
  })
})
