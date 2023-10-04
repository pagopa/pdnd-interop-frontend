import React from 'react'
import { Box } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFRadioGroup, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { StepActions } from '@/components/shared/StepActions'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { PurposeMutations } from '@/api/purpose'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import type { Purpose, PurposeUpdateContent } from '@/api/api.generatedTypes'
import SaveIcon from '@mui/icons-material/Save'

export type PurposeEditStep1GeneralFormValues = Omit<
  PurposeUpdateContent,
  'riskAnalysisForm' | 'isFreeOfCharge' | 'eserviceId'
> & {
  dailyCalls: number
  isFreeOfCharge: 'SI' | 'NO'
}

type PurposeEditStep1GeneralFormProps = ActiveStepProps & {
  purpose: Purpose
  defaultValues: PurposeEditStep1GeneralFormValues
}

const PurposeEditStep1GeneralForm: React.FC<PurposeEditStep1GeneralFormProps> = ({
  purpose,
  defaultValues,
  forward,
}) => {
  const { t } = useTranslation('purpose')
  const { mutate: updateDraft } = PurposeMutations.useUpdateDraft()
  const { mutate: updateDraftForReceive } = PurposeMutations.useUpdateDraftForReceiveEService()

  const formMethods = useForm<PurposeEditStep1GeneralFormValues>({
    defaultValues,
  })

  const onSubmit = (values: PurposeEditStep1GeneralFormValues) => {
    const { dailyCalls, isFreeOfCharge, freeOfChargeReason, ...updateDraftPayload } = values
    const isFreeOfChargeBool = isFreeOfCharge === 'SI'
    const purposeId = purpose.id

    // The endpoint to call depends on whether the e-service is
    // in RECEIVE or DELIVER mode
    const isReceive = !!purpose.riskAnalysisId

    const requestPayload = {
      ...updateDraftPayload,
      isFreeOfCharge: isFreeOfChargeBool,
      freeOfChargeReason: isFreeOfChargeBool ? freeOfChargeReason : undefined,
      purposeId,
      dailyCalls: dailyCalls,
    }

    if (isReceive) {
      updateDraftForReceive(requestPayload, { onSuccess: forward })
    } else {
      updateDraft(
        { ...requestPayload, riskAnalysisForm: purpose.riskAnalysisForm },
        { onSuccess: forward }
      )
    }
  }

  const isFreeOfCharge = formMethods.watch('isFreeOfCharge')

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer newDesign title={t('edit.step1.title')}>
          <RHFTextField
            name="title"
            label={t('edit.step1.nameField.label')}
            infoLabel={t('edit.step1.nameField.infoLabel')}
            focusOnMount
            inputProps={{ maxLength: 60 }}
            rules={{ required: true, minLength: 5 }}
          />

          <RHFTextField
            name="description"
            label={t('edit.step1.descriptionField.label')}
            infoLabel={t('edit.step1.descriptionField.infoLabel')}
            multiline
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
          />

          <RHFRadioGroup
            name="isFreeOfCharge"
            label={t('edit.step1.isFreeOfChargeField.label')}
            options={[
              { label: t('edit.step1.isFreeOfChargeField.options.SI'), value: 'SI' },
              { label: t('edit.step1.isFreeOfChargeField.options.NO'), value: 'NO' },
            ]}
          />

          {isFreeOfCharge === 'SI' && (
            <RHFTextField
              name="freeOfChargeReason"
              label={t('edit.step1.freeOfChargeReasonField.label')}
              infoLabel={t('edit.step1.freeOfChargeReasonField.infoLabel')}
              multiline
              inputProps={{ maxLength: 250 }}
              rules={{ required: true, minLength: 10 }}
            />
          )}

          <RHFTextField
            name="dailyCalls"
            label={t('edit.step1.dailyCallsField.label')}
            type="number"
            inputProps={{ min: '1' }}
            sx={{ mb: 0 }}
            rules={{ required: true, min: 1 }}
          />
        </SectionContainer>
        <StepActions
          back={{ to: 'SUBSCRIBE_PURPOSE_LIST', label: t('backToPurposeListBtn'), type: 'link' }}
          forward={{ label: t('edit.forwardWithSaveBtn'), type: 'submit', startIcon: <SaveIcon /> }}
        />
      </Box>
    </FormProvider>
  )
}

export const PurposeEditStep1GeneralFormSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={680} />
}

export default PurposeEditStep1GeneralForm
