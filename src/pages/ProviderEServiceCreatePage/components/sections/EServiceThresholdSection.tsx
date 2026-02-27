import { SectionContainer } from '@/components/layout/containers'
import { GreyAlert } from '@/components/shared/GreyAlert'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Grid, Stack, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type EServiceThresholdSectionProps = {
  limitsSuggestions?: {
    dailyCallsPerConsumer: number
    dailyCallsTotal: number
  }
}

export const EServiceThresholdSection: React.FC<EServiceThresholdSectionProps> = ({
  limitsSuggestions,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step2.thresholdSection' })
  const { watch } = useFormContext()

  const dailyCallsPerConsumer = watch('dailyCallsPerConsumer')

  return (
    <SectionContainer title={t('title')} sx={{ mt: 3 }}>
      <Stack spacing={4} sx={{ mt: 3 }}>
        <Stack direction="row" spacing={2}>
          <RHFTextField
            size="small"
            name="dailyCallsPerConsumer"
            label={t('dailyCallsPerConsumerField.label')}
            type="number"
            inputProps={{ min: '1' }}
            rules={{ required: true, min: 1 }}
            sx={{ my: 0, flex: 1 }}
          />
          <RHFTextField
            size="small"
            name="dailyCallsTotal"
            label={t('dailyCallsTotalField.label')}
            type="number"
            inputProps={{ min: '1' }}
            sx={{ my: 0, flex: 1 }}
            rules={{
              required: true,
              min: {
                value: dailyCallsPerConsumer ?? 1,
                message: t('dailyCallsTotalField.validation.min'),
              },
            }}
          />
        </Stack>

        {limitsSuggestions && (
          <GreyAlert>
            <Stack>
              <Typography variant="overline">{t('limitsSuggestionAlert.title')}</Typography>
              <Grid container>
                <Grid item xs={3}>
                  <Typography variant="caption">
                    {t('limitsSuggestionAlert.labelDailyCallsPerConsumer')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="caption-semibold">
                    {t('limitsSuggestionAlert.labelForValue', {
                      threshold: limitsSuggestions.dailyCallsPerConsumer,
                    })}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="caption">
                    {t('limitsSuggestionAlert.labelDailyTotal')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="caption-semibold">
                    {t('limitsSuggestionAlert.labelForValue', {
                      threshold: limitsSuggestions.dailyCallsTotal,
                    })}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </GreyAlert>
        )}
      </Stack>
    </SectionContainer>
  )
}
