import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { UpdateDailyCallsDrawer } from '../UpdateDailyCallsDrawer'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const renderComponent = (
  props: Partial<React.ComponentProps<typeof UpdateDailyCallsDrawer>> = {}
) => {
  const defaultProps: React.ComponentProps<typeof UpdateDailyCallsDrawer> = {
    isOpen: true,
    onClose: vi.fn(),
    id: 'eservice-1',
    subtitle: 'subtitle',
    dailyCallsPerConsumerLabel: 'dailyCallsPerConsumer.label',
    dailyCallsTotalLabel: 'dailyCallsTotal.label',
    dailyCallsPerConsumer: 5,
    dailyCallsTotal: 10,
    onSubmit: vi.fn(),
    ...props,
  }

  return renderWithApplicationContext(<UpdateDailyCallsDrawer {...defaultProps} />, {
    withReactQueryContext: true,
  })
}

describe('UpdateDailyCallsDrawer', () => {
  it('should not render when isOpen is false', () => {
    renderComponent({ isOpen: false })
    expect(screen.queryByText('title')).not.toBeInTheDocument()
  })

  it('should render title and subtitle when open', () => {
    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('subtitle')).toBeInTheDocument()
  })

  it('should render initial values correctly', () => {
    renderComponent()

    const consumerInput = screen.getByRole('spinbutton', {
      name: 'dailyCallsPerConsumer.label',
    })

    const totalInput = screen.getByRole('spinbutton', {
      name: 'dailyCallsTotal.label',
    })

    expect(consumerInput).toHaveValue(5)
    expect(totalInput).toHaveValue(10)
  })

  it('should call onSubmit without versionId', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderComponent({ onSubmit })

    const saveButton = screen.getByText('actions.saveEdits')
    await user.click(saveButton)

    expect(onSubmit).toHaveBeenCalledWith('eservice-1', 5, 10)
  })

  it('should call onSubmit with versionId when provided', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderComponent({ onSubmit, versionId: 'version-1' })

    const saveButton = screen.getByText('actions.saveEdits')
    await user.click(saveButton)

    expect(onSubmit).toHaveBeenCalledWith('eservice-1', 5, 10, 'version-1')
  })

  it('should show validation error if dailyCallsTotal <= dailyCallsPerConsumer', async () => {
    const user = userEvent.setup()

    renderComponent({ dailyCallsPerConsumer: 5, dailyCallsTotal: 6 })

    const totalInput = screen.getByRole('spinbutton', {
      name: 'dailyCallsTotal.label',
    })

    await user.clear(totalInput)
    await user.type(totalInput, '5')

    const saveButton = screen.getByText('actions.saveEdits')
    await user.click(saveButton)

    expect(screen.getByText('dailyCallsTotalField.validation.min')).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    const user = userEvent.setup()

    renderComponent()

    const consumerInput = screen.getByRole('spinbutton', {
      name: 'dailyCallsPerConsumer.label',
    })

    await user.clear(consumerInput)

    const saveButton = screen.getByText('actions.saveEdits')
    await user.click(saveButton)

    expect(consumerInput).toHaveAttribute('aria-invalid', 'true')
  })

  it('should update validation dynamically when consumer value changes', async () => {
    const user = userEvent.setup()

    renderComponent({ dailyCallsPerConsumer: 5, dailyCallsTotal: 10 })

    const consumerInput = screen.getByRole('spinbutton', {
      name: 'dailyCallsPerConsumer.label',
    })

    const totalInput = screen.getByRole('spinbutton', {
      name: 'dailyCallsTotal.label',
    })

    await user.clear(consumerInput)
    await user.type(consumerInput, '8')

    await user.clear(totalInput)
    await user.type(totalInput, '8')

    const saveButton = screen.getByText('actions.saveEdits')
    await user.click(saveButton)

    expect(screen.getByText('dailyCallsTotalField.validation.min')).toBeInTheDocument()
  })
})
