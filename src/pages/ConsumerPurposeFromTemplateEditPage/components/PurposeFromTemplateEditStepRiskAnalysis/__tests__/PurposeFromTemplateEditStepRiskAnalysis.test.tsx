import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import type { Mock } from 'vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { PurposeMutations } from '@/api/purpose/purpose.mutations'
import PurposeFromTemplateEditStepRiskAnalysis from '../PurposeFromTemplateEditStepRiskAnalysis'
import { RiskAnalysisFormFromTemplate } from '../RiskAnalysisForm/RiskAnalysisFormFromTemplate'
import {
  createMockPurpose,
  createMockRiskAnalysisFormConfig,
} from '@/../__mocks__/data/purpose.mocks'
import {
  createMockPurposeTemplate,
  createMockRiskAnalysisFormTemplate,
  createMockRiskAnalysisTemplateAnswer,
} from '@/../__mocks__/data/purposeTemplate.mocks'

// --- mocks ---
const mockNavigate = vi.fn()
vi.mock('@/router', () => ({
  useParams: vi.fn(() => ({
    purposeTemplateId: 'template-123',
    purposeId: 'purpose-123',
  })),
  useNavigate: vi.fn(() => mockNavigate),
}))

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...(actual as Record<string, unknown>),
    useQuery: vi.fn(),
  }
})

vi.mock('@/api/purpose/purpose.queries', () => ({
  PurposeQueries: {
    getSingle: vi.fn(),
    getRiskAnalysisLatest: vi.fn(),
  },
}))

vi.mock('@/api/purposeTemplate/purposeTemplate.queries', () => ({
  PurposeTemplateQueries: {
    getSingle: vi.fn(),
  },
}))

vi.mock('@/api/purpose/purpose.mutations', () => ({
  PurposeMutations: {
    useUpdateDraftFromPurposeTemplate: vi.fn(),
  },
}))

vi.mock('../RiskAnalysisForm/RiskAnalysisFormFromTemplate', () => ({
  RiskAnalysisFormFromTemplate: vi.fn(({ onCancel, onSubmit }) => (
    <div data-testid="risk-analysis-form-from-template">
      <button data-testid="cancel-button" onClick={onCancel}>
        Cancel
      </button>
      <button
        data-testid="submit-button"
        onClick={() => onSubmit({ question1: ['answer1'], question2: ['answer2'] })}
      >
        Submit
      </button>
    </div>
  )),
}))

