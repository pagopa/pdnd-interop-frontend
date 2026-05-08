import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VerticalInformationContainer } from '../VerticalInformationContainer'

vi.mock('@pagopa/mui-italia', () => ({
  CopyToClipboardButton: ({ value, tooltipTitle }: { value: string; tooltipTitle: string }) => (
    <button data-testid="copy-button" data-value={value} data-tooltip={tooltipTitle}>
      copy
    </button>
  ),
}))

function renderComponent(props: React.ComponentProps<typeof VerticalInformationContainer>) {
  return render(<VerticalInformationContainer {...props} />)
}

describe('VerticalInformationContainer', () => {
  it('should render label and labelDescription when provided', () => {
    renderComponent({
      label: 'label_1',
      labelDescription: 'description_1',
    })

    expect(screen.getByText('label_1')).toBeInTheDocument()
    expect(screen.getByText('description_1')).toBeInTheDocument()
  })

  it('should NOT render labelDescription when not provided', () => {
    renderComponent({
      label: 'label_1',
    })

    expect(screen.queryByText('description_1')).not.toBeInTheDocument()
  })

  it('should render content when provided', () => {
    renderComponent({
      label: 'label_1',
      content: 'content_1',
    })

    expect(screen.getByText('content_1')).toBeInTheDocument()
  })

  it('should NOT render content when not provided', () => {
    renderComponent({
      label: 'label_1',
    })

    expect(screen.queryByText('content_1')).not.toBeInTheDocument()
  })

  it('should render CopyToClipboardButton when copyToClipboard is provided', () => {
    renderComponent({
      label: 'label_1',
      content: 'content_1',
      copyToClipboard: {
        value: 'copy_value',
        tooltipTitle: 'copy_tooltip',
      },
    })

    const button = screen.getByTestId('copy-button')

    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('data-value', 'copy_value')
    expect(button).toHaveAttribute('data-tooltip', 'copy_tooltip')
  })

  it('should NOT render CopyToClipboardButton when copyToClipboard is not provided', () => {
    renderComponent({
      label: 'label_1',
      content: 'content_1',
    })

    expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument()
  })
})
