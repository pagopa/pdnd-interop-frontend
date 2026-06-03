import { createContext, useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import type { RiskAnalysisAnswers } from '@/types/risk-analysis-form.types'

const RiskAnalysisRequiredMessageContext = createContext<string | undefined>(undefined)

export const RiskAnalysisRequiredMessageProvider = RiskAnalysisRequiredMessageContext.Provider

/**
 * Returns the message to display for a risk-analysis question's error.
 *
 * When a required-message override is provided via context, it replaces the
 * default messages for `required` and `validate` rules (the two rule types
 * used by the RA form to enforce "must be answered"). Manual errors —
 * e.g. the incompatible-answer error on `usesPersonalData` — keep their own
 * message so the user still sees the specific reason.
 */
export function useRiskAnalysisDisplayError(questionKey: string): string | undefined {
  const override = useContext(RiskAnalysisRequiredMessageContext)
  const { formState } = useFormContext<{ answers: RiskAnalysisAnswers }>()
  const errorObj = formState.errors.answers?.[questionKey]
  const rawMessage = errorObj?.message as string | undefined

  if (!override || !errorObj) return rawMessage
  if (errorObj.type === 'manual') return rawMessage
  return override
}
