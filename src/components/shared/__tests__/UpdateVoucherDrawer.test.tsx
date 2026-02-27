import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { UpdateVoucherDrawer } from '../UpdateVoucherDrawer'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const renderComponent = (props: Partial<React.ComponentProps<typeof UpdateVoucherDrawer>> = {}) => {
  const defaultProps: React.ComponentProps<typeof UpdateVoucherDrawer> = {
    isOpen: true,
    onClose: vi.fn(),
    id: 'eservice-1',
    subtitle: 'subtitle',
    voucherLifespan: 600,
    onSubmit: vi.fn(),
    ...props,
  }

  return renderWithApplicationContext(<UpdateVoucherDrawer {...defaultProps} />, {
    withReactQueryContext: true,
  })
}

describe('UpdateVoucherDrawer', () => {
  it('should not render when isOpen is false', () => {
    renderComponent({ isOpen: false })
    expect(screen.queryByText('title')).not.toBeInTheDocument()
  })

  it('should render title and subtitle when open', () => {
    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('subtitle')).toBeInTheDocument()
  })

  it('should show converted voucher lifespan in minutes', () => {
    renderComponent({ voucherLifespan: 600 })
    const input = screen.getByRole('spinbutton', { name: 'voucherLifespanField.label' })
    expect(input).toHaveValue(10)
  })

  it('should call onSubmit with value converted to seconds', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderComponent({ onSubmit })

    const input = screen.getByRole('spinbutton', { name: 'voucherLifespanField.label' })
    await user.clear(input)
    await user.type(input, '5')

    const saveButton = screen.getByText('actions.saveEdits')
    await user.click(saveButton)

    expect(onSubmit).toHaveBeenCalledWith('eservice-1', 300)
  })

  it('should have singular minute label', async () => {
    renderComponent({ voucherLifespan: 60 })
    expect(screen.getByText('summary')).toBeInTheDocument()
  })

  it('should have plural minute label', async () => {
    renderComponent({ voucherLifespan: 120 })
    expect(screen.getByText('summary_plural')).toBeInTheDocument()
  })

  it('should pass versionId when provided', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderComponent({ onSubmit, versionId: 'version-1' })

    const saveButton = screen.getByText('actions.saveEdits')
    await user.click(saveButton)

    expect(onSubmit).toHaveBeenCalledWith('eservice-1', 600, 'version-1')
  })

  it('should disable the input when isEserviceFromTemplate is true', () => {
    renderComponent({ isEserviceFromTemplate: true })
    const input = screen.getByRole('spinbutton', { name: 'voucherLifespanField.label' })
    expect(input).toBeDisabled()
  })

  it('should show validation error if value exceeds max (1440)', async () => {
    const user = userEvent.setup()

    renderComponent()

    const input = screen.getByRole('spinbutton', { name: 'voucherLifespanField.label' })
    await user.clear(input)
    await user.type(input, '1500')

    const saveButton = screen.getByText('actions.saveEdits')
    await user.click(saveButton)

    expect(screen.getByText('voucherLifespanField.error')).toBeInTheDocument()
  })
})
