import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { UpdateThresholdsVoucherDrawer } from '../UpdateThresholdsVoucherDrawer'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const renderComponent = (
  props: Partial<React.ComponentProps<typeof UpdateThresholdsVoucherDrawer>> = {}
) => {
  const defaultProps: React.ComponentProps<typeof UpdateThresholdsVoucherDrawer> = {
    isOpen: true,
    onClose: vi.fn(),
    id: 'eservice-1',
    subtitle: 'subtitle',
    dailyCallsPerConsumerLabel: 'dailyCallsPerConsumer.label',
    dailyCallsTotalLabel: 'dailyCallsTotal.label',
    voucherLifespan: 600,
    dailyCallsPerConsumer: 5,
    dailyCallsTotal: 10,
    onSubmit: vi.fn(),
    ...props,
  }

  return renderWithApplicationContext(<UpdateThresholdsVoucherDrawer {...defaultProps} />, {
    withReactQueryContext: true,
  })
}

describe('UpdateThresholdsVoucherDrawer', () => {
  it('should not render when isOpen is false', () => {
    renderComponent({ isOpen: false })
    expect(screen.queryByText('title')).not.toBeInTheDocument()
  })

  it('should render title and subtitle when open', () => {
    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('subtitle')).toBeInTheDocument()
  })

  it('should convert voucherLifespan from seconds to minutes', () => {
    renderComponent({ voucherLifespan: 600 })

    const input = screen.getByRole('spinbutton', {
      name: 'voucherLifespanField.label',
    })

    expect(input).toHaveValue(10)
  })

  it('should call onSubmit converting minutes to seconds', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderComponent({ onSubmit })

    const lifespanInput = screen.getByRole('spinbutton', {
      name: 'voucherLifespanField.label',
    })

    await user.clear(lifespanInput)
    await user.type(lifespanInput, '5')

    const saveButton = screen.getByText('actions.upgrade')
    await user.click(saveButton)

    expect(onSubmit).toHaveBeenCalledWith('eservice-1', 300, 5, 10)
  })

  it('should pass versionId when provided', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderComponent({ onSubmit, versionId: 'version-1' })

    const saveButton = screen.getByText('actions.upgrade')
    await user.click(saveButton)

    expect(onSubmit).toHaveBeenCalledWith('eservice-1', 600, 5, 10, 'version-1')
  })

  it('should disable voucherLifespan input when isEserviceFromTemplate is true', () => {
    renderComponent({ isEserviceFromTemplate: true })

    const input = screen.getByRole('spinbutton', {
      name: 'voucherLifespanField.label',
    })

    expect(input).toBeDisabled()
  })

  it('should validate required fields', async () => {
    const user = userEvent.setup()

    renderComponent()

    const lifespanInput = screen.getByRole('spinbutton', {
      name: 'voucherLifespanField.label',
    })

    await user.clear(lifespanInput)

    const saveButton = screen.getByText('actions.upgrade')
    await user.click(saveButton)

    expect(lifespanInput).toHaveAttribute('aria-invalid', 'true')
  })

  it('should reset form when id changes', async () => {
    const { rerender } = renderComponent({
      voucherLifespan: 600,
    })

    rerender(
      <UpdateThresholdsVoucherDrawer
        isOpen
        onClose={vi.fn()}
        id="eservice-2"
        subtitle="subtitle"
        dailyCallsPerConsumerLabel="dailyCallsPerConsumer.label"
        dailyCallsTotalLabel="dailyCallsTotal.label"
        voucherLifespan={1200}
        dailyCallsPerConsumer={5}
        dailyCallsTotal={10}
        onSubmit={vi.fn()}
      />
    )

    const input = screen.getByRole('spinbutton', {
      name: 'voucherLifespanField.label',
    })

    expect(input).toHaveValue(20)
  })
})
