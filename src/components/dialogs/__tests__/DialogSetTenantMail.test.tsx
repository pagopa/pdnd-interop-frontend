import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DialogSetTenantMail } from '../DialogSetTenantMail'

const { closeDialogMock, updateMailMock, auth } = vi.hoisted(() => ({
  closeDialogMock: vi.fn(),
  updateMailMock: vi.fn(),
  auth: { jwt: { organizationId: 'organization-id' } as { organizationId?: string } | undefined },
}))

vi.mock('@/stores', () => ({
  useDialog: () => ({ closeDialog: closeDialogMock }),
}))

vi.mock('@/api/auth', () => ({
  AuthHooks: {
    useJwt: () => auth,
  },
}))

vi.mock('@/api/tenant', () => ({
  TenantMutations: {
    useUpdateMail: () => ({ mutateAsync: updateMailMock }),
  },
}))

describe('DialogSetTenantMail', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    auth.jwt = { organizationId: 'organization-id' }
  })

  it('validates required email, email format, and optional description length', async () => {
    const user = userEvent.setup()
    render(<DialogSetTenantMail type="setTenantMail" />)
    const submit = screen.getByRole('button', { name: 'actions.confirm' })
    await user.click(submit)
    expect(await screen.findByText('validation.mixed.required')).toBeInTheDocument()
    const email = screen.getByRole('textbox', { name: /mailField.label/ })
    await user.type(email, 'invalid')
    await user.click(submit)
    expect(await screen.findByText('validation.string.email')).toBeInTheDocument()
    await user.clear(email)
    await user.type(email, 'contact@example.com')
    await user.type(screen.getByRole('textbox', { name: /descriptionField.label/ }), 'short')
    await user.click(submit)
    expect(await screen.findByText('validation.string.minLength')).toBeInTheDocument()
    expect(updateMailMock).not.toHaveBeenCalled()
    expect(closeDialogMock).not.toHaveBeenCalled()
  })

  it.each([undefined, {}])('does not submit without an organization (%j)', async (jwt) => {
    auth.jwt = jwt
    await submitEmail()
    expect(updateMailMock).not.toHaveBeenCalled()
    expect(closeDialogMock).not.toHaveBeenCalled()
    expect(screen.getByRole('textbox', { name: /mailField.label/ })).toHaveValue(
      'contact@example.com'
    )
  })

  it('retains both fields while pending and after failure, then retries and closes on success', async () => {
    let reject!: (reason: Error) => void
    updateMailMock
      .mockReturnValueOnce(
        new Promise<void>((_resolve, rejectPromise) => {
          reject = rejectPromise
        })
      )
      .mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<DialogSetTenantMail type="setTenantMail" />)
    const email = screen.getByRole('textbox', { name: /mailField.label/ })
    const description = screen.getByRole('textbox', { name: /descriptionField.label/ })
    await user.type(email, 'contact@example.com')
    await user.type(description, 'Administrative contact')
    await user.click(screen.getByRole('button', { name: 'actions.confirm' }))
    await waitFor(() => expect(updateMailMock).toHaveBeenCalledOnce())
    expect(closeDialogMock).not.toHaveBeenCalled()
    expect(email).toHaveValue('contact@example.com')
    expect(description).toHaveValue('Administrative contact')
    await act(async () => reject(new Error('backend failure')))
    expect(closeDialogMock).not.toHaveBeenCalled()
    expect(description).toHaveValue('Administrative contact')
    await user.click(screen.getByRole('button', { name: 'actions.confirm' }))
    await waitFor(() => expect(closeDialogMock).toHaveBeenCalledOnce())
    expect(updateMailMock).toHaveBeenLastCalledWith({
      partyId: 'organization-id',
      address: 'contact@example.com',
      kind: 'CONTACT_EMAIL',
      description: 'Administrative contact',
    })
  })

  it('cancels without updating mail', async () => {
    const user = userEvent.setup()
    render(<DialogSetTenantMail type="setTenantMail" />)
    await user.click(screen.getByRole('button', { name: 'actions.cancel' }))
    expect(closeDialogMock).toHaveBeenCalledOnce()
    expect(updateMailMock).not.toHaveBeenCalled()
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
    expect(updateMailMock).toHaveBeenCalledWith({
      partyId: 'organization-id',
      address: 'contact@example.com',
      kind: 'CONTACT_EMAIL',
      description: undefined,
    })
  })
})
