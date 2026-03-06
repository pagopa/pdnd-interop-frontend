import type { AlertProps } from '@mui/material'
import type { KeyPrefix } from 'i18next'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

export function useGetPurposeInfoAlert({
  dailyCalls,
  dailyCallsPerConsumer,
  dailyCallsTotal,
  updatedDailyCallsPerConsumer,
  updatedDailyCallsTotal,
  keyPrefix,
  showFallback,
}: {
  dailyCalls: number | undefined
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  updatedDailyCallsPerConsumer: number | undefined
  updatedDailyCallsTotal: number | undefined
  keyPrefix: KeyPrefix<'purpose'>
  showFallback?: boolean
}): AlertProps | undefined {
  const { t } = useTranslation('purpose', { keyPrefix })

  if (dailyCalls === undefined) {
    return showFallback === true
      ? {
          severity: 'info',
          children: t('infoApprovalMayBeRequired'),
        }
      : undefined
  }

  const isDailyCallsMaximumReached =
    updatedDailyCallsPerConsumer === 0 || updatedDailyCallsTotal === 0

  const isDailyCallsTotalResidualExceed =
    updatedDailyCallsTotal !== undefined && dailyCalls > updatedDailyCallsTotal

  const isDailyCallsPerConsumerResidualExceed =
    updatedDailyCallsPerConsumer !== undefined && dailyCalls > updatedDailyCallsPerConsumer

  const isDailyCallsTotalExceed = dailyCalls > dailyCallsTotal
  const isDailyCallsPerConsumerExceed = dailyCalls > dailyCallsPerConsumer

  return match({
    isDailyCallsMaximumReached,
    isDailyCallsTotalResidualExceed,
    isDailyCallsPerConsumerResidualExceed,
    isDailyCallsTotalExceed,
    isDailyCallsPerConsumerExceed,
    showFallback,
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
    .with({ showFallback: true }, () => ({
      severity: 'info',
      children: t('infoApprovalMayBeRequired'),
    }))
    .otherwise(() => undefined)
}
