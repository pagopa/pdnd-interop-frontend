import type { AlertProps } from '@mui/material'
import type { KeyPrefix } from 'i18next'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

export function useGetPurposeInfoAlert({
  dailyCalls,
  dailyCallsPerConsumer,
  dailyCallsTotal,
  remainingDailyCallsPerConsumer,
  remainingDailyCallsTotal,
  keyPrefix,
  showFallback,
}: {
  dailyCalls: number | undefined
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  remainingDailyCallsPerConsumer: number | undefined
  remainingDailyCallsTotal: number | undefined
  keyPrefix: KeyPrefix<'purpose'>
  showFallback?: boolean
}): AlertProps | undefined {
  const { t } = useTranslation('purpose', { keyPrefix })

  const fallbackAlert: AlertProps | undefined = showFallback
    ? { severity: 'info', children: t('infoApprovalMayBeRequired') }
    : undefined

  if (dailyCalls === undefined) {
    return fallbackAlert
  }

  const isDailyCallsMaximumReached = remainingDailyCallsTotal === 0

  const isDailyCallsTotalResidualExceed =
    remainingDailyCallsTotal !== undefined &&
    dailyCalls > remainingDailyCallsTotal &&
    dailyCalls < dailyCallsTotal

  const isDailyCallsPerConsumerResidualExceed =
    remainingDailyCallsPerConsumer !== undefined &&
    dailyCalls > remainingDailyCallsPerConsumer &&
    dailyCalls < dailyCallsPerConsumer

  const isDailyCallsTotalExceed = dailyCalls > dailyCallsTotal
  const isDailyCallsPerConsumerExceed = dailyCalls > dailyCallsPerConsumer

  return match({
    isDailyCallsMaximumReached,
    isDailyCallsTotalResidualExceed,
    isDailyCallsPerConsumerResidualExceed,
    isDailyCallsTotalExceed,
    isDailyCallsPerConsumerExceed,
  })
    .returnType<AlertProps | undefined>()
    .with({ isDailyCallsMaximumReached: true }, () => ({
      severity: 'info',
      children: t('infoDailyCallsMaximumReached'),
    }))
    .with({ isDailyCallsTotalResidualExceed: true }, () => ({
      severity: 'info',
      children: t('infoDailyCallsTotalResidualExceed'),
    }))
    .with({ isDailyCallsPerConsumerResidualExceed: true }, () => ({
      severity: 'info',
      children: t('infoDailyCallsPerConsumerResidualExceed'),
    }))
    .with({ isDailyCallsTotalExceed: true }, () => ({
      severity: 'info',
      children: t('infoDailyCallsTotalExceed'),
    }))
    .with({ isDailyCallsPerConsumerExceed: true }, () => ({
      severity: 'info',
      children: t('infoDailyCallsPerConsumerExceed'),
    }))
    .otherwise(() => fallbackAlert)
}
