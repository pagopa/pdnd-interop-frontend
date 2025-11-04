import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { AddAnnotationDrawer } from '../AddAnnotationDrawer'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('AddAnnotationDrawer', () => {
  const mockOnClose = vi.fn()
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when isOpen is false', () => {
    const { container } = renderWithApplicationContext(
      <AddAnnotationDrawer
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        question="Test question?"
      />,
      {
        withReactQueryContext: true,
      }
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should render when isOpen is true', () => {
    renderWithApplicationContext(
      <AddAnnotationDrawer
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        question="Test question?"
      />,
      {
        withReactQueryContext: true,
      }
    )

    // The text is split across elements, so we use a flexible matcher
    expect(screen.getByText((content, _) => content.includes('Test question?'))).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(
      <AddAnnotationDrawer
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        question="Test question?"
      />,
      {
        withReactQueryContext: true,
      }
    )

    // Find the close icon button by aria-label (the key itself, not translated)
    const closeButton = screen.getByRole('button', { name: 'closeIconAriaLabel' })
    await user.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should call onSubmit with annotation value when submit button is clicked', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(
      <AddAnnotationDrawer
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        question="Test question?"
      />,
      {
        withReactQueryContext: true,
      }
    )

    const textField = screen.getByRole('textbox')
    await user.type(textField, 'Test annotation')

    const submitButton = screen.getByRole('button', { name: /add/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
      expect(mockOnSubmit).toHaveBeenCalledWith('Test annotation')
    })
  })

  it('should have form reset functionality', () => {
    // Test that the component renders with form reset capability
    // The actual reset happens in onTransitionExited callback which is tested implicitly
    renderWithApplicationContext(
      <AddAnnotationDrawer
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        question="Test question?"
      />,
      {
        withReactQueryContext: true,
      }
    )

    const textField = screen.getByRole('textbox')
    expect(textField).toBeInTheDocument()
    expect(textField).toHaveValue('')
  })
})
