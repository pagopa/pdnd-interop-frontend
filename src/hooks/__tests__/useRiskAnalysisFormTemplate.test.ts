import { renderHook, act } from '@testing-library/react'
import { useRiskAnalysisFormTemplate } from '../useRiskAnalysisFormTemplate'
import type {
  RiskAnalysisFormConfig,
  RiskAnalysisTemplateAnswer,
  FormConfigQuestion,
} from '@/api/api.generatedTypes'
import type { RiskAnalysisAnswers } from '@/types/risk-analysis-form.types'

// Mock the utility functions
vi.mock('@/utils/risk-analysis-form.utils', () => ({
  getRiskAnalysisDefaultValues: vi.fn(
    (questions: FormConfigQuestion[], answers: Record<string, string[]> | undefined) => {
      const result: RiskAnalysisAnswers = {}
      questions.forEach((q: FormConfigQuestion) => {
        if (answers && answers[q.id]) {
          result[q.id] = answers[q.id][0] || ''
        } else if (q.defaultValue && q.defaultValue.length > 0) {
          result[q.id] = q.defaultValue[0]
        } else {
          result[q.id] = ''
        }
      })
      return result
    }
  ),
  getUpdatedQuestionsForTemplate: vi.fn(
    (
      answers: RiskAnalysisAnswers,
      questions: FormConfigQuestion[],
      _assignToTemplateUsers: Record<string, boolean>
    ) => {
      return questions.filter((_q: FormConfigQuestion) => {
        // Simple mock - return all questions for now
        return true
      })
    }
  ),
  getValidAnswers: vi.fn((questionIds: string[], answers: RiskAnalysisAnswers) => {
    const result: Record<string, string[]> = {}
    questionIds.forEach((id: string) => {
      if (answers[id]) {
        const value = answers[id]
        if (Array.isArray(value)) {
          result[id] = value
        } else if (typeof value === 'string') {
          result[id] = [value]
        } else {
          result[id] = [String(value)]
        }
      }
    })
    return result
  }),
}))

const mockRiskAnalysisConfig: RiskAnalysisFormConfig = {
  version: '1.0',
  questions: [
    {
      id: 'question-1',
      label: { it: 'Question 1', en: 'Question 1' },
      dataType: 'FREETEXT',
      required: true,
      defaultValue: [],
      dependencies: [],
      visualType: 'text',
    },
    {
      id: 'question-2',
      label: { it: 'Question 2', en: 'Question 2' },
      dataType: 'SINGLE',
      required: false,
      defaultValue: ['default-value'],
      dependencies: [],
      visualType: 'radio',
      hideOption: {},
    },
  ],
}

const mockDefaultAnswers: Record<string, RiskAnalysisTemplateAnswer> = {
  'question-1': {
    id: 'answer-1',
    values: ['existing-answer'],
    editable: false,
    annotation: {
      id: 'annotation-1',
      text: 'Test annotation',
      docs: [],
    },
    suggestedValues: ['suggested-1'],
  },
  'question-2': {
    id: 'answer-2',
    values: ['existing-choice'],
    editable: true,
    annotation: undefined,
    suggestedValues: [],
  },
}

