import { formatThousands } from '@/utils/format.utils'
import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ProviderPurposeDetailsDailyCallsThresholdsCardProps = {
  dailyCallsTotal: number
  dailyCallsPerConsumer: number
}

export const ProviderPurposeDetailsDailyCallsThresholdsCard: React.FC<
  ProviderPurposeDetailsDailyCallsThresholdsCardProps
> = ({ dailyCallsTotal, dailyCallsPerConsumer }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'providerView.sections.loadEstimate.thresholdsCard',
  })

  return (
    <Card
      elevation={8}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        sx={{ px: 3, pt: 3, pb: 1 }}
        disableTypography={true}
        title={
          <Stack spacing={1}>
            <Typography variant="sidenav">{t('title')}</Typography>
            <Typography color="text.secondary" variant="body2">
              {t('subtitle')}
            </Typography>
          </Stack>
        }
      />
      <CardContent sx={{ px: 3, pt: 1 }}>
        <Stack direction="row" spacing={3}>
          <Stack direction="column" flex={1}>
            <Typography variant="h4">{formatThousands(dailyCallsPerConsumer)}</Typography>
            <Typography variant="body2">{t('dailyCallsPerConsumerField.label')}</Typography>
          </Stack>
          <Stack direction="column" flex={1}>
            <Typography variant="h4">{formatThousands(dailyCallsTotal)}</Typography>
            <Typography variant="body2">{t('dailyCallsTotalsField.label')}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
