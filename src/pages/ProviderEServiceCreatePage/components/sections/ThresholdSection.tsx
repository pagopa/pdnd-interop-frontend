import { SectionContainer } from '@/components/layout/containers'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Stack } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export const ThresholdSection: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { watch } = useFormContext()

  const dailyCallsPerConsumer = watch('dailyCallsPerConsumer')

  return (
    <SectionContainer title={t('step2.thresholdSection.title')} sx={{ mt: 3 }}>
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <RHFTextField
          size="small"
          name="dailyCallsPerConsumer"
          label={t('step2.thresholdSection.dailyCallsPerConsumerField.label')}
          type="number"
          inputProps={{ min: '1' }}
          rules={{ required: true, min: 1 }}
          sx={{ my: 0, flex: 1 }}
        />
        <RHFTextField
          size="small"
          name="dailyCallsTotal"
          label={t('step2.thresholdSection.dailyCallsTotalField.label')}
          type="number"
          inputProps={{ min: '1' }}
          sx={{ my: 0, flex: 1 }}
          rules={{
            required: true,
            min: {
              value: dailyCallsPerConsumer ?? 1,
              message: t('step2.thresholdSection.dailyCallsTotalField.validation.min'),
            },
          }}
        />
      </Stack>
    </SectionContainer>
  )
}
