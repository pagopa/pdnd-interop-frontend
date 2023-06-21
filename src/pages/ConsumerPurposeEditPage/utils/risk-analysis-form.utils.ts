import type {
  Dependency,
  FormConfigQuestion,
  HideOption,
  LabeledValue,
} from '@/api/api.generatedTypes'
import type { AnswerValue, Answers, Questions } from '../types/risk-analysis-form.types'
import type { InputOption, LangCode } from '@/types/common.types'
import type { TFunction } from 'i18next'

/**
 * Transform the answers from the backend to the frontend format
 * The answer from the backend arrives as an array of strings, but the frontend
 * needs a specific format depending on the `visualType` value.
 *
 * - `switch` needs a boolean
 * - `checkbox` needs an array of strings
 * - the rest needs a string
 *
 * @param backendAnswer The answer from the backend
 * @param question The question that the answer belongs to
 * @returns The answer in the type that the frontend needs
 */
export function getFrontendAnswerValue(
  backendAnswer: Array<string>,
  visualType?: FormConfigQuestion['visualType']
): AnswerValue {
  if (visualType === 'switch') {
    return backendAnswer[0] === 'true'
  }

  if (visualType === 'checkbox') {
    return backendAnswer
  }

  return backendAnswer[0]
}

/**
 * Transform the answers from the frontend to the backend format
 * The backend always needs an array of strings.
 *
 * @param answer The answer from the frontend
 * @returns The answer in the type that the backend needs
 * */
export function getBackendAnswerValue(answer: AnswerValue): Array<string> {
  if (typeof answer === 'boolean') {
    return [answer.toString()]
  }

  if (Array.isArray(answer)) {
    return answer
  }

  if (typeof answer === 'string') {
    return [answer]
  }

  throw new Error(`Invalid answer type: ${typeof answer} \n\n ${JSON.stringify(answer, null, 2)}`)
}

/**
 * Returns the valid answers that should be sent to the backend.
 * The answers that should be sent to the backend are only the answers
 * to the questions that are currently visible to the user.
 * The answers to the questions that are not visible to the user are not sent.
 *
 * @param currentQuestionsIds - the ids of the questions that are currently visible to the user
 * @param answers - the answers to all the questions
 * @returns the valid answers that should be sent to the backend
 * */
export function getValidAnswers(currentQuestionsIds: Array<string>, answers: Answers) {
  return Object.keys(answers).reduce<Record<string, Array<string>>>((acc, key) => {
    // If the question is actually visible, add it to the valid answers
    if (currentQuestionsIds.includes(key)) {
      return { ...acc, [key]: getBackendAnswerValue(answers[key]) }
    }
    return acc
  }, {})
}

/**
 * Returns true if the dependency is satisfied, false otherwise.
 *
 * @param dependency - the dependency
 * @param answers - the actual form values
 * @returns `true` if the dependency is satisfied, `false` otherwise
 * */
export function isDependencySatisfied(dependency: Dependency | HideOption, answers: Answers) {
  const answer = answers[dependency.id]
  if (Array.isArray(answer)) {
    return answer.includes(dependency.value)
  }

  return answer === dependency.value
}

/**
 * Returns the updated question data.
 *
 * @param answers - the actual form values
 * @param riskAnalysis - the risk analysis document
 *
 * @returns the updated questions data
 * */
export function getUpdatedQuestions(
  answers: Answers,
  riskAnalysisQuestions: FormConfigQuestion[]
): Questions {
  // Filters all the questions that not satisfies the dependency inside the "dependencies" property
  return riskAnalysisQuestions.reduce<Questions>((acc, question) => {
    const doesSatisfyDeps = question.dependencies.every((dependency) =>
      isDependencySatisfied(dependency, answers)
    )
    if (doesSatisfyDeps) {
      acc[question.id] = question
    }
    return acc
  }, {})
}

/**
 * Returns the default values for the risk analysis form.
 * The default values are the values that the form should have when it is first loaded.
 * The default values are the values that the user has already answered, if any.
 * If the user has not answered any question, the values are the default values
 * defined in the risk analysis document.
 *
 * @param riskAnalysisConfig the risk analysis document
 * @param backendAnswers the answers data, taken from the Purpose
 * @returns the default values for the risk analysis form
 */
export function getRiskAnalysisDefaultValues(
  riskAnalysisConfigQuestions: FormConfigQuestion[],
  backendAnswers?: Record<string, Array<string>>
): Answers {
  return riskAnalysisConfigQuestions.reduce<Answers>((acc, question) => {
    const answer = backendAnswers?.[question.id] ?? question.defaultValue
    acc[question.id] = getFrontendAnswerValue(answer, question.visualType)

    if (!acc[question.id] && question.dataType === 'FREETEXT') {
      acc[question.id] = ''
    }

    return acc
  }, {})
}

/**
 * Returns the formatted label for the risk analysis input.
 *
 * @param label - the label to format
 * @param lang - the current active language
 * @param t - the translation function
 * @returns the formatted label for the risk analysis input
 */
export function formatRiskAnalysisInputLabel(
  question: FormConfigQuestion,
  lang: LangCode,
  t: TFunction<'purpose'>
) {
  const isRequired = question.required
  const isMultipleChoice = question.dataType === 'MULTI'

  let label = question.label[lang]

  const labelValidation: Array<string> = []

  if (isRequired) {
    labelValidation.push(t('edit.step2.validation.required'))
  }

  if (isMultipleChoice) {
    labelValidation.push(t('edit.step2.validation.multipleChoice'))
  }

  if (labelValidation.length > 0) {
    label += ` (${labelValidation.join(', ')})`
  }

  return label
}

/**
 * Returns the formatted info label for the risk analysis input.
 * The info label is the text that appears below section title.
 *
 * @param question - the question
 * @param lang - the current active language
 * @returns the formatted info label for the risk analysis input
 */
export function formatRiskAnalysisInputInfoLabel(question: FormConfigQuestion, lang: LangCode) {
  return question.infoLabel && question.infoLabel[lang]
}

/**
 * Returns the formatted validation info label for the risk analysis input.
 * The info label is the text that appears below the input.
 *
 * @param question - the question
 * @param t - the translation function
 * @returns the formatted validatio info label for the risk analysis input
 */
export function formatRiskAnalysisInputValidationInfoLabel(
  question: FormConfigQuestion,
  t: TFunction<'purpose'>
) {
  const maxLength = question.validation?.maxLength

  if (maxLength) {
    return t('edit.step2.validation.maxLength', { num: maxLength })
  }
}

/**
 * Returns the options for the risk analysis input.
 * If the question has the property "hideOption" and the conditions are satisfied
 * the option will be not added to the array of options.
 *
 * @param question - the question
 * @param answers - the actual form values
 * @param lang - the current active language
 * @returns the options for the risk analysis input
 * */
export function getRiskAnalysisInputOptions(
  question: FormConfigQuestion,
  answers: Answers,
  lang: LangCode
) {
  const { options = [], hideOption } = question
  function shouldHideOption(option: LabeledValue) {
    // if the key "hideOption" is present in the question object and the conditions are satisfied
    // the option will be not added to the array of options
    return hideOption?.[option.value]?.some((dep) => isDependencySatisfied(dep, answers))
  }

  return options.reduce<Array<InputOption>>((acc, option) => {
    if (!shouldHideOption(option)) {
      acc.push({
        label: option.label[lang],
        value: option.value,
      })
    }
    return acc
  }, [])
}
