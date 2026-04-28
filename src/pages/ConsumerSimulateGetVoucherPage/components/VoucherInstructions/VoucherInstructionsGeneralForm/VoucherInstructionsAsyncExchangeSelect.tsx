import React from 'react'
import type { VoucherInstructionsGeneralFormValues } from './VoucherInstructionsGeneralForm'
import { ASYNC_EXCHANGE_STEP, INTERATION_TYPE } from './VoucherInstructionsGeneralForm'
import { useFormContext } from 'react-hook-form'
import { FormControl } from '@mui/material'
import { RHFSelect } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'

type VoucherProducerSimulationSectionForm = Pick<
  VoucherInstructionsGeneralFormValues,
  'interationType'
>

export const VoucherInstructionsAsyncExchangeSelect: React.FC = () => {
  const { t } = useTranslation('voucher')
  const { watch } = useFormContext<VoucherProducerSimulationSectionForm>()
  const interationType = watch('interationType') || INTERATION_TYPE.SYNC

  return (
    <>
      {interationType === INTERATION_TYPE.ASYNC && (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <RHFSelect
            required
            rules={{ required: true }}
            name="asyncExchangeStep"
            label={t('generalForm.asyncExchangeStep.label')}
            options={[
              {
                label: t('generalForm.asyncExchangeStep.startInteraction'),
                value: ASYNC_EXCHANGE_STEP.START_INTERACTION,
              },
              {
                label: t('generalForm.asyncExchangeStep.getResource'),
                value: ASYNC_EXCHANGE_STEP.GET_RESOURCE,
              },
              {
                label: t('generalForm.asyncExchangeStep.confirmation'),
                value: ASYNC_EXCHANGE_STEP.CONFIRMATION,
              },
            ]}
          />
        </FormControl>
      )}
    </>
  )
}
