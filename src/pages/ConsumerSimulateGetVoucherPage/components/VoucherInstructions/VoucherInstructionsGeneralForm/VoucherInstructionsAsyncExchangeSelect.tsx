import React, { useEffect } from 'react'
import type { VoucherInstructionsGeneralFormValues } from './VoucherInstructionsGeneralForm'
import { ASYNC_EXCHANGE_STEP, MEMBER_TYPE } from './VoucherInstructionsGeneralForm'
import { useFormContext } from 'react-hook-form'
import { FormControl } from '@mui/material'
import { RHFSelect } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'

type VoucherProducerSimulationSectionForm = Pick<
  VoucherInstructionsGeneralFormValues,
  'memberType' | 'asyncExchangeStep'
>

export const VoucherInstructionsAsyncExchangeSelect: React.FC = () => {
  const { t } = useTranslation('voucher')
  const { watch, setValue } = useFormContext<VoucherProducerSimulationSectionForm>()

  const memberType = watch('memberType')
  const isMemberTypeProducer = memberType === MEMBER_TYPE.PRODUCER

  const asyncExchangeStepOptions = isMemberTypeProducer
    ? [
        {
          label: t('generalForm.asyncExchangeStep.callbackInvocation'),
          value: ASYNC_EXCHANGE_STEP.CALLBACK_INVOCATION,
        },
      ]
    : [
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
      ]

  useEffect(() => {
    if (isMemberTypeProducer) {
      setValue('asyncExchangeStep', ASYNC_EXCHANGE_STEP.CALLBACK_INVOCATION, {
        shouldValidate: true,
      })
    }
  }, [isMemberTypeProducer, setValue])

  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <RHFSelect
        required
        rules={{ required: true }}
        name="asyncExchangeStep"
        label={t('generalForm.asyncExchangeStep.label')}
        options={asyncExchangeStepOptions}
        disabled={isMemberTypeProducer}
      />
    </FormControl>
  )
}