describe('PurposeFromTemplateEditStepRiskAnalysis', () => {
  const mockBack = vi.fn()
  const mockMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(PurposeMutations.useUpdateDraftFromPurposeTemplate as Mock).mockReturnValue({
      mutate: mockMutate,
    })
  })

  describe('Rendering', () => {
    it('should return null when riskAnalysis is missing', () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate(),
      })
      const purpose = createMockPurpose()

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: undefined })

      const { container } = render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('should return null when purpose is missing', () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate(),
      })
      const riskAnalysis = createMockRiskAnalysisFormConfig()

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: undefined })
        .mockReturnValueOnce({ data: riskAnalysis })

      const { container } = render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('should return null when purposeTemplate.purposeRiskAnalysisForm is missing', () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: undefined,
      })
      const purpose = createMockPurpose()
      const riskAnalysis = createMockRiskAnalysisFormConfig()

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: riskAnalysis })

      const { container } = render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('should render RiskAnalysisFormFromTemplate when all data is loaded', async () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate({
          version: '2.0',
        }),
      })
      purposeTemplate.purposeRiskAnalysisForm!.answers = {
        question1: createMockRiskAnalysisTemplateAnswer({
          id: 'answer-1',
          values: ['value1'],
          editable: true,
          suggestedValues: [],
        }),
      }
      const purpose = createMockPurpose({
        riskAnalysisForm: {
          version: '2.0',
        },
      })
      purpose.riskAnalysisForm!.answers = {
        question1: ['purpose-answer1'],
      }
      const riskAnalysis = createMockRiskAnalysisFormConfig({
        questions: [
          {
            id: 'question1',
            label: { it: 'Question 1', en: 'Question 1' },
            dataType: 'FREETEXT',
            visualType: 'text',
            required: true,
            defaultValue: [],
            dependencies: [],
          },
        ],
      })

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: riskAnalysis })

      render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('risk-analysis-form-from-template')).toBeInTheDocument()
      })

      expect(RiskAnalysisFormFromTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          riskAnalysis,
          defaultAnswers: expect.any(Object),
          suggestedValueConsumer: expect.any(Object),
          onSubmit: expect.any(Function),
          onCancel: mockBack,
        }),
        expect.any(Object)
      )
    })
  })

  describe('mergeTemplateAndPurposeAnswers logic', () => {
    it('should merge answers correctly when purpose answer is in suggested values', async () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate({
          version: '2.0',
        }),
      })
      purposeTemplate.purposeRiskAnalysisForm!.answers = {
        question1: createMockRiskAnalysisTemplateAnswer({
          id: 'answer-1',
          values: [],
          editable: true,
          suggestedValues: ['suggested1', 'suggested2'],
        }),
      }
      const purpose = createMockPurpose({
        riskAnalysisForm: {
          version: '2.0',
        },
      })
      purpose.riskAnalysisForm!.answers = {
        question1: ['suggested1'],
      }
      const riskAnalysis = createMockRiskAnalysisFormConfig({
        questions: [
          {
            id: 'question1',
            label: { it: 'Question 1', en: 'Question 1' },
            dataType: 'FREETEXT',
            visualType: 'text',
            required: true,
            defaultValue: [],
            dependencies: [],
          },
        ],
      })

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: riskAnalysis })

      render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('risk-analysis-form-from-template')).toBeInTheDocument()
      })

      const formProps = (RiskAnalysisFormFromTemplate as Mock).mock.calls[0][0]
      expect(formProps.defaultAnswers.question1.values).toEqual([])
      expect(formProps.suggestedValueConsumer.question1).toBe('suggested1')
    })

    it('should merge answers correctly when purpose answer is NOT in suggested values', async () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate({
          version: '2.0',
        }),
      })
      purposeTemplate.purposeRiskAnalysisForm!.answers = {
        question1: createMockRiskAnalysisTemplateAnswer({
          id: 'answer-1',
          values: [],
          editable: true,
          suggestedValues: ['suggested1', 'suggested2'],
        }),
      }
      const purpose = createMockPurpose({
        riskAnalysisForm: {
          version: '2.0',
        },
      })
      purpose.riskAnalysisForm!.answers = {
        question1: ['custom-answer'],
      }
      const riskAnalysis = createMockRiskAnalysisFormConfig({
        questions: [
          {
            id: 'question1',
            label: { it: 'Question 1', en: 'Question 1' },
            dataType: 'FREETEXT',
            visualType: 'text',
            required: true,
            defaultValue: [],
            dependencies: [],
          },
        ],
      })

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: riskAnalysis })

      render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('risk-analysis-form-from-template')).toBeInTheDocument()
      })

      const formProps = (RiskAnalysisFormFromTemplate as Mock).mock.calls[0][0]
      expect(formProps.defaultAnswers.question1.values).toEqual(['custom-answer'])
      expect(formProps.suggestedValueConsumer.question1).toBeUndefined()
    })

    it('should merge answers correctly when template has no suggested values', async () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate({
          version: '2.0',
        }),
      })
      purposeTemplate.purposeRiskAnalysisForm!.answers = {
        question1: createMockRiskAnalysisTemplateAnswer({
          id: 'answer-1',
          values: ['template-value'],
          editable: true,
          suggestedValues: [],
        }),
      }
      const purpose = createMockPurpose({
        riskAnalysisForm: {
          version: '2.0',
        },
      })
      purpose.riskAnalysisForm!.answers = {
        question1: ['purpose-value'],
      }
      const riskAnalysis = createMockRiskAnalysisFormConfig({
        questions: [
          {
            id: 'question1',
            label: { it: 'Question 1', en: 'Question 1' },
            dataType: 'FREETEXT',
            visualType: 'text',
            required: true,
            defaultValue: [],
            dependencies: [],
          },
        ],
      })

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: riskAnalysis })

      render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('risk-analysis-form-from-template')).toBeInTheDocument()
      })

      const formProps = (RiskAnalysisFormFromTemplate as Mock).mock.calls[0][0]
      expect(formProps.defaultAnswers.question1.values).toEqual(['purpose-value'])
    })

    it('should use template values when purpose has no answer', async () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate({
          version: '2.0',
        }),
      })
      purposeTemplate.purposeRiskAnalysisForm!.answers = {
        question1: createMockRiskAnalysisTemplateAnswer({
          id: 'answer-1',
          values: ['template-value'],
          editable: true,
          suggestedValues: [],
        }),
      }
      const purpose = createMockPurpose({
        riskAnalysisForm: {
          version: '2.0',
          answers: {},
        },
      })
      const riskAnalysis = createMockRiskAnalysisFormConfig({
        questions: [
          {
            id: 'question1',
            label: { it: 'Question 1', en: 'Question 1' },
            dataType: 'FREETEXT',
            visualType: 'text',
            required: true,
            defaultValue: [],
            dependencies: [],
          },
        ],
      })

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: riskAnalysis })

      render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('risk-analysis-form-from-template')).toBeInTheDocument()
      })

      const formProps = (RiskAnalysisFormFromTemplate as Mock).mock.calls[0][0]
      expect(formProps.defaultAnswers.question1.values).toEqual(['template-value'])
    })

    it('should include purpose answers that are not in template but exist in questions', async () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate({
          version: '2.0',
        }),
      })
      purposeTemplate.purposeRiskAnalysisForm!.answers = {
        question1: createMockRiskAnalysisTemplateAnswer({
          id: 'answer-1',
          values: ['template-value'],
          editable: true,
          suggestedValues: [],
        }),
      }
      const purpose = createMockPurpose({
        riskAnalysisForm: {
          version: '2.0',
        },
      })
      purpose.riskAnalysisForm!.answers = {
        question1: ['purpose-value'],
        question2: ['purpose-only-value'],
      }
      const riskAnalysis = createMockRiskAnalysisFormConfig({
        questions: [
          {
            id: 'question1',
            label: { it: 'Question 1', en: 'Question 1' },
            dataType: 'FREETEXT',
            visualType: 'text',
            required: true,
            defaultValue: [],
            dependencies: [],
          },
          {
            id: 'question2',
            label: { it: 'Question 2', en: 'Question 2' },
            dataType: 'FREETEXT',
            visualType: 'text',
            required: true,
            defaultValue: [],
            dependencies: [],
          },
        ],
      })

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: riskAnalysis })

      render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('risk-analysis-form-from-template')).toBeInTheDocument()
      })

      const formProps = (RiskAnalysisFormFromTemplate as Mock).mock.calls[0][0]
      expect(formProps.defaultAnswers.question2).toBeDefined()
      expect(formProps.defaultAnswers.question2.values).toEqual(['purpose-only-value'])
      expect(formProps.defaultAnswers.question2.id).toBe('')
      expect(formProps.defaultAnswers.question2.editable).toBe(true)
      expect(formProps.defaultAnswers.question2.suggestedValues).toEqual([])
    })
  })

  describe('Form submission', () => {
    it('should call updatePurposeFromTemplate with correct payload on submit', async () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate({
          version: '2.0',
          answers: {},
        }),
      })
      const purpose = createMockPurpose({
        riskAnalysisForm: {
          version: '2.0',
          answers: {},
        },
      })
      const riskAnalysis = createMockRiskAnalysisFormConfig()

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: riskAnalysis })

      render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('risk-analysis-form-from-template')).toBeInTheDocument()
      })

      const submitButton = screen.getByTestId('submit-button')
      submitButton.click()

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          {
            purposeTemplateId: 'template-123',
            purposeId: 'purpose-123',
            riskAnalysisForm: {
              version: '2.0',
              answers: {
                question1: ['answer1'],
                question2: ['answer2'],
              },
            },
          },
          expect.any(Object)
        )
      })
    })

    it('should use riskAnalysisVersion from template when purpose has no version', async () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate({
          version: '3.0',
          answers: {},
        }),
      })
      const purpose = createMockPurpose({
        riskAnalysisForm: undefined,
      })
      const riskAnalysis = createMockRiskAnalysisFormConfig()

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: riskAnalysis })

      render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('risk-analysis-form-from-template')).toBeInTheDocument()
      })

      const submitButton = screen.getByTestId('submit-button')
      submitButton.click()

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            riskAnalysisForm: expect.objectContaining({
              version: '3.0',
            }),
          }),
          expect.any(Object)
        )
      })
    })

    it('should navigate to SUBSCRIBE_PURPOSE_SUMMARY on successful submit', async () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate({
          version: '2.0',
          answers: {},
        }),
      })
      const purpose = createMockPurpose({
        riskAnalysisForm: {
          version: '2.0',
          answers: {},
        },
      })
      const riskAnalysis = createMockRiskAnalysisFormConfig()

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: riskAnalysis })

      render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('risk-analysis-form-from-template')).toBeInTheDocument()
      })

      const submitButton = screen.getByTestId('submit-button')
      submitButton.click()

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled()
      })

      const mutationCall = mockMutate.mock.calls[0]
      expect(mutationCall).toBeDefined()
      expect(mutationCall[1]).toBeDefined()
      expect(mutationCall[1].onSuccess).toBeDefined()

      mutationCall[1].onSuccess()

      expect(mockNavigate).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_SUMMARY', {
        params: { purposeId: 'purpose-123' },
      })
    })

    it('should log error on failed submit', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate({
          version: '2.0',
          answers: {},
        }),
      })
      const purpose = createMockPurpose({
        riskAnalysisForm: {
          version: '2.0',
          answers: {},
        },
      })
      const riskAnalysis = createMockRiskAnalysisFormConfig()

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: riskAnalysis })

      render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('risk-analysis-form-from-template')).toBeInTheDocument()
      })

      const submitButton = screen.getByTestId('submit-button')
      submitButton.click()

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled()
      })

      const mutationCall = mockMutate.mock.calls[0]
      expect(mutationCall).toBeDefined()
      expect(mutationCall[1]).toBeDefined()
      expect(mutationCall[1].onError).toBeDefined()

      const testError = new Error('Test error')
      mutationCall[1].onError(testError)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to update purpose from template:',
        testError
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Cancel action', () => {
    it('should call back function when cancel is clicked', async () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate({
          version: '2.0',
          answers: {},
        }),
      })
      const purpose = createMockPurpose({
        riskAnalysisForm: {
          version: '2.0',
          answers: {},
        },
      })
      const riskAnalysis = createMockRiskAnalysisFormConfig()

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: riskAnalysis })

      render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('risk-analysis-form-from-template')).toBeInTheDocument()
      })

      const cancelButton = screen.getByTestId('cancel-button')
      cancelButton.click()

      expect(mockBack).toHaveBeenCalled()
    })
  })

  describe('Edge cases', () => {
    it('should handle empty purpose answers array', async () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate({
          version: '2.0',
        }),
      })
      purposeTemplate.purposeRiskAnalysisForm!.answers = {
        question1: createMockRiskAnalysisTemplateAnswer({
          id: 'answer-1',
          values: ['template-value'],
          editable: true,
          suggestedValues: [],
        }),
      }
      const purpose = createMockPurpose({
        riskAnalysisForm: {
          version: '2.0',
        },
      })
      purpose.riskAnalysisForm!.answers = {
        question1: [],
      }
      const riskAnalysis = createMockRiskAnalysisFormConfig({
        questions: [
          {
            id: 'question1',
            label: { it: 'Question 1', en: 'Question 1' },
            dataType: 'FREETEXT',
            visualType: 'text',
            required: true,
            defaultValue: [],
            dependencies: [],
          },
        ],
      })

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: riskAnalysis })

      render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('risk-analysis-form-from-template')).toBeInTheDocument()
      })

      const formProps = (RiskAnalysisFormFromTemplate as Mock).mock.calls[0][0]
      expect(formProps.defaultAnswers.question1.values).toEqual([])
    })

    it('should handle purpose answers that are not in questions map', async () => {
      const purposeTemplate = createMockPurposeTemplate({
        purposeRiskAnalysisForm: createMockRiskAnalysisFormTemplate({
          version: '2.0',
        }),
      })
      purposeTemplate.purposeRiskAnalysisForm!.answers = {
        question1: createMockRiskAnalysisTemplateAnswer({
          id: 'answer-1',
          values: ['template-value'],
          editable: true,
          suggestedValues: [],
        }),
      }
      const purpose = createMockPurpose({
        riskAnalysisForm: {
          version: '2.0',
        },
      })
      purpose.riskAnalysisForm!.answers = {
        question1: ['purpose-value'],
        questionNotInMap: ['value'],
      }
      const riskAnalysis = createMockRiskAnalysisFormConfig({
        questions: [
          {
            id: 'question1',
            label: { it: 'Question 1', en: 'Question 1' },
            dataType: 'FREETEXT',
            visualType: 'text',
            required: true,
            defaultValue: [],
            dependencies: [],
          },
        ],
      })

      ;(useQuery as Mock)
        .mockReturnValueOnce({ data: purposeTemplate })
        .mockReturnValueOnce({ data: purpose })
        .mockReturnValueOnce({ data: riskAnalysis })

      render(
        <PurposeFromTemplateEditStepRiskAnalysis
          back={mockBack}
          forward={() => {}}
          activeStep={0}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('risk-analysis-form-from-template')).toBeInTheDocument()
      })

      const formProps = (RiskAnalysisFormFromTemplate as Mock).mock.calls[0][0]
      expect(formProps.defaultAnswers.questionNotInMap).toBeUndefined()
    })
  })
})
