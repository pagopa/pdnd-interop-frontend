import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { UpdateNameDrawer } from '../UpdateNameDrawer'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  id: 'template-id',
  name: 'Test Template',
  title: 'Update name',
  subtitle: 'Change the template name',
  label: 'Name',
  infoLabel: 'Enter the new name',
  validateLabel: 'Name must be different',
  onSubmit: vi.fn(),
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('UpdateNameDrawer', () => {
  it('applies custom maxLength to the input', () => {
    renderWithApplicationContext(<UpdateNameDrawer {...defaultProps} maxLength={45} />, {
      withReactQueryContext: true,
    })

    const input = screen.getByRole('textbox', { name: 'Name' })
    expect(input).toHaveAttribute('maxlength', '45')
  })

  it('uses default maxLength of 60 when not specified', () => {
    renderWithApplicationContext(<UpdateNameDrawer {...defaultProps} />, {
      withReactQueryContext: true,
    })

    const input = screen.getByRole('textbox', { name: 'Name' })
    expect(input).toHaveAttribute('maxlength', '60')
  })
})
