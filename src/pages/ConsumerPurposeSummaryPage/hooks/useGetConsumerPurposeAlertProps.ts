import type { Purpose } from '@/api/api.generatedTypes'
import type { AlertProps } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

export function useGetConsumerPurposeAlertProps(
  purpose: Purpose | undefined
): AlertProps | undefined {
  const { t } = useTranslation('purpose', { keyPrefix: 'summary.alerts' })

  if (!purpose) return

  return match({
    isAgreementArchived: purpose?.agreement.state === 'ARCHIVED',
    isEServiceDescriptorArchived: purpose?.eservice.descriptor.state === 'ARCHIVED',
  })
    .returnType<AlertProps | undefined>()
    .with({ isAgreementArchived: true }, { isEServiceDescriptorArchived: true }, () => ({
      severity: 'warning',
      children: t('descriptorOrAgreementArchived'),
    }))
    .otherwise(() => undefined)
}
