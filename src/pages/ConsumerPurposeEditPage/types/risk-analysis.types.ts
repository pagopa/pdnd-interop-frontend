import type { FormConfigQuestion, RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import type { LangCode } from '@/types/common.types'
import type { TFunction } from 'i18next'
import type { UseFormReturn } from 'react-hook-form'

export type GetUpdatedQuestions = (
  values: Record<string, unknown>,
  riskAnalysis: RiskAnalysisFormConfig
) => Questions

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
export type Questions = Record<string, FormConfigQuestion>
export type Answers = Record<string, AnswerValue>
