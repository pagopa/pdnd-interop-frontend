import type { Dependency, FormConfigQuestion } from '@/api/api.generatedTypes'
import {
  formatRiskAnalysisInputLabel,
  getBackendAnswerValue,
  getRiskAnalysisDefaultValues,
  getRiskAnalysisInputOptions,
  getUpdatedQuestions,
  getValidAnswers,
  isDependencySatisfied,
} from '../risk-analysis-form.utils'
import type { RiskAnalysisAnswers } from '../../types/risk-analysis-form.types'
import type { TFunction } from 'i18next'

const _questions: Partial<FormConfigQuestion>[] = [
  {
    id: 'test-id',
    dependencies: [],
    dataType: 'FREETEXT',
    defaultValue: [],
  },
  {
    id: 'test-id-2',
    dataType: 'MULTI',
    defaultValue: ['TEST_DEFAULT'],
    dependencies: [
      {
        id: 'test-id',
        value: 'test-dep-fail',
      },
    ],
  },
  {
    id: 'test-id-3',
    dataType: 'SINGLE',
    defaultValue: ['TEST_DEFAULT_2'],
    dependencies: [
      {
        id: 'test-id',
        value: 'test',
      },
    ],
  },
]

const questions = _questions as FormConfigQuestion[]

describe('Risk analysis form utils', () => {
  describe('getBackendAnswerValue', () => {
    it('should create an array the stringified boolean if a boolean is passed', () => {
      const result1 = getBackendAnswerValue(true)
      expect(result1).toEqual(['true'])

      const result2 = getBackendAnswerValue(false)
      expect(result2).toEqual(['false'])
    })

    it('should return the array as is if an array is passed', () => {
      const result = getBackendAnswerValue(['hello', 'goodbye'])
      expect(result).toEqual(['hello', 'goodbye'])
    })

    it('should create an array with passed value if a string is passed', () => {
      const result = getBackendAnswerValue('hello')
      expect(result).toEqual(['hello'])
    })

    it('should return an empty array if an invalid type is passed', () => {
      // @ts-expect-error Testing invalid type
      const result = getBackendAnswerValue(1)
      expect(result).toEqual([])
    })
  })

  describe('getValidAnswers', () => {
    it('should filter out answers with key not included in the current questions', () => {
      const currentQuestionsIds = ['id-1', 'id-2']
      const currentAnswersIds = {
        'id-1': 'test',
        'id-2': 'test',
        'id-3': 'test',
      }
      const result1 = getValidAnswers(currentQuestionsIds, currentAnswersIds)
      expect(Object.keys(result1)).not.toContain('id-3')
    })
  })

  describe('isDependencySatisfied', () => {
    it('should return true if the dependency is satisfied with an answer of type array', () => {
      const dependency: Dependency = {
        id: 'test-id',
        value: 'test',
      }
      const answers: RiskAnalysisAnswers = {
        'test-id': ['test'],
      }
      const result = isDependencySatisfied(dependency, answers)
      expect(result).toEqual(true)
    })

    it('should return true if the dependency is satisfied with an answer of type string', () => {
      const dependency: Dependency = {
        id: 'test-id',
        value: 'test',
      }
      const answers: RiskAnalysisAnswers = {
        'test-id': 'test',
      }
      const result = isDependencySatisfied(dependency, answers)
      expect(result).toEqual(true)
    })

    it('should return false if the dependency is not satisfied with an answer of type string', () => {
      const dependency: Dependency = {
        id: 'test-id',
        value: 'test',
      }
      const answers: RiskAnalysisAnswers = {
        'test-id': 'test-fail',
      }
      const result = isDependencySatisfied(dependency, answers)
      expect(result).toEqual(false)
    })

    it('should return false if the dependency is not satisfied with an answer of type array', () => {
      const dependency: Dependency = {
        id: 'test-id',
        value: 'test',
      }
      const answers: RiskAnalysisAnswers = {
        'test-id': ['test-fail'],
      }
      const result = isDependencySatisfied(dependency, answers)
      expect(result).toEqual(false)
    })
  })

  describe('getUpdatedQuestions', () => {
    it('should filter out questions with not satisfied dependencies', () => {
      const answers: RiskAnalysisAnswers = {
        'test-id': 'test',
        'test-id-2': 'test-2',
        'test-id-3': ['test-3'],
      }
      const result = getUpdatedQuestions(answers, questions)
      expect(Object.keys(result)).not.toContain('test-id-2')
    })
  })

  describe('getRiskAnalysisDefaultValues', () => {
    it('should take the answers from the ones that comes from the backend', () => {
      const backendAnswers: Record<string, string[]> = {
        'test-id': ['test'],
        'test-id-2': ['test-2'],
        'test-id-3': ['test-3'],
      }
      const result = getRiskAnalysisDefaultValues(questions, backendAnswers)
      expect(result).toEqual({
        'test-id': 'test',
        'test-id-2': 'test-2',
        'test-id-3': 'test-3',
      })
    })

    it('should take the answer value from the default values if it is missing from the backend answers', () => {
      const backendAnswers: Record<string, string[]> = {
        'test-id': ['test'],
        'test-id-3': ['test-3'],
      }
      const result = getRiskAnalysisDefaultValues(questions, backendAnswers)
      expect(result['test-id-2']).toEqual('TEST_DEFAULT')
    })

    it('should put an empty string as answer value if the question has no default values and is a free text', () => {
      const backendAnswers: Record<string, string[]> = {
        'test-id-3': ['test-3'],
      }
      const result = getRiskAnalysisDefaultValues(questions, backendAnswers)
      expect(result['test-id']).toEqual('')
    })
  })

  const tSharedComponentsMock = ((str: string) => str) as TFunction<'shared-components'>

  describe('formatRiskAnalysisInputLabel', () => {
    it('should contain the required label if the question is required', () => {
      const question = {
        label: { it: 'test' },
        dataType: 'FREETEXT',
        required: true,
      } as FormConfigQuestion

      const result = formatRiskAnalysisInputLabel(question, 'it', tSharedComponentsMock)

      expect(result).toContain('riskAnalysis.formComponents.validation.required')
    })

    it('should contain the multiple choice label if the question is of multiple choices', () => {
      const question = {
        label: { it: 'test' },
        dataType: 'MULTI',
        required: false,
      } as FormConfigQuestion

      const result = formatRiskAnalysisInputLabel(question, 'it', tSharedComponentsMock)

      expect(result).toContain('riskAnalysis.formComponents.validation.multipleChoice')
    })

    it('should both required and multiple choice labels separated by a comma if the question has both', () => {
      const question = {
        label: { it: 'test' },
        dataType: 'MULTI',
        required: true,
      } as FormConfigQuestion

      const result = formatRiskAnalysisInputLabel(
        question,
        'it',
        ((str: string) => str) as TFunction<'shared-components'>
      )

      expect(result).toContain(
        'riskAnalysis.formComponents.validation.required, riskAnalysis.formComponents.validation.multipleChoice'
      )
    })
  })

  describe('getRiskAnalysisInputOptions', () => {
    it('should filter out the options that have one of the hideOption dependencies satisfied', () => {
      const question = {
        options: [
          { value: 'option-1', label: { it: 'option-1', en: 'option-1' } },
          { value: 'option-2', label: { it: 'option-2', en: 'option-2' } },
        ],
        hideOption: {
          'option-1': [{ value: 'test', id: 'test-1' }],
        },
      } as unknown as FormConfigQuestion

      const answers = {
        'test-1': 'test',
      }

      const result = getRiskAnalysisInputOptions(question, answers, 'it')
      expect(result.length).toBe(1)
    })
  })
})
