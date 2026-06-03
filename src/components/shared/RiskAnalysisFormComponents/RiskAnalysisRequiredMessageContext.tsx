import { createContext, useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import type { RiskAnalysisAnswers } from '@/types/risk-analysis-form.types'

const RiskAnalysisRequiredMessageContext = createContext<string | undefined>(undefined)

export const RiskAnalysisRequiredMessageProvider = RiskAnalysisRequiredMessageContext.Provider

/**
 * Returns the message to display for a risk-analysis question's error.
 *
 * When a required-message override is provided via context, it replaces the
 * default messages of the two rule types the RA form uses to enforce
 * "must be answered": `required` (for text/select/radio) and `validate`
 * (for checkbox and switch, whose required-ness is expressed via a custom
 * validator). Any other rule type — including manually set errors such as
 * the incompatible-answer error on `usesPersonalData`, or future
 * `pattern`/`min`/`max` rules — keeps its own message so the user still
 * sees the specific reason.
 */
export function useRiskAnalysisDisplayError(questionKey: string): string | undefined {
  const override = useContext(RiskAnalysisRequiredMessageContext)
  const { formState } = useFormContext<{ answers: RiskAnalysisAnswers }>()
  const errorObj = formState.errors.answers?.[questionKey]
  const rawMessage = errorObj?.message as string | undefined

  if (!override || !errorObj) return rawMessage
  if (errorObj.type === 'required' || errorObj.type === 'validate') return override
  return rawMessage
}
