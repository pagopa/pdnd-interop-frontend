import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DialogRejectAgreement } from '../DialogRejectAgreement'

const { closeDialogMock, rejectMutationMock } = vi.hoisted(() => ({
  closeDialogMock: vi.fn(),
  rejectMutationMock: vi.fn(),
}))

vi.mock('@/stores', () => ({
  useDialog: () => ({ closeDialog: closeDialogMock }),
}))

vi.mock('@/api/agreement', () => ({
  AgreementMutations: {
    useReject: () => ({ mutate: rejectMutationMock }),
  },
}))

const reason = 'This is a sufficiently detailed rejection reason.'
const rejectionCases = [
  {
    name: 'agreement',
    renderDialog: () => <DialogRejectAgreement agreementId="agreement-id" type="rejectAgreement" />,
    mutation: rejectMutationMock,
    payload: { agreementId: 'agreement-id', reason },
  },
]

describe.each(rejectionCases)(
  '$name rejection lifecycle',
  ({ renderDialog, mutation, payload }) => {
    beforeEach(() => vi.resetAllMocks())

    it('validates required and short reasons without sending a mutation', async () => {
      const user = userEvent.setup()
      render(renderDialog())
      const submit = screen.getAllByRole('button').at(-1)!
      await user.click(submit)
      expect(await screen.findByText('validation.mixed.required')).toBeInTheDocument()
      await user.type(screen.getByRole('textbox'), 'short')
      await user.click(submit)
      expect(await screen.findByText('validation.string.minLength')).toBeInTheDocument()
      expect(mutation).not.toHaveBeenCalled()
      expect(closeDialogMock).not.toHaveBeenCalled()
    })

    it('retains the reason while the rejection is pending', async () => {
      const user = userEvent.setup()
      render(renderDialog())
      await user.type(screen.getByRole('textbox'), reason)
      await user.click(screen.getAllByRole('button').at(-1)!)
      await waitFor(() => expect(mutation).toHaveBeenCalledOnce())
      expect(mutation.mock.calls[0][0]).toEqual(payload)
      expect(closeDialogMock).not.toHaveBeenCalled()
      expect(screen.getByRole('textbox')).toHaveValue(reason)
    })

    it('cancels without submitting', async () => {
      const user = userEvent.setup()
      render(renderDialog())
      await user.click(screen.getAllByRole('button')[0])
      expect(closeDialogMock).toHaveBeenCalledOnce()
      expect(mutation).not.toHaveBeenCalled()
    })
  }
)

describe('DialogRejectAgreement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const submitValidReason = async () => {
    const user = userEvent.setup()
    render(<DialogRejectAgreement agreementId="agreement-id" type="rejectAgreement" />)

    await user.type(
      screen.getByRole('textbox', { name: /reason\.label/i }),
      'This is a sufficiently detailed rejection reason.'
    )
    await user.click(screen.getByRole('button', { name: /confirmLabel/i }))
  }

  it('keeps the dialog open when the mutation does not succeed', async () => {
    await submitValidReason()

    expect(rejectMutationMock).toHaveBeenCalledWith(
      { agreementId: 'agreement-id', reason: 'This is a sufficiently detailed rejection reason.' },
      { onSuccess: closeDialogMock }
    )
    expect(closeDialogMock).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes the dialog after mutation success', async () => {
    rejectMutationMock.mockImplementation((_payload, options) => options.onSuccess())

    await submitValidReason()

    expect(closeDialogMock).toHaveBeenCalledOnce()
  })
})
