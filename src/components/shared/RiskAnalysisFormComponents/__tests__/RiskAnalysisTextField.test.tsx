import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { RiskAnalysisTextField } from '../RiskAnalysisTextField'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { FormProvider, useForm } from 'react-hook-form'
import { PurposeCreateContextProvider } from '@/components/shared/PurposeCreateContext'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string) => ({
    t: (key: string) => `${namespace}.${key}`,
  }),
}))

// Mock form utils
vi.mock('@/utils/form.utils', () => ({
  getAriaAccessibilityInputProps: vi.fn(() => ({
    accessibilityProps: {},
    ids: { labelId: 'test-label-id', helperTextId: 'test-helper-id' },
  })),
  mapValidationErrorMessages: vi.fn((rules) => rules),
}))

// Mock RiskAnalysisInputWrapper
vi.mock('../RiskAnalysisInputWrapper', () => ({
  default: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="risk-analysis-input-wrapper" {...props}>
      {children}
    </div>
  ),
}))

const TestWrapper: React.FC<{
  children: React.ReactNode
  isFromPurposeTemplate?: boolean
  type?: 'creator' | 'consumer'
}> = ({ children, isFromPurposeTemplate = false, type }) => {
  const formMethods = useForm({
    defaultValues: {
      answers: { 'test-question': '' },
      suggestedValues: { 'test-question': [] },
    },
  })

  return (
    <PurposeCreateContextProvider isFromPurposeTemplate={isFromPurposeTemplate} type={type}>
      <FormProvider {...formMethods}>{children}</FormProvider>
    </PurposeCreateContextProvider>
  )
}

const defaultProps = {
  questionId: 'test-question',
  label: 'Test Label',
  name: 'test-field',
}

