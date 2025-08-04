import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DialogTenantKindEserviceTemplate } from '../DialogTenantKindEserviceTemplate'
import { vi } from 'vitest'

// Mock useDialog to avoid side effects
vi.mock('@/stores', () => ({
  useDialog: () => ({ closeDialog: vi.fn() }),
}))

describe('DialogTenantKindEserviceTemplate', () => {
  it('renders dialog with radio options and handles selection and confirm', async () => {
    const onConfirm = vi.fn()
    render(<DialogTenantKindEserviceTemplate type="tenantKind" onConfirm={onConfirm} />)

    // Check dialog title and description
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()

    // Check radio options
    expect(
      screen.getByLabelText(
        'riskAnalysis.riskAnalysisSection.eserviceTemplateRiskAnalysis.tenantKind.labelPA'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(
        'riskAnalysis.riskAnalysisSection.eserviceTemplateRiskAnalysis.tenantKind.labelNotPA'
      )
    ).toBeInTheDocument()

    // Select PRIVATE and confirm
    const privateRadio = screen.getByLabelText(
      'riskAnalysis.riskAnalysisSection.eserviceTemplateRiskAnalysis.tenantKind.labelNotPA'
    )
    await userEvent.click(privateRadio)
    await userEvent.click(screen.getByRole('button', { name: 'select' }))
    expect(onConfirm).toHaveBeenCalledWith('PRIVATE')
  })

  it('calls closeDialog on cancel', async () => {
    const onConfirm = vi.fn()
    render(<DialogTenantKindEserviceTemplate type="tenantKind" onConfirm={onConfirm} />)
    const cancelButton = screen.getByRole('button', { name: 'cancel' })
    await userEvent.click(cancelButton)
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
