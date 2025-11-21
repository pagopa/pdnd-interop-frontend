import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { PurposeTemplateRiskAnalysisInfoSummary } from '../PurposeTemplateRiskAnalysisInfoSummary'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type {
  RiskAnalysisFormConfig,
  RiskAnalysisFormTemplate,
  RiskAnalysisTemplateAnswerAnnotation,
} from '@/api/api.generatedTypes'
import {
  createMockPurposeTemplate,
  createMockRiskAnalysisFormTemplate,
  createMockRiskAnalysisFormConfigForTests,
} from '@/../__mocks__/data/purposeTemplate.mocks'

vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string, options?: { keyPrefix?: string }) => {
    const keyPrefix = options?.keyPrefix || ''
    return {
      t: (key: string) => {
        const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key
        return `${namespace}.${fullKey}`
      },
      i18n: {
        language: 'en',
        changeLanguage: vi.fn(),
      },
    }
  },
}))

vi.mock('@/hooks/useCurrentLanguage', () => ({
  default: () => 'en' as const,
}))

vi.mock('../AnnotationDetails', () => ({
  AnnotationDetails: ({
    annotation,
    purposeTemplateId,
    answerId,
  }: {
    annotation: RiskAnalysisTemplateAnswerAnnotation
    purposeTemplateId: string
    answerId: string
  }) => (
    <div data-testid={`annotation-details-${answerId}`}>
      <div>{annotation.text}</div>
      <div>Template ID: {purposeTemplateId}</div>
      <div>Answer ID: {answerId}</div>
    </div>
  ),
}))

const mockPurposeTemplatePA = createMockPurposeTemplate({
  id: 'test-template-id',
  targetTenantKind: 'PA',
})

const mockPurposeTemplatePRIVATE = createMockPurposeTemplate({
  id: 'test-template-id',
  targetTenantKind: 'PRIVATE',
})

const createTestRiskAnalysisFormConfig = (): RiskAnalysisFormConfig =>
  createMockRiskAnalysisFormConfigForTests()

const createTestRiskAnalysisFormTemplate = (): RiskAnalysisFormTemplate =>
  createMockRiskAnalysisFormTemplate()

