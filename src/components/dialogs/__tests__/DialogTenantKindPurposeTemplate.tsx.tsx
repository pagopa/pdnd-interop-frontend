import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { DialogTenantKindPurposeTemplate } from '../DialogTenantKindPurposeTemplate'

// Mock useDialog to avoid side effects
vi.mock('@/stores', () => ({
  useDialog: () => ({ closeDialog: vi.fn() }),
}))

describe('DialogTenantKindEserviceTemplate', () => {
  it('renders dialog with autocomplete and handles selection and confirm', async () => {
    const onConfirm = vi.fn()
    render(
      <DialogTenantKindPurposeTemplate type="tenantKindPurposeTemplate" onConfirm={onConfirm} />
    )

    // Check dialog title and description
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('content.description')).toBeInTheDocument()

    const autocompleteInput = screen.getByLabelText('content.label')

    // Focus / click into the autocomplete input
    fireEvent.mouseDown(autocompleteInput)

    // You can also simulate typing if needed
    await userEvent.type(autocompleteInput, 'P')

    // Wait for options to appear
    await waitFor(() => {
      expect(screen.getByText('content.options.labelPA')).toBeInTheDocument()

      expect(screen.getByText('content.options.labelNotPA')).toBeInTheDocument()
    })

    // Select PRIVATE and confirm
    const privateInput = screen.getByLabelText('content.options.labelNotPA')
    await userEvent.click(privateInput)
    await userEvent.click(screen.getByRole('button', { name: 'select' }))
    expect(onConfirm).toHaveBeenCalledWith('PRIVATE')
  })

  it('calls closeDialog on cancel', async () => {
    const onConfirm = vi.fn()
    render(
      <DialogTenantKindPurposeTemplate type="tenantKindPurposeTemplate" onConfirm={onConfirm} />
    )
    const cancelButton = screen.getByRole('button', { name: 'cancel' })
    await userEvent.click(cancelButton)
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
