import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DialogSetTenantMail } from '../DialogSetTenantMail'

const { closeDialogMock, updateMailMock } = vi.hoisted(() => ({
  closeDialogMock: vi.fn(),
  updateMailMock: vi.fn(),
}))

vi.mock('@/stores', () => ({
  useDialog: () => ({ closeDialog: closeDialogMock }),
}))

vi.mock('@/api/auth', () => ({
  AuthHooks: {
    useJwt: () => ({ jwt: { organizationId: 'organization-id' } }),
  },
}))

vi.mock('@/api/tenant', () => ({
  TenantMutations: {
    useUpdateMail: () => ({ mutateAsync: updateMailMock }),
  },
}))

describe('DialogSetTenantMail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const submitEmail = async () => {
    const user = userEvent.setup()
    render(<DialogSetTenantMail type="setTenantMail" />)

    await user.type(
      screen.getByRole('textbox', { name: /mailField.label/i }),
      'contact@example.com'
    )
    await user.click(screen.getByRole('button', { name: /actions.confirm/i }))
  }

  it('keeps the dialog open when the mail mutation fails', async () => {
    updateMailMock.mockRejectedValue(new Error('request failed'))

    await submitEmail()

    await waitFor(() => expect(updateMailMock).toHaveBeenCalledOnce())
    expect(closeDialogMock).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes the dialog after the mail mutation succeeds', async () => {
    updateMailMock.mockResolvedValue(undefined)

    await submitEmail()

    await waitFor(() => expect(closeDialogMock).toHaveBeenCalledOnce())
  })
})
