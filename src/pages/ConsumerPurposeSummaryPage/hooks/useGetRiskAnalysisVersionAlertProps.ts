import { PurposeQueries } from '@/api/purpose'
import type { AlertProps } from '@mui/material'
import { useTranslation } from 'react-i18next'

type AlertResponse = {
  severity: AlertProps['severity']
  content: AlertProps['children']
  isRiskAnalysisVersionObsolete?: boolean
}
function useGetPurposeSummaryAlertProps(purposeId: string): AlertResponse | undefined {
  const { t } = useTranslation('purpose', { keyPrefix: 'summary' })

  const { data: purpose, isInitialLoading } = PurposeQueries.useGetSingle(purposeId, {
    suspense: false,
  })

  const { data: riskAnalysis, isInitialLoading: isRiskAnalysisLoading } =
    PurposeQueries.useGetRiskAnalysisLatest({
      suspense: false,
    })

  if (isInitialLoading || isRiskAnalysisLoading) return undefined

  /* 
    If latestRiskAnalysisVersion is not the same of purpose risk analysis version, this mean that riskAnalysis is obsolete 
    so ui need disabled edit and publish buttons
  */
  if (purpose?.riskAnalysisForm?.version !== riskAnalysis?.version) {
    return {
      severity: 'warning',
      content: t('obsoleteRiskAnalysisAlert'),
      isRiskAnalysisVersionObsolete: true,
    }
  }

  return {
    severity: 'info',
    content: t('clientsAlert'),
    isRiskAnalysisVersionObsolete: false,
  }
}

export default useGetPurposeSummaryAlertProps
