import type { Purpose } from '@/api/api.generatedTypes'
import { useCheckRiskAnalysisVersionMismatch } from '@/hooks/useCheckRiskAnalysisVersionMismatch'
import type { AlertProps } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

export function useGetConsumerPurposeAlertProps(
  purpose: Purpose | undefined
): AlertProps | undefined {
  const { t } = useTranslation('purpose', { keyPrefix: 'summary.alerts' })
  const hasRiskAnalysisVersionMismatch = useCheckRiskAnalysisVersionMismatch(purpose)

  if (!purpose) return

  return match({
    hasRiskAnalysisVersionMismatch,
    isAgreementArchived: purpose?.agreement.state === 'ARCHIVED',
    isEServiceDescriptorArchived: purpose?.eservice.descriptor.state === 'ARCHIVED',
  })
    .returnType<AlertProps | undefined>()
    .with({ hasRiskAnalysisVersionMismatch: true }, () => ({
      severity: 'warning',
      children: t('newRiskAnalysisAvailable'),
    }))
    .with({ isAgreementArchived: true }, { isEServiceDescriptorArchived: true }, () => ({
      severity: 'warning',
      children: t('descriptorOrAgreementArchived'),
    }))
    .otherwise(() => undefined)
}