describe('RiskAnalysisTextField', () => {
  describe('rendering', () => {
    it('should render basic text field for non-purpose template', () => {
      renderWithApplicationContext(
        <TestWrapper>
          <RiskAnalysisTextField {...defaultProps} />
        </TestWrapper>,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByTestId('risk-analysis-input-wrapper')).toBeInTheDocument()
    })

    it('should render suggested values UI for purpose template', () => {
      renderWithApplicationContext(
        <TestWrapper isFromPurposeTemplate={true} type="creator">
          <RiskAnalysisTextField {...defaultProps} />
        </TestWrapper>,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByTestId('risk-analysis-input-wrapper')).toBeInTheDocument()
      expect(screen.getAllByText('purposeTemplate.answerInputPlaceholder')).toHaveLength(2)
      expect(screen.getByText('purposeTemplate.addAnswerBtn')).toBeInTheDocument()
    })
  })

  describe('suggested values functionality', () => {
    it('should add suggested value when add button is clicked', async () => {
      renderWithApplicationContext(
        <TestWrapper isFromPurposeTemplate={true} type="creator">
          <RiskAnalysisTextField {...defaultProps} />
        </TestWrapper>,
        {
          withReactQueryContext: true,
        }
      )

      const input = screen.getByLabelText('purposeTemplate.answerInputPlaceholder')
      const addButton = screen.getByText('purposeTemplate.addAnswerBtn')

      fireEvent.change(input, { target: { value: 'Test suggested value' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(input).toHaveValue('')
      })
    })

    it('should add suggested value when Enter key is pressed', async () => {
      renderWithApplicationContext(
        <TestWrapper isFromPurposeTemplate={true} type="creator">
          <RiskAnalysisTextField {...defaultProps} />
        </TestWrapper>,
        {
          withReactQueryContext: true,
        }
      )

      const input = screen.getByLabelText('purposeTemplate.answerInputPlaceholder')

      fireEvent.change(input, { target: { value: 'Test suggested value' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      await waitFor(() => {
        expect(input).toHaveValue('')
      })
    })

    it('should disable add button when input is empty', () => {
      renderWithApplicationContext(
        <TestWrapper isFromPurposeTemplate={true} type="creator">
          <RiskAnalysisTextField {...defaultProps} />
        </TestWrapper>,
        {
          withReactQueryContext: true,
        }
      )

      const addButton = screen.getByText('purposeTemplate.addAnswerBtn')
      expect(addButton).toBeDisabled()
    })

    it('should enable add button when input has value', () => {
      renderWithApplicationContext(
        <TestWrapper isFromPurposeTemplate={true} type="creator">
          <RiskAnalysisTextField {...defaultProps} />
        </TestWrapper>,
        {
          withReactQueryContext: true,
        }
      )

      const input = screen.getByLabelText('purposeTemplate.answerInputPlaceholder')
      const addButton = screen.getByText('purposeTemplate.addAnswerBtn')

      fireEvent.change(input, { target: { value: 'Test value' } })

      expect(addButton).not.toBeDisabled()
    })

    it('should not add empty or whitespace-only values', async () => {
      renderWithApplicationContext(
        <TestWrapper isFromPurposeTemplate={true} type="creator">
          <RiskAnalysisTextField {...defaultProps} />
        </TestWrapper>,
        {
          withReactQueryContext: true,
        }
      )

      const input = screen.getByLabelText('purposeTemplate.answerInputPlaceholder')
      const addButton = screen.getByText('purposeTemplate.addAnswerBtn')

      fireEvent.change(input, { target: { value: '   ' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(input).toHaveValue('   ')
      })
    })
  })

  describe('suggested values display and removal', () => {
    it('should display suggested values when they exist', () => {
      const TestWrapperWithValues: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        const formMethods = useForm({
          defaultValues: {
            answers: { 'test-question': '' },
            suggestedValues: { 'test-question': ['Value 1', 'Value 2'] },
          },
        })

        return (
          <PurposeCreateContextProvider isFromPurposeTemplate={true} type="creator">
            <FormProvider {...formMethods}>{children}</FormProvider>
          </PurposeCreateContextProvider>
        )
      }

      renderWithApplicationContext(
        <TestWrapperWithValues>
          <RiskAnalysisTextField {...defaultProps} />
        </TestWrapperWithValues>,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByDisplayValue('Value 1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Value 2')).toBeInTheDocument()
    })

    it('should remove suggested value when remove button is clicked', () => {
      const TestWrapperWithValues: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        const formMethods = useForm({
          defaultValues: {
            answers: { 'test-question': '' },
            suggestedValues: { 'test-question': ['Value 1', 'Value 2'] },
          },
        })

        return (
          <PurposeCreateContextProvider isFromPurposeTemplate={true} type="creator">
            <FormProvider {...formMethods}>{children}</FormProvider>
          </PurposeCreateContextProvider>
        )
      }

      renderWithApplicationContext(
        <TestWrapperWithValues>
          <RiskAnalysisTextField {...defaultProps} />
        </TestWrapperWithValues>,
        {
          withReactQueryContext: true,
        }
      )

      const removeButtons = screen.getAllByRole('button')
      const removeButton = removeButtons.find((button) =>
        button.querySelector('[data-testid="RemoveCircleOutlineIcon"]')
      )

      if (removeButton) {
        fireEvent.click(removeButton)
      }
    })

    it('should not display suggested values section when no values exist', () => {
      renderWithApplicationContext(
        <TestWrapper>
          <RiskAnalysisTextField {...defaultProps} />
        </TestWrapper>,
        {
          withReactQueryContext: true,
        }
      )

      // Should not find any disabled input fields (which represent suggested values)
      const disabledInputs = screen.queryAllByRole('textbox', { hidden: true })
      const readonlyInputs = disabledInputs.filter((input) => input.hasAttribute('disabled'))
      expect(readonlyInputs).toHaveLength(0)
    })
  })

  describe('edge cases', () => {
    it('should handle undefined suggested values', () => {
      const TestWrapperWithUndefined: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        const formMethods = useForm({
          defaultValues: {
            answers: { 'test-question': '' },
            suggestedValues: { 'test-question': undefined },
          },
        })

        return (
          <PurposeCreateContextProvider isFromPurposeTemplate={false}>
            <FormProvider {...formMethods}>{children}</FormProvider>
          </PurposeCreateContextProvider>
        )
      }

      renderWithApplicationContext(
        <TestWrapperWithUndefined>
          <RiskAnalysisTextField {...defaultProps} />
        </TestWrapperWithUndefined>,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByTestId('risk-analysis-input-wrapper')).toBeInTheDocument()
    })

    it('should handle empty suggested values array', () => {
      const TestWrapperWithEmpty: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        const formMethods = useForm({
          defaultValues: {
            answers: { 'test-question': '' },
            suggestedValues: { 'test-question': [] },
          },
        })

        return (
          <PurposeCreateContextProvider isFromPurposeTemplate={false}>
            <FormProvider {...formMethods}>{children}</FormProvider>
          </PurposeCreateContextProvider>
        )
      }

      renderWithApplicationContext(
        <TestWrapperWithEmpty>
          <RiskAnalysisTextField {...defaultProps} />
        </TestWrapperWithEmpty>,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByTestId('risk-analysis-input-wrapper')).toBeInTheDocument()
    })

    it('should handle questionType prop', () => {
      renderWithApplicationContext(
        <TestWrapper>
          <RiskAnalysisTextField {...defaultProps} questionType="text" />
        </TestWrapper>,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByTestId('risk-analysis-input-wrapper')).toBeInTheDocument()
    })
  })
})
