import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { RiskAnalysisTextField } from '../RiskAnalysisTextField'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { FormProvider, useForm } from 'react-hook-form'
import { PurposeCreateContextProvider } from '@/components/shared/PurposeCreateContext'
import userEvent from '@testing-library/user-event'
import { PageContainer } from '@/components/layout/containers/PageContainer'
import {
  PageContainerFormDirtyStateContext,
  usePageContainerFormDirtyState,
} from '@/hooks/usePageContainerFormDirtyState'

// Mock react-i18next
vi.mock('react-i18next', async () => ({
  ...(await import('../../../../../__mocks__/react-i18next')),
  useTranslation: (namespace: string) => ({
    t: (key: string) => `${namespace}.${key}`,
    i18n: { language: 'it' },
  }),
}))

// Mock form utils
vi.mock('@/utils/form.utils', () => ({
  getAriaAccessibilityInputProps: vi.fn(() => ({
    accessibilityProps: {},
    ids: { labelId: 'test-label-id', helperTextId: 'test-helper-id' },
  })),
  mapValidationErrorMessages: vi.fn((rules) => rules),
  withTrimmedRequired: vi.fn((rules) => rules),
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
  questionKey: 'test-question',
  label: 'Test Label',
  name: 'test-field',
}

describe('RiskAnalysisTextField', () => {
  it('unregisters rather than retaining a clean owner while the suggested form is hidden', async () => {
    const updateOwner = vi.fn()
    const unregisterOwner = vi.fn()
    const ToggleTemplate = () => {
      const [isFromPurposeTemplate, setIsFromPurposeTemplate] = React.useState(false)
      return (
        <TestWrapper isFromPurposeTemplate={isFromPurposeTemplate} type="creator">
          <button type="button" onClick={() => setIsFromPurposeTemplate((current) => !current)}>
            Toggle template
          </button>
          <RiskAnalysisTextField {...defaultProps} />
        </TestWrapper>
      )
    }

    renderWithApplicationContext(
      <PageContainerFormDirtyStateContext.Provider
        value={{ updateOwner, unregisterOwner, stepKey: 'risk-analysis' }}
      >
        <ToggleTemplate />
      </PageContainerFormDirtyStateContext.Provider>,
      {}
    )
    expect(updateOwner).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Toggle template' }))
    await userEvent.type(screen.getByLabelText('purposeTemplate.answerInputPlaceholder'), 'Draft')
    const ownerId = updateOwner.mock.calls[0][0]
    expect(updateOwner).toHaveBeenLastCalledWith(ownerId, 'risk-analysis', true)

    updateOwner.mockClear()
    unregisterOwner.mockClear()
    await userEvent.click(screen.getByRole('button', { name: 'Toggle template' }))
    expect(unregisterOwner).toHaveBeenCalledWith(ownerId)
    expect(updateOwner).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: 'Toggle template' }))
    expect(updateOwner).toHaveBeenLastCalledWith(ownerId, 'risk-analysis', false)
    expect(screen.getByLabelText('purposeTemplate.answerInputPlaceholder')).toHaveValue('')
  })

  describe('pending suggested answer navigation', () => {
    const exitName = 'shared-components.exitButton'
    const dialogName = 'shared-components.exitDialog.title'
    const cancelName = 'shared-components.exitDialog.cancelButton'
    const inputLabel = 'purposeTemplate.answerInputPlaceholder'

    const RegisteredOuterForm = () => {
      const methods = useForm({
        defaultValues: {
          answers: { 'test-question': '' },
          suggestedValues: { 'test-question': [] as string[] },
        },
      })
      const [type, setType] = React.useState<'creator' | 'consumer'>('creator')
      const [isFromPurposeTemplate, setIsFromPurposeTemplate] = React.useState(true)
      const [showField, setShowField] = React.useState(true)
      usePageContainerFormDirtyState(methods.control)

      return (
        <PurposeCreateContextProvider isFromPurposeTemplate={isFromPurposeTemplate} type={type}>
          <FormProvider {...methods}>
            <output aria-label="Outer form state">
              {methods.formState.isDirty ? 'dirty' : 'clean'}
            </output>
            <button type="button" onClick={() => methods.reset()}>
              Reset outer form
            </button>
            <button
              type="button"
              onClick={() => setType((current) => (current === 'creator' ? 'consumer' : 'creator'))}
            >
              Toggle consumer mode
            </button>
            <button type="button" onClick={() => setIsFromPurposeTemplate((current) => !current)}>
              Toggle template mode
            </button>
            <button type="button" onClick={() => setShowField((current) => !current)}>
              Toggle field
            </button>
            {showField && <RiskAnalysisTextField {...defaultProps} questionType="text" />}
          </FormProvider>
        </PurposeCreateContextProvider>
      )
    }

    const renderWizard = () =>
      renderWithApplicationContext(
        // Keep clean exits on this page so successive dirty-state transitions can be asserted.
        <div onClickCapture={(event) => event.preventDefault()}>
          <PageContainer navigation={{ mode: 'wizard', exitAction: { to: 'DEFAULT' } }}>
            <RegisteredOuterForm />
          </PageContainer>
        </div>,
        { withRouterContext: true, withDialogContext: true }
      )

    it('prompts for text without Add, retains it on cancel, and stops prompting after clearing', async () => {
      renderWizard()
      const input = screen.getByLabelText(inputLabel)

      await userEvent.click(screen.getByRole('link', { name: exitName }))
      expect(screen.queryByRole('dialog', { name: dialogName })).not.toBeInTheDocument()

      await userEvent.type(input, 'Pending answer')
      expect(screen.getByLabelText('Outer form state')).toHaveTextContent('clean')
      await userEvent.click(screen.getByRole('link', { name: exitName }))
      expect(screen.getByRole('dialog', { name: dialogName })).toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: cancelName }))
      await waitFor(() =>
        expect(screen.queryByRole('dialog', { name: dialogName })).not.toBeInTheDocument()
      )
      expect(input).toHaveValue('Pending answer')

      await userEvent.clear(input)
      await userEvent.click(screen.getByRole('link', { name: exitName }))
      expect(screen.queryByRole('dialog', { name: dialogName })).not.toBeInTheDocument()
    })

    it('keeps whitespace-only pending text dirty even though Add is disabled', async () => {
      renderWizard()
      await userEvent.type(screen.getByLabelText(inputLabel), '   ')
      expect(screen.getByRole('button', { name: 'purposeTemplate.addAnswerBtn' })).toBeDisabled()

      await userEvent.click(screen.getByRole('link', { name: exitName }))
      expect(screen.getByRole('dialog', { name: dialogName })).toBeInTheDocument()
    })

    it('resets the pending owner after Add but keeps the accepted outer suggestion dirty', async () => {
      renderWizard()
      const input = screen.getByLabelText(inputLabel)
      await userEvent.type(input, '  Accepted answer  ')
      await userEvent.click(screen.getByRole('button', { name: 'purposeTemplate.addAnswerBtn' }))

      expect(input).toHaveValue('')
      expect(screen.getByDisplayValue('Accepted answer')).toBeDisabled()
      expect(screen.getByLabelText('Outer form state')).toHaveTextContent('dirty')
      await userEvent.click(screen.getByRole('link', { name: exitName }))
      expect(screen.getByRole('dialog', { name: dialogName })).toBeInTheDocument()
      await userEvent.click(screen.getByRole('button', { name: cancelName }))
      await waitFor(() =>
        expect(screen.queryByRole('dialog', { name: dialogName })).not.toBeInTheDocument()
      )

      await userEvent.click(screen.getByRole('button', { name: 'Reset outer form' }))
      await userEvent.click(screen.getByRole('link', { name: exitName }))
      expect(screen.queryByRole('dialog', { name: dialogName })).not.toBeInTheDocument()
    })

    it('does not clear pending text or its dirty state when the outer form resets', async () => {
      renderWizard()
      await userEvent.type(screen.getByLabelText(inputLabel), 'Pending answer')
      await userEvent.click(screen.getByRole('button', { name: 'Reset outer form' }))

      expect(screen.getByLabelText(inputLabel)).toHaveValue('Pending answer')
      await userEvent.click(screen.getByRole('link', { name: exitName }))
      expect(screen.getByRole('dialog', { name: dialogName })).toBeInTheDocument()
    })

    it.each(['Toggle consumer mode', 'Toggle template mode', 'Toggle field'])(
      'clears the pending owner and draft when hidden via %s',
      async (toggleName) => {
        renderWizard()
        await userEvent.type(screen.getByLabelText(inputLabel), 'Pending answer')
        await userEvent.click(screen.getByRole('button', { name: toggleName }))
        expect(screen.queryByLabelText(inputLabel)).not.toBeInTheDocument()

        await userEvent.click(screen.getByRole('link', { name: exitName }))
        expect(screen.queryByRole('dialog', { name: dialogName })).not.toBeInTheDocument()

        await userEvent.click(screen.getByRole('button', { name: toggleName }))
        expect(screen.getByLabelText(inputLabel)).toHaveValue('')
        await userEvent.click(screen.getByRole('link', { name: exitName }))
        expect(screen.queryByRole('dialog', { name: dialogName })).not.toBeInTheDocument()
      }
    )
  })

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
