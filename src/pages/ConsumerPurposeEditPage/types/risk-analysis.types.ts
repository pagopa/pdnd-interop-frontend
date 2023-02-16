import type { LangCode } from '@/types/common.types'
import type { TFunction } from 'i18next'
import { UseFormReturn } from 'react-hook-form'
import type { AnyObjectSchema } from 'yup'

export type MultiLangEntry = {
  it: string
  en: string
}

export type Dependency = {
  id: string
  value: unknown
}

export type QuestionV1 = {
  id: string
  label: MultiLangEntry
  defaultValue: AnswerValue
  options?: Array<{
    label: MultiLangEntry
    value: string
  }>
  dependencies: Array<Dependency>
  type: 'text' | 'radio' | 'checkbox' | 'select-one'
  infoLabel?: MultiLangEntry
  required: boolean
}

export type QuestionV2 = {
  id: string
  /**
   * The HTML5 input type
   */
  type: 'text' | 'radio' | 'checkbox' | 'select-one' | 'switch'
  /**
   * Used for backend validation
   */
  dataType: 'single' | 'multi' | 'freeText'
  label: MultiLangEntry
  defaultValue: AnswerValue
  options?: Array<{
    label: MultiLangEntry
    value: string
  }>
  dependencies: Array<Dependency>
  /**
   * Declares the dependency of the state of one of its own option if the user
   * sets a specific value in another question.
   * EX:
   *
   * ```ts
   * {
   *   PREPARE_ICE_CREAM: [
   *     {
   *       id: "hasMilk",
   *       value: false,
   *     }
   *   ]
   * }
   * ```
   *
   * If the user sets the value false to the "hasMilk" question, the option "PREPARE_ICE_CREAN"
   * will be hidden
   *
   */
  hideOption?: Record<string, Array<Dependency>>
  infoLabel?: MultiLangEntry
  required: boolean
  validation?: {
    maxLength?: number
  }
}

export type Question = QuestionV1 | QuestionV2

export type RiskAnalysis = {
  version: string
  questions: Array<Question>
}

export type GetUpdatedQuestions = (
  values: Record<string, unknown>,
  riskAnalysis: RiskAnalysis
) => Questions

export type GetUpdatedValidation = (
  questionsObj: Questions,
  t: TFunction<'purpose'>
) => AnyObjectSchema

export type BuildForm = (
  questions: Questions,
  formMethods: UseFormReturn<Answers>,
  lang: LangCode,
  t: TFunction<'purpose'>
) => { formComponents: Array<React.ReactNode>; isSubmitBtnDisabled: boolean }

export type DynamicFormOperations = Record<
  string,
  {
    /**
     * Returns the updated question data.
     *
     * @param values - the actual form values
     * @param riskAnalysis - the risk analysis document
     *
     * @returns the updated questions data
     * */
    getUpdatedQuestions: GetUpdatedQuestions
    /**
     * Returns the updated form components.
     *
     * @param questions - the actual updated questions visible to the user
     * @param formik - formik object
     * @param lang - the actual active language
     * @param t - the TFunction of nexti18 internalization library
     *
     * @returns Array of components that should be rendered inside the form
     * */
    buildForm: BuildForm
  }
>

export type AnswerValue = string | Array<string> | boolean
export type Questions = Record<string, Question>
export type Answers = Record<string, AnswerValue>