describe('useRiskAnalysisFormTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('basic functionality', () => {
    it('should initialize with default values when no defaultAnswers provided', () => {
      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: mockRiskAnalysisConfig,
        })
      )

      expect(result.current.formState.isValid).toBeDefined()
      expect(result.current.questions).toBeDefined()
      expect(result.current.handleSubmit).toBeDefined()
    })

    it('should initialize with provided defaultAnswers', () => {
      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: mockRiskAnalysisConfig,
          defaultAnswers: mockDefaultAnswers,
        })
      )

      expect(result.current.formState.isValid).toBeDefined()
      expect(result.current.questions).toBeDefined()
      expect(result.current.handleSubmit).toBeDefined()
    })

    it('should handle extra fields', () => {
      const extraFields = { customField: 'custom-value' }

      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: mockRiskAnalysisConfig,
          extraFields,
        })
      )

      expect(result.current.formState.isValid).toBeDefined()
      expect(result.current.questions).toBeDefined()
      expect(result.current.handleSubmit).toBeDefined()
    })
  })

  describe('form state management', () => {
    it('should provide form methods', () => {
      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: mockRiskAnalysisConfig,
        })
      )

      expect(result.current.register).toBeDefined()
      expect(result.current.setValue).toBeDefined()
      expect(result.current.getValues).toBeDefined()
      expect(result.current.watch).toBeDefined()
      expect(result.current.reset).toBeDefined()
    })

    it('should handle form submission', async () => {
      const onSubmit = vi.fn()
      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: mockRiskAnalysisConfig,
        })
      )

      const handleSubmit = result.current.handleSubmit(onSubmit)

      await act(async () => {
        await handleSubmit()
      })

      expect(onSubmit).toHaveBeenCalled()
    })

    it('should handle form submission with error callback', async () => {
      const onSubmit = vi.fn()
      const onError = vi.fn()
      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: mockRiskAnalysisConfig,
        })
      )

      const handleSubmit = result.current.handleSubmit(onSubmit, onError)

      await act(async () => {
        await handleSubmit()
      })

      expect(onSubmit).toHaveBeenCalled()
    })
  })

  describe('questions computation', () => {
    it('should compute questions based on form values', () => {
      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: mockRiskAnalysisConfig,
          defaultAnswers: mockDefaultAnswers,
        })
      )

      expect(result.current.questions).toBeDefined()
      expect(Array.isArray(result.current.questions)).toBe(true)
    })

    it('should update questions when form values change', () => {
      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: mockRiskAnalysisConfig,
        })
      )

      act(() => {
        result.current.setValue('answers.question-1', 'new-value')
      })

      // Questions should be recomputed
      expect(result.current.questions).toBeDefined()
    })
  })

  describe('default values handling', () => {
    it('should create default assignToTemplateUsers from editable flags', () => {
      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: mockRiskAnalysisConfig,
          defaultAnswers: mockDefaultAnswers,
        })
      )

      const values = result.current.getValues()
      expect(values.assignToTemplateUsers).toBeDefined()
      expect(values.assignToTemplateUsers['question-1']).toBe(false)
      expect(values.assignToTemplateUsers['question-2']).toBe(true)
    })

    it('should create default annotations from backend data', () => {
      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: mockRiskAnalysisConfig,
          defaultAnswers: mockDefaultAnswers,
        })
      )

      const values = result.current.getValues()
      expect(values.annotations).toBeDefined()
      expect(values.annotations?.['question-1']).toEqual(
        mockDefaultAnswers['question-1'].annotation
      )
      expect(values.annotations?.['question-2']).toBeUndefined()
    })

    it('should create default answerIds from backend data', () => {
      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: mockRiskAnalysisConfig,
          defaultAnswers: mockDefaultAnswers,
        })
      )

      const values = result.current.getValues()
      expect(values.answerIds).toBeDefined()
      expect(values.answerIds?.['question-1']).toBe('answer-1')
      expect(values.answerIds?.['question-2']).toBe('answer-2')
    })

    it('should create default suggestedValues from backend data', () => {
      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: mockRiskAnalysisConfig,
          defaultAnswers: mockDefaultAnswers,
        })
      )

      const values = result.current.getValues()
      expect(values.suggestedValues).toBeDefined()
      expect(values.suggestedValues?.['question-1']).toEqual(['suggested-1'])
      expect(values.suggestedValues?.['question-2']).toBeUndefined()
    })
  })

  describe('edge cases', () => {
    it('should handle empty riskAnalysisConfig', () => {
      const emptyConfig: RiskAnalysisFormConfig = { version: '1.0', questions: [] }

      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: emptyConfig,
        })
      )

      expect(result.current.formState.isValid).toBeDefined()
      expect(result.current.questions).toEqual([])
    })

    it('should handle undefined defaultAnswers', () => {
      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: mockRiskAnalysisConfig,
          defaultAnswers: undefined,
        })
      )

      expect(result.current.formState.isValid).toBeDefined()
      expect(result.current.questions).toBeDefined()
    })

    it('should handle empty defaultAnswers', () => {
      const { result } = renderHook(() =>
        useRiskAnalysisFormTemplate({
          riskAnalysisConfig: mockRiskAnalysisConfig,
          defaultAnswers: {},
        })
      )

      expect(result.current.formState.isValid).toBeDefined()
      expect(result.current.questions).toBeDefined()
    })
  })
})
