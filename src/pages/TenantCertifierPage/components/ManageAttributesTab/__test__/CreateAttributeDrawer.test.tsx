import { renderWithApplicationContext } from '@/utils/testing.utils'
import React from 'react'
import { CreateAttributeDrawer } from '../CreateAttributeDrawer'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'

const { mockCreateCertified, mockCreateCertifiedDiscrete } = vi.hoisted(() => {
  return {
    mockCreateCertified: vi.fn(),
    mockCreateCertifiedDiscrete: vi.fn(),
  }
})

vi.mock('@/api/attribute/attribute.services', () => ({
  AttributeServices: {
    createCertified: mockCreateCertified,
    createCertifiedDiscrete: mockCreateCertifiedDiscrete,
  },
}))

describe('CreateAttributeDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  describe('rendering', () => {
    it('should not render the drawer when isOpen is false', () => {
      const screen = renderWithApplicationContext(
        <CreateAttributeDrawer isOpen={false} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.queryByText('title')).not.toBeInTheDocument()
      expect(screen.queryByText('subtitle')).not.toBeInTheDocument()
      expect(screen.queryByText('submitBtnLabel')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('form.infoFields.nameField.label')).not.toBeInTheDocument()
    })

    it('should render the drawer when isOpen is true', () => {
      const screen = renderWithApplicationContext(
        <CreateAttributeDrawer isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByText('title')).toBeInTheDocument()
      expect(screen.getByText('subtitle')).toBeInTheDocument()
      expect(screen.getByText('submitBtnLabel')).toBeInTheDocument()
      expect(screen.getByText('form.infoFields.nameField.label')).toBeInTheDocument()
    })
  })

  describe('form submission', () => {
    it('should call createCertifiedAttribute if attribute kind selected is CERTIFIED', async () => {
      const user = userEvent.setup()
      const screen = renderWithApplicationContext(
        <CreateAttributeDrawer isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      const radioOptionCertified = screen.getByRole('radio', {
        name: 'form.kindField.kindRadio.optionCertifiedLabel',
      })

      await user.click(radioOptionCertified)

      const nameField = screen.getByRole('textbox', { name: 'form.infoFields.nameField.label' })
      const descriptionField = screen.getByRole('textbox', {
        name: 'form.infoFields.descriptionField.label',
      })

      await user.type(nameField, 'test name certified')
      await user.type(descriptionField, 'test description certified')

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockCreateCertifiedDiscrete).not.toBeCalled()
        expect(mockCreateCertified).toBeCalledWith({
          name: 'test name certified',
          description: 'test description certified',
        })
      })
    })

    it('should call createCertifiedAttributeDiscrete if attribute kind selected is CERTIFIED_DISCRETE', async () => {
      const user = userEvent.setup()
      const screen = renderWithApplicationContext(
        <CreateAttributeDrawer isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      const radioOptionCertified = screen.getByRole('radio', {
        name: 'form.kindField.kindRadio.optionCertifiedDiscreteLabel',
      })

      await user.click(radioOptionCertified)

      const nameField = screen.getByRole('textbox', { name: 'form.infoFields.nameField.label' })
      const descriptionField = screen.getByRole('textbox', {
        name: 'form.infoFields.descriptionField.label',
      })

      await user.type(nameField, 'test name certified discrete')
      await user.type(descriptionField, 'test description certified discrete')

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockCreateCertified).not.toBeCalled()
        expect(mockCreateCertifiedDiscrete).toBeCalledWith({
          name: 'test name certified discrete',
          description: 'test description certified discrete',
        })
      })
    })
  })
})
