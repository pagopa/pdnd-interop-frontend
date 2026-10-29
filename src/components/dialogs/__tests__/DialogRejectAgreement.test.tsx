import { render, screen } from '@testing-library/react'
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
