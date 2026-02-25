import React from 'react'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import {
  UpdateInstanceLabelDrawer,
  type UpdateInstanceLabelDrawerRef,
} from '../UpdateInstanceLabelDrawer'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  eServiceId: 'eservice-id',
  currentInstanceLabel: 'Patente',
  templateName: 'Credenziale IT-Wallet',
  onSubmit: vi.fn(),
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('UpdateInstanceLabelDrawer', () => {
  it('renders the drawer with title and subtitle', () => {
    renderWithApplicationContext(<UpdateInstanceLabelDrawer {...defaultProps} />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('subtitle')).toBeInTheDocument()
  })

  it('pre-fills the input with the current instanceLabel', () => {
    renderWithApplicationContext(<UpdateInstanceLabelDrawer {...defaultProps} />, {
      withReactQueryContext: true,
    })

    const input = screen.getByRole('textbox', { name: 'instanceLabelField.label' })
    expect(input).toHaveValue('Patente')
  })

  it('enforces maxLength of 12 characters', () => {
    renderWithApplicationContext(<UpdateInstanceLabelDrawer {...defaultProps} />, {
      withReactQueryContext: true,
    })

    const input = screen.getByRole('textbox', { name: 'instanceLabelField.label' })
    expect(input).toHaveAttribute('maxlength', '12')
  })

  it('shows the catalog preview on separate lines (not side-by-side)', () => {
    renderWithApplicationContext(<UpdateInstanceLabelDrawer {...defaultProps} />, {
      withReactQueryContext: true,
    })

    const previewLabel = screen.getByText('instanceLabelField.catalogPreviewLabel')
    const previewValue = screen.getByText('Credenziale IT-Wallet - Patente')

    // Both should be inside a Box without display:flex (stacked vertically)
    const container = previewLabel.parentElement!
    const style = window.getComputedStyle(container)
    expect(style.display).not.toBe('flex')

    expect(previewLabel).toBeInTheDocument()
    expect(previewValue).toBeInTheDocument()
  })

  it('hides the catalog preview when input is empty', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(<UpdateInstanceLabelDrawer {...defaultProps} />, {
      withReactQueryContext: true,
    })

    const input = screen.getByRole('textbox', { name: 'instanceLabelField.label' })
    await user.clear(input)

    await waitFor(() => {
      expect(screen.queryByText('instanceLabelField.catalogPreviewLabel')).not.toBeInTheDocument()
    })
  })

  it('updates the catalog preview when user types', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(
      <UpdateInstanceLabelDrawer {...defaultProps} currentInstanceLabel="" />,
      { withReactQueryContext: true }
    )

    const input = screen.getByRole('textbox', { name: 'instanceLabelField.label' })
    await user.type(input, 'CIE')

    await waitFor(() => {
      expect(screen.getByText('Credenziale IT-Wallet - CIE')).toBeInTheDocument()
    })
  })

  it('calls onSubmit with eServiceId and new instanceLabel value', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(<UpdateInstanceLabelDrawer {...defaultProps} />, {
      withReactQueryContext: true,
    })

    const input = screen.getByRole('textbox', { name: 'instanceLabelField.label' })
    await user.clear(input)
    await user.type(input, 'CIE')

    const submitButton = screen.getByRole('button', { name: 'actions.upgrade' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith('eservice-id', 'CIE')
    })
  })

  it('trims whitespace from the instanceLabel before submitting', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(
      <UpdateInstanceLabelDrawer {...defaultProps} currentInstanceLabel="" />,
      { withReactQueryContext: true }
    )

    const input = screen.getByRole('textbox', { name: 'instanceLabelField.label' })
    await user.type(input, '  CIE  ')

    const submitButton = screen.getByRole('button', { name: 'actions.upgrade' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith('eservice-id', 'CIE')
    })
  })

  it('shows validation error when submitting the same value as current', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(<UpdateInstanceLabelDrawer {...defaultProps} />, {
      withReactQueryContext: true,
    })

    const submitButton = screen.getByRole('button', { name: 'actions.upgrade' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('instanceLabelField.validation.sameValue')).toBeInTheDocument()
    })
    expect(defaultProps.onSubmit).not.toHaveBeenCalled()
  })

  it('shows validation error when submitting with empty field', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(<UpdateInstanceLabelDrawer {...defaultProps} />, {
      withReactQueryContext: true,
    })

    const input = screen.getByRole('textbox', { name: 'instanceLabelField.label' })
    await user.clear(input)

    const submitButton = screen.getByRole('button', { name: 'actions.upgrade' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('instanceLabelField.validation.required')).toBeInTheDocument()
    })
    expect(defaultProps.onSubmit).not.toHaveBeenCalled()
  })

  it('allows setting a field error via ref (for duplicate label)', async () => {
    const ref = React.createRef<UpdateInstanceLabelDrawerRef>()
    renderWithApplicationContext(<UpdateInstanceLabelDrawer ref={ref} {...defaultProps} />, {
      withReactQueryContext: true,
    })

    act(() => {
      ref.current?.setFieldError('Duplicate label error')
    })

    await waitFor(() => {
      expect(screen.getByText('Duplicate label error')).toBeInTheDocument()
    })
  })
})
