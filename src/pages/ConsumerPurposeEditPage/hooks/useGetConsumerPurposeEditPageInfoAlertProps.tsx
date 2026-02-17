import type { AlertProps } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

export function useGetConsumerPurposeEditPageInfoAlertProps(
  dailyCalls: number,
  dailyCallsPerConsumer: number,
  dailyCallsTotal: number
): AlertProps | undefined {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit.loadEstimationSection.alerts' })

  return match({
    isDailyCallsPerConsumerExceed: dailyCalls > dailyCallsPerConsumer,
    isDailyCallsTotalExceed: dailyCalls > dailyCallsTotal,
  })
    .returnType<AlertProps | undefined>()
    .with({ isDailyCallsTotalExceed: true }, () => ({
      severity: 'info',
      children: t('infoDailyCallsTotalExceed'),
    }))
    .with({ isDailyCallsPerConsumerExceed: true }, () => ({
      severity: 'info',
      children: t('infoDailyCallsPerConsumerExceed'),
    }))
    .otherwise(() => undefined)
  /* @TODO - Add residual threshold cases */
}