describe('PurposeTemplateRiskAnalysisInfoSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render null when riskAnalysisConfig is not provided', () => {
      const { container } = renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={null as never}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(container.firstChild).toBeNull()
    })

    it('should render null when riskAnalysisForm is not provided', () => {
      const { container } = renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={null as never}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(container.firstChild).toBeNull()
    })

    it('should render title for PA target tenant kind', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByText('purposeTemplate.read.riskAnalysisTab.titlePA')).toBeInTheDocument()
    })

    it('should render title for PRIVATE target tenant kind', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePRIVATE}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(
        screen.getByText('purposeTemplate.read.riskAnalysisTab.titleNotPA')
      ).toBeInTheDocument()
    })

    it('should render all questions from config that have answers', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByText('Text question')).toBeInTheDocument()
      expect(screen.getByText('Multiple choice question')).toBeInTheDocument()
      expect(screen.getByText('Question with annotation')).toBeInTheDocument()
      expect(screen.getByText('Non-editable question')).toBeInTheDocument()
      expect(screen.getByText('Question with suggested values')).toBeInTheDocument()
    })

    it('should not render questions that do not have answers', () => {
      const config = createMockRiskAnalysisFormConfigForTests()
      config.questions.push({
        id: 'question-without-answer',
        label: {
          it: 'Domanda senza risposta',
          en: 'Question without answer',
        },
        dataType: 'FREETEXT',
        visualType: 'text',
        required: true,
        defaultValue: [],
        dependencies: [],
      })

      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={config}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.queryByText('Question without answer')).not.toBeInTheDocument()
    })
  })

  describe('Text questions', () => {
    it('should render text question with answer', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByText('Text question')).toBeInTheDocument()
      expect(screen.getByText('Text answer')).toBeInTheDocument()
    })

    it('should render question info label when provided', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByText('Info label for text question')).toBeInTheDocument()
    })

    it('should render "-" when answer is empty', () => {
      const formTemplate = createMockRiskAnalysisFormTemplate()
      formTemplate.answers['text-question'].values = []

      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={formTemplate}
        />,
        {
          withReactQueryContext: true,
        }
      )

      const answerLabels = screen.getAllByText(
        'shared-components.purposeTemplateRiskAnalysisInfoSummary.answerLabel'
      )
      const answerSection = answerLabels[0].closest('div')
      expect(answerSection).toHaveTextContent('-')
    })
  })

  describe('Multiple choice questions', () => {
    it('should render multiple choice question with selected options', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByText('Multiple choice question')).toBeInTheDocument()
      expect(screen.getByText('Option 1, Option 2')).toBeInTheDocument()
    })

    it('should render empty string when no options are selected', () => {
      const formTemplate = createMockRiskAnalysisFormTemplate()
      formTemplate.answers['multiple-choice-question'].values = []

      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={formTemplate}
        />,
        {
          withReactQueryContext: true,
        }
      )

      const answerLabels = screen.getAllByText(
        'shared-components.purposeTemplateRiskAnalysisInfoSummary.answerLabel'
      )
      const answerSection = answerLabels[1].closest('div')
      expect(answerSection).toHaveTextContent('-')
    })
  })

  describe('Non-editable questions', () => {
    it('should render chip for non-editable question with empty suggestedValues', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      const chips = screen.queryAllByText(
        'shared-components.purposeTemplateRiskAnalysisInfoSummary.notEditableLabel'
      )
      expect(chips.length).toBeGreaterThanOrEqual(1)
    })

    it('should not render chip for editable question', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      const chips = screen.queryAllByText(
        'shared-components.purposeTemplateRiskAnalysisInfoSummary.notEditableLabel'
      )
      expect(chips.length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('Editable question')).toBeInTheDocument()

      const editableQuestion = screen.getByText('Editable question')
      const editableQuestionContainer = editableQuestion.closest('div')
      const chipInEditableQuestion = editableQuestionContainer?.querySelector('[class*="MuiChip"]')
      expect(chipInEditableQuestion).not.toBeInTheDocument()
    })

    it('should not render chip for question with suggestedValues', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      const suggestedValuesQuestion = screen.getByText('Question with suggested values')
      const suggestedValuesContainer = suggestedValuesQuestion.closest('div')
      const chipInSuggestedValues = suggestedValuesContainer?.querySelector('[class*="MuiChip"]')
      expect(chipInSuggestedValues).not.toBeInTheDocument()
    })

    it('should render chip only when question is non-editable and suggestedValues is empty', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      const chips = screen.queryAllByText(
        'shared-components.purposeTemplateRiskAnalysisInfoSummary.notEditableLabel'
      )
      expect(chips).toHaveLength(4)

      const suggestedValuesQuestion = screen.getByText('Question with suggested values')
      const suggestedValuesContainer = suggestedValuesQuestion.closest('div')
      const chipInSuggestedValues = suggestedValuesContainer?.querySelector('[class*="MuiChip"]')
      expect(chipInSuggestedValues).not.toBeInTheDocument()
    })
  })

  describe('Suggested values', () => {
    it('should render suggested values section when present', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(
        screen.getByText(
          'shared-components.purposeTemplateRiskAnalysisInfoSummary.suggestedValuesSection.title'
        )
      ).toBeInTheDocument()
      expect(screen.getByText(/Suggested value 1/)).toBeInTheDocument()
      expect(screen.getByText(/Suggested value 2/)).toBeInTheDocument()
      expect(screen.getByText(/Suggested value 3/)).toBeInTheDocument()
    })

    it('should render suggested values with option numbers', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      const suggestedValuesText = screen.getByText(/Suggested value 1/).textContent
      expect(suggestedValuesText).toContain('1')
    })

    it('should render "-" when answer is empty and no suggested values', () => {
      const formTemplate = createMockRiskAnalysisFormTemplate()
      formTemplate.answers['text-question'].values = []
      formTemplate.answers['text-question'].suggestedValues = []

      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={formTemplate}
        />,
        {
          withReactQueryContext: true,
        }
      )

      const answerLabels = screen.getAllByText(
        'shared-components.purposeTemplateRiskAnalysisInfoSummary.answerLabel'
      )
      const answerSection = answerLabels[0].closest('div')
      expect(answerSection).toHaveTextContent('-')
    })
  })

  describe('Annotations', () => {
    it('should render annotation accordion when annotation exists', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(
        screen.getByText(
          'shared-components.purposeTemplateRiskAnalysisInfoSummary.annotationSection.readAnnotationBtnLabel'
        )
      ).toBeInTheDocument()
    })

    it('should not render annotation accordion when annotation does not exist', () => {
      const formTemplate = createMockRiskAnalysisFormTemplate()
      delete formTemplate.answers['question-with-annotation'].annotation

      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={formTemplate}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(
        screen.queryByText(
          'shared-components.purposeTemplateRiskAnalysisInfoSummary.annotationSection.readAnnotationBtnLabel'
        )
      ).not.toBeInTheDocument()
    })

    it('should render AnnotationDetails when accordion is expanded', async () => {
      const user = userEvent.setup()

      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      const accordionButton = screen.getByRole('button', {
        name: /shared-components\.purposeTemplateRiskAnalysisInfoSummary\.annotationSection\.readAnnotationBtnLabel/i,
      })

      expect(accordionButton).toBeInTheDocument()

      expect(
        screen.queryByTestId('annotation-details-annotation-answer-id')
      ).not.toBeInTheDocument()

      await user.click(accordionButton)

      await waitFor(() => {
        expect(screen.getByTestId('annotation-details-annotation-answer-id')).toBeInTheDocument()
      })

      expect(screen.getByText('Test annotation text')).toBeInTheDocument()
      expect(screen.getByText('Template ID: test-template-id')).toBeInTheDocument()
      expect(screen.getByText('Answer ID: annotation-answer-id')).toBeInTheDocument()
    })

    it('should not render AnnotationDetails before accordion is expanded', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(
        screen.queryByTestId('annotation-details-annotation-answer-id')
      ).not.toBeInTheDocument()
    })
  })

  describe('Language handling', () => {
    it('should use current language for question labels', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByText('Text question')).toBeInTheDocument()
      expect(screen.getByText('Multiple choice question')).toBeInTheDocument()
    })

    it('should use current language for option labels in multiple choice', () => {
      renderWithApplicationContext(
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={mockPurposeTemplatePA}
          riskAnalysisConfig={createTestRiskAnalysisFormConfig()}
          riskAnalysisForm={createTestRiskAnalysisFormTemplate()}
        />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByText('Option 1, Option 2')).toBeInTheDocument()
    })
  })
})
