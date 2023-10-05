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
import { Stack } from '@mui/system'
import { PurposeEditEServiceAutocomplete } from './PurposeEditEServiceAutocomplete'

export type PurposeEditStep1GeneralFormValues = Omit<
  PurposeUpdateContent,
  'riskAnalysisForm' | 'isFreeOfCharge'
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
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' })
  const { mutate: updateDraft } = PurposeMutations.useUpdateDraft()

  const formMethods = useForm<PurposeEditStep1GeneralFormValues>({
    defaultValues,
  })

  const onSubmit = (values: PurposeEditStep1GeneralFormValues) => {
    const { eserviceId, dailyCalls, isFreeOfCharge, freeOfChargeReason, ...updateDraftPayload } =
      values
    const isFreeOfChargeBool = isFreeOfCharge === 'SI'
    const purposeId = purpose.id
    updateDraft(
      {
        ...updateDraftPayload,
        isFreeOfCharge: isFreeOfChargeBool,
        freeOfChargeReason: isFreeOfChargeBool ? freeOfChargeReason : undefined,
        riskAnalysisForm: purpose.riskAnalysisForm,
        purposeId,
        dailyCalls: dailyCalls,
        eserviceId: eserviceId,
      },
      {
        onSuccess: forward,
      }
    )
  }

  const isFreeOfCharge = formMethods.watch('isFreeOfCharge')

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer newDesign title={t('step1.title')}>
          <Stack direction="row" spacing={1}>
            <RHFTextField
              name="title"
              label={t('step1.nameField.label')}
              infoLabel={t('step1.nameField.infoLabel')}
              focusOnMount={true}
              inputProps={{ maxLength: 60 }}
              rules={{ required: true, minLength: 5 }}
            />

            <PurposeEditEServiceAutocomplete />
          </Stack>

          <RHFTextField
            name="description"
            label={t('step1.descriptionField.label')}
            infoLabel={t('step1.descriptionField.infoLabel')}
            multiline
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
          />

          <RHFRadioGroup
            name="isFreeOfCharge"
            label={t('step1.isFreeOfChargeField.label')}
            options={[
              { label: t('step1.isFreeOfChargeField.options.SI'), value: 'SI' },
              { label: t('step1.isFreeOfChargeField.options.NO'), value: 'NO' },
            ]}
          />

          {isFreeOfCharge === 'SI' && (
            <RHFTextField
              name="freeOfChargeReason"
              label={t('step1.freeOfChargeReasonField.label')}
              infoLabel={t('step1.freeOfChargeReasonField.infoLabel')}
              multiline
              inputProps={{ maxLength: 250 }}
              rules={{ required: true, minLength: 10 }}
            />
          )}

          <RHFTextField
            name="dailyCalls"
            label={t('step1.dailyCallsField.label')}
            infoLabel={t('step1.dailyCallsField.infoLabel')}
            type="number"
            inputProps={{ min: '1' }}
            sx={{ mb: 0 }}
            rules={{ required: true, min: 1 }}
          />
        </SectionContainer>
        <StepActions
          forward={{ label: t('forwardWithSaveBtn'), type: 'submit', startIcon: <SaveIcon /> }}
        />
      </Box>
    </FormProvider>
  )
}

export const PurposeEditStep1GeneralFormSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={680} />
}

export default PurposeEditStep1GeneralForm
