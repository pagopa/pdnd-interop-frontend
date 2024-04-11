import type { AlertProps } from '@mui/material'
import { useTranslation } from 'react-i18next'

type AlertResponse = {
  severity: AlertProps['severity']
  content: AlertProps['children']
}
function useGetRiskAnalysisVersionAlertProps({
  purposeRiskAnalysisVersion,
  latestRiskAnalysisVersion,
}: {
  purposeRiskAnalysisVersion?: string
  latestRiskAnalysisVersion?: string
}): Array<AlertResponse> {
  const { t } = useTranslation('purpose', { keyPrefix: 'summary' })
  let alertProps: Array<AlertResponse> = [
    {
      severity: 'info',
      content: t('clientsAlert'),
    },
  ]

  if (!purposeRiskAnalysisVersion || !latestRiskAnalysisVersion) return alertProps

  if (purposeRiskAnalysisVersion !== latestRiskAnalysisVersion) {
    alertProps = [
      ...alertProps,
      {
        severity: 'warning',
        content: t('obsoleteRiskAnalysisAlert'),
      },
    ]
  }

  return alertProps
}

export default useGetRiskAnalysisVersionAlertProps
