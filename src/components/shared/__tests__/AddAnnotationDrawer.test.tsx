import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { AddAnnotationDrawer } from '../AddAnnotationDrawer'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { RiskAnalysisTemplateAnswerAnnotation } from '@/api/api.generatedTypes'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string) => ({
    t: (key: string) => `${namespace}.${key}`,
  }),
}))

const mockAnnotation: RiskAnalysisTemplateAnswerAnnotation = {
  id: 'test-annotation-id',
  text: 'Test annotation text',
  docs: [],
}

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
}

describe('AddAnnotationDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render drawer when isOpen is true', () => {
      renderWithApplicationContext(<AddAnnotationDrawer {...defaultProps} />, {
        withReactQueryContext: true,
      })

      expect(screen.getByText('purposeTemplate.title')).toBeInTheDocument()
      expect(screen.getByText('purposeTemplate.description')).toBeInTheDocument()
      expect(screen.getByText('purposeTemplate.question')).toBeInTheDocument()
    })

    it('should not render drawer when isOpen is false', () => {
      renderWithApplicationContext(<AddAnnotationDrawer {...defaultProps} isOpen={false} />, {
        withReactQueryContext: true,
      })

      expect(screen.queryByText('purposeTemplate.title')).not.toBeInTheDocument()
    })

    it('should render text field for annotation input', () => {
      renderWithApplicationContext(<AddAnnotationDrawer {...defaultProps} />, {
        withReactQueryContext: true,
      })

      const textField = screen.getByLabelText('purposeTemplate.label')
      expect(textField).toBeInTheDocument()
      expect(textField).toHaveAttribute('maxlength', '250')
    })

    it('should render add button', () => {
      renderWithApplicationContext(<AddAnnotationDrawer {...defaultProps} />, {
        withReactQueryContext: true,
      })

      expect(screen.getByText('common.addBtn')).toBeInTheDocument()
    })
  })

  describe('initial annotation handling', () => {
    it('should initialize with empty annotation when no initialAnnotation provided', () => {
      renderWithApplicationContext(<AddAnnotationDrawer {...defaultProps} />, {
        withReactQueryContext: true,
      })

      const textField = screen.getByLabelText('purposeTemplate.label')
      expect(textField).toHaveValue('')
    })

    it('should initialize with provided initialAnnotation', () => {
      renderWithApplicationContext(
        <AddAnnotationDrawer {...defaultProps} initialAnnotation={mockAnnotation} />,
        {
          withReactQueryContext: true,
        }
      )

      const textField = screen.getByLabelText('purposeTemplate.label')
      expect(textField).toHaveValue('Test annotation text')
    })

    it('should reset form when drawer opens with new initialAnnotation', async () => {
      const { rerender } = renderWithApplicationContext(
        <AddAnnotationDrawer {...defaultProps} initialAnnotation={mockAnnotation} />,
        {
          withReactQueryContext: true,
        }
      )

      const textField = screen.getByLabelText('purposeTemplate.label')
      expect(textField).toHaveValue('Test annotation text')

      // Change the initial annotation
      const newAnnotation = { ...mockAnnotation, text: 'New annotation text' }
      rerender(<AddAnnotationDrawer {...defaultProps} initialAnnotation={newAnnotation} />)

      await waitFor(() => {
        expect(textField).toHaveValue('New annotation text')
      })
    })
  })

  describe('form submission', () => {
    it('should call onSubmit with annotation data when form is submitted', async () => {
      renderWithApplicationContext(<AddAnnotationDrawer {...defaultProps} />, {
        withReactQueryContext: true,
      })

      const textField = screen.getByLabelText('purposeTemplate.label')
      const addButton = screen.getByText('common.addBtn')

      fireEvent.change(textField, { target: { value: 'New annotation text' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          id: '',
          text: 'New annotation text',
          docs: [],
        })
      })
    })

    it('should call onClose after successful submission', async () => {
      renderWithApplicationContext(<AddAnnotationDrawer {...defaultProps} />, {
        withReactQueryContext: true,
      })

      const textField = screen.getByLabelText('purposeTemplate.label')
      const addButton = screen.getByText('common.addBtn')

      fireEvent.change(textField, { target: { value: 'New annotation text' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled()
      })
    })

    it('should preserve initial annotation id when submitting', async () => {
      renderWithApplicationContext(
        <AddAnnotationDrawer {...defaultProps} initialAnnotation={mockAnnotation} />,
        {
          withReactQueryContext: true,
        }
      )

      const textField = screen.getByLabelText('purposeTemplate.label')
      const addButton = screen.getByText('common.addBtn')

      fireEvent.change(textField, { target: { value: 'Updated annotation text' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          id: 'test-annotation-id',
          text: 'Updated annotation text',
          docs: [],
        })
      })
    })
  })

  describe('drawer close handling', () => {
    it('should reset form when drawer transition exits', () => {
      const { rerender } = renderWithApplicationContext(
        <AddAnnotationDrawer {...defaultProps} isOpen={true} />,
        {
          withReactQueryContext: true,
        }
      )

      const textField = screen.getByLabelText('purposeTemplate.label')
      fireEvent.change(textField, { target: { value: 'Some text' } })
      expect(textField).toHaveValue('Some text')

      // Close the drawer
      rerender(<AddAnnotationDrawer {...defaultProps} isOpen={false} />)

      // Reopen the drawer
      rerender(<AddAnnotationDrawer {...defaultProps} isOpen={true} />)

      // Form should be reset
      expect(textField).toHaveValue('')
    })
  })

  describe('accessibility', () => {
    it('should have proper labels and attributes', () => {
      renderWithApplicationContext(<AddAnnotationDrawer {...defaultProps} />, {
        withReactQueryContext: true,
      })

      const textField = screen.getByLabelText('purposeTemplate.label')
      expect(textField).toHaveAttribute('maxlength', '250')
      expect(textField).toHaveAttribute('rows', '11')
    })

    it('should focus on text field when drawer opens', () => {
      renderWithApplicationContext(<AddAnnotationDrawer {...defaultProps} />, {
        withReactQueryContext: true,
      })

      const textField = screen.getByLabelText('purposeTemplate.label')
      expect(textField).toHaveFocus()
    })
  })

  describe('edge cases', () => {
    it('should handle empty text submission', async () => {
      renderWithApplicationContext(<AddAnnotationDrawer {...defaultProps} />, {
        withReactQueryContext: true,
      })

      const addButton = screen.getByText('common.addBtn')
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          id: '',
          text: '',
          docs: [],
        })
      })
    })
  })
})
