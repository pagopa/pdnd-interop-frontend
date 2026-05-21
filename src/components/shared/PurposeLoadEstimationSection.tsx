import { Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { SectionContainer } from '@/components/layout/containers'
import { PurposeQueries } from '@/api/purpose'
import { ProviderThresholdsInfoAlert } from '@/components/shared/ProviderThresholdsInfoAlert'
import { useGetPurposeInfoAlert } from '@/hooks/useGetPurposeInfoAlert'

type PurposeLoadEstimationSectionProps = {
  purposeId: string
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
}

export function PurposeLoadEstimationSection({
  purposeId,
  dailyCallsPerConsumer,
  dailyCallsTotal,
}: PurposeLoadEstimationSectionProps) {
  const { t } = useTranslation('purpose')
  const { watch } = useFormContext<{ dailyCalls: number }>()

  const dailyCallsFormValue = watch('dailyCalls')

  const { data: remainingDailyCalls } = useQuery(
    PurposeQueries.getRemainingDailyCalls({ purposeId })
  )

  const alertProps = useGetPurposeInfoAlert({
    dailyCalls: dailyCallsFormValue,
    dailyCallsPerConsumer,
    dailyCallsTotal,
    remainingDailyCallsPerConsumer: remainingDailyCalls?.remainingDailyCallsPerConsumer,
    remainingDailyCallsTotal: remainingDailyCalls?.remainingDailyCallsTotal,
    keyPrefix: 'edit.loadEstimationSection.alerts',
    showFallback: false,
  })

  return (
    <SectionContainer
      title={t('edit.loadEstimationSection.title')}
      description={t('edit.loadEstimationSection.description')}
    >
      <RHFTextField
        name="dailyCalls"
        label={t('edit.loadEstimationSection.dailyCalls.label')}
        infoLabel={t('edit.loadEstimationSection.dailyCalls.infoLabel')}
        type="number"
        inputProps={{ min: '1' }}
        rules={{
          required: true,
          min: 1,
          validate: (value) =>
            Number.isInteger(Number(value)) ||
            t('edit.loadEstimationSection.dailyCalls.validation.integer'),
        }}
        required
      />
      {alertProps && <Alert {...alertProps} sx={{ mt: 1, mb: 3 }} />}
      <ProviderThresholdsInfoAlert
        dailyCallsPerConsumer={dailyCallsPerConsumer}
        dailyCallsTotal={dailyCallsTotal}
        remainingDailyCallsPerConsumer={remainingDailyCalls?.remainingDailyCallsPerConsumer}
        remainingDailyCallsTotal={remainingDailyCalls?.remainingDailyCallsTotal}
      />
    </SectionContainer>
  )
}
