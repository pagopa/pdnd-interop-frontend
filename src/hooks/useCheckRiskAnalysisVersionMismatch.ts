import type { Purpose } from '@/api/api.generatedTypes'
import { PurposeQueries } from '@/api/purpose'
import { useQuery } from '@tanstack/react-query'

/**
 * Check if the risk analysis version of the purpose is different from the risk analysis latest version.
 */
export function useCheckRiskAnalysisVersionMismatch(purpose: Purpose | undefined): boolean {
  const { data: latestRiskAnalysis } = useQuery(PurposeQueries.getRiskAnalysisLatest())

  return Boolean(
    !!purpose?.riskAnalysisForm &&
      latestRiskAnalysis &&
      purpose.riskAnalysisForm.version !== latestRiskAnalysis.version
  )
}
