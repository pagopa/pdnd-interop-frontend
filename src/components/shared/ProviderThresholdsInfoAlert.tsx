import { AlertTitle, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { GreyAlert } from '@/components/shared/GreyAlert'

type ProviderThresholdsInfoAlertProps = {
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  remainingDailyCallsPerConsumer?: number
  remainingDailyCallsTotal?: number
}

export function ProviderThresholdsInfoAlert({
  dailyCallsPerConsumer,
  dailyCallsTotal,
  remainingDailyCallsPerConsumer,
  remainingDailyCallsTotal,
}: ProviderThresholdsInfoAlertProps) {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'edit.loadEstimationSection.providerThresholdsInfo',
  })

  return (
    <GreyAlert>
      <AlertTitle sx={{ textTransform: 'uppercase', fontWeight: 700 }}>{t('label')}</AlertTitle>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={{ xs: 1, lg: 6 }}
        sx={{ mt: 0.5, mb: 1, flexWrap: 'wrap' }}
        alignItems={{ xs: 'flex-start', lg: 'center' }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>{t('dailyCallsPerConsumer.label')}</Typography>
          <Typography fontWeight={600}>
            {t('dailyCallsPerConsumer.value', {
              min: remainingDailyCallsPerConsumer ?? t('na'),
              max: dailyCallsPerConsumer,
            })}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>{t('dailyCallsTotal.label')}</Typography>
          <Typography fontWeight={600}>
            {t('dailyCallsTotal.value', {
              min: remainingDailyCallsTotal ?? t('na'),
              max: dailyCallsTotal,
            })}
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {t('description')}
      </Typography>
    </GreyAlert>
  )
}
