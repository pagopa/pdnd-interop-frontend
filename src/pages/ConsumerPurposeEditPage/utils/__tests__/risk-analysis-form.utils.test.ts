import type { Dependency, FormConfigQuestion } from '@/api/api.generatedTypes'
import {
  getBackendAnswerValue,
  getFrontendAnswerValue,
  getRiskAnalysisDefaultValues,
  getUpdatedQuestions,
  getValidAnswers,
  isDependencySatisfied,
} from '../risk-analysis-form.utils'
import type { Answers } from '../../types/risk-analysis-form.types'

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
  describe('getFrontendAnswerValue', () => {
    it('should convert ["true"] to a boolean if the visual type of the question is switch', () => {
      const result1 = getFrontendAnswerValue(['true'], 'switch')
      expect(result1).toEqual(true)

      const result2 = getFrontendAnswerValue(['false'], 'switch')
      expect(result2).toEqual(false)

      const result3 = getFrontendAnswerValue(['true'], 'checkbox')
      expect(result3).not.toEqual(true)
    })

    it('should not do any conversion if the visual type of the question is checkbox', () => {
      const answer = ['TEST']
      const result = getFrontendAnswerValue(answer, 'checkbox')
      expect(result).toEqual(answer)
    })

    it('should take the first element of the array if the visual type of the question is different from switch and checkbox', () => {
      const result = getFrontendAnswerValue(['hello'], 'text')
      expect(result).toEqual('hello')
    })
  })

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

    it('should throw an error if an invalid type is passed', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(() => getBackendAnswerValue(1)).toThrow()
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
      const answers: Answers = {
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
      const answers: Answers = {
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
      const answers: Answers = {
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
      const answers: Answers = {
        'test-id': ['test-fail'],
      }
      const result = isDependencySatisfied(dependency, answers)
      expect(result).toEqual(false)
    })
  })

  describe('getUpdatedQuestions', () => {
    it('should filter out questions with not satisfied dependencies', () => {
      const answers: Answers = {
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
})
