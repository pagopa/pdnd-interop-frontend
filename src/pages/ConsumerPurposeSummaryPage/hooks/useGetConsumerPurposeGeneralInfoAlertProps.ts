import type { Purpose } from '@/api/api.generatedTypes'
import type { AlertProps } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

export function useGetConsumerPurposeGeneralInfoAlertProps(
  purpose: Purpose | undefined
): AlertProps {
  const { t } = useTranslation('purpose', { keyPrefix: 'summary.alerts' })

  if (!purpose?.currentVersion?.dailyCalls) {
    return {
      severity: 'info',
      children: t('infoApprovalMayBeRequired'),
    }
  }

  const dailyCalls = purpose.currentVersion.dailyCalls
  const dailyCallsPerConsumer = purpose.dailyCallsPerConsumer
  const dailyCallsTotal = purpose.dailyCallsTotal

  return match({
    isDailyCallsPerConsumerExceed: dailyCalls > dailyCallsPerConsumer,
    isDailyCallsTotalExceed: dailyCalls > dailyCallsTotal,
  })
    .returnType<AlertProps>()
    .with({ isDailyCallsTotalExceed: true }, () => ({
      severity: 'info',
      children: t('infoDailyCallsTotalExceed'),
    }))
    .with({ isDailyCallsPerConsumerExceed: true }, () => ({
      severity: 'info',
      children: t('infoDailyCallsPerConsumerExceed'),
    }))
    .otherwise(() => ({
      severity: 'info',
      children: t('infoApprovalMayBeRequired'),
    }))
}
