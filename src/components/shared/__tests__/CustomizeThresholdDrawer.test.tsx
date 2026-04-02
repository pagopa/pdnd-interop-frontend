import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CustomizeThresholdDrawer, useCustomizeThresholdDrawer } from '../CustomizeThresholdDrawer'
import { vi, describe, it, expect, afterEach } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockDescriptorAttribute } from '@/../__mocks__/data/attribute.mocks'

const mockAttribute = createMockDescriptorAttribute({
  id: 'attr-1',
  name: 'Test Attribute',
  dailyCallsPerConsumer: 50,
})

afterEach(() => {
  useCustomizeThresholdDrawer.setState({
    isOpen: false,
    attribute: undefined,
    attributeGroupIndex: undefined,
  })
})

const renderComponent = (
  props: Partial<React.ComponentProps<typeof CustomizeThresholdDrawer>> = {}
) => {
  const defaultProps: React.ComponentProps<typeof CustomizeThresholdDrawer> = {
    onSubmit: vi.fn(),
    dailyCallsPerConsumer: 100,
    dailyCallsTotal: 1000,
    title: 'title',
    subtitle: 'subtitle',
    alertLabel: 'alertLabel',
    submitButtonLabel: 'submitBtnLabel',
    ...props,
  }

  return renderWithApplicationContext(<CustomizeThresholdDrawer {...defaultProps} />, {
    withReactQueryContext: true,
  })
}

describe('CustomizeThresholdDrawer', () => {
  it('should not render the drawer when isOpen is false', () => {
    renderComponent()
    expect(screen.queryByText('title')).not.toBeInTheDocument()
  })

  it('should render the drawer with title when isOpen is true', () => {
    useCustomizeThresholdDrawer.setState({
      isOpen: true,
      attribute: mockAttribute,
      attributeGroupIndex: 0,
    })
    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should show the threshold field with the attribute value', () => {
    useCustomizeThresholdDrawer.setState({
      isOpen: true,
      attribute: mockAttribute,
      attributeGroupIndex: 0,
    })
    renderComponent()
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  })

  it('should show consumerLimit and totalLimit in the alert (consumer before total)', () => {
    useCustomizeThresholdDrawer.setState({
      isOpen: true,
      attribute: mockAttribute,
      attributeGroupIndex: 0,
    })
    renderComponent()

    const consumerLimit = screen.getByText('limitAlert.consumerLimit')
    const totalLimit = screen.getByText('limitAlert.totalLimit')

    expect(consumerLimit).toBeInTheDocument()
    expect(totalLimit).toBeInTheDocument()

    // Verify order: consumer before total
    const allText = document.body.textContent ?? ''
    const consumerIndex = allText.indexOf('limitAlert.consumerLimit')
    const totalIndex = allText.indexOf('limitAlert.totalLimit')
    expect(consumerIndex).toBeLessThan(totalIndex)
  })

  it('should show warning icon when dailyCallsPerConsumer is undefined', () => {
    useCustomizeThresholdDrawer.setState({
      isOpen: true,
      attribute: mockAttribute,
      attributeGroupIndex: 0,
    })
    renderComponent({ dailyCallsPerConsumer: undefined })
    expect(screen.getByTestId('WarningAmberIcon')).toBeInTheDocument()
  })

  it('should show warning icon when dailyCallsTotal is undefined', () => {
    useCustomizeThresholdDrawer.setState({
      isOpen: true,
      attribute: mockAttribute,
      attributeGroupIndex: 0,
    })
    renderComponent({ dailyCallsTotal: undefined })
    expect(screen.getByTestId('WarningAmberIcon')).toBeInTheDocument()
  })

  it('should show two warning icons when both dailyCallsPerConsumer and dailyCallsTotal are undefined', () => {
    useCustomizeThresholdDrawer.setState({
      isOpen: true,
      attribute: mockAttribute,
      attributeGroupIndex: 0,
    })
    renderComponent({ dailyCallsPerConsumer: undefined, dailyCallsTotal: undefined })
    expect(screen.getAllByTestId('WarningAmberIcon')).toHaveLength(2)
  })

  it('should call onSubmit with the threshold value on submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    useCustomizeThresholdDrawer.setState({
      isOpen: true,
      attribute: createMockDescriptorAttribute({
        id: 'attr-1',
        name: 'Test Attribute',
      }),
      attributeGroupIndex: 0,
    })
    renderComponent({ onSubmit })

    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.type(input, '42')

    const submitBtn = screen.getByText('submitBtnLabel')
    await user.click(submitBtn)

    expect(onSubmit).toHaveBeenCalledWith(42)
  })

  it('should show the submit button with color="primary" in normal state', () => {
    useCustomizeThresholdDrawer.setState({
      isOpen: true,
      attribute: mockAttribute,
      attributeGroupIndex: 0,
    })
    renderComponent()
    const submitBtn = screen.getByText('submitBtnLabel')
    expect(submitBtn.closest('button')).toHaveClass('MuiButton-containedPrimary')
  })
})
