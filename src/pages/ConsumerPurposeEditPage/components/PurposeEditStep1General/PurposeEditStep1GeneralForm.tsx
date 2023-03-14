import React from 'react'
import { Box, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { StepActions } from '@/components/shared/StepActions'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { PurposeMutations } from '@/api/purpose'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import type { Purpose } from '@/types/purpose.types'
import { decoratePurposeWithMostRecentVersion } from '@/api/purpose/purpose.api.utils'

type PurposeEditStep1GeneralFormValues = {
  title: string
  description: string
  dailyCalls: number
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
  const { mutate: updateVersionDraft } = PurposeMutations.useUpdateVersionDraft()

  const formMethods = useForm<PurposeEditStep1GeneralFormValues>({
    defaultValues,
  })

  const onSubmit = (values: PurposeEditStep1GeneralFormValues) => {
    const { dailyCalls, ...updateDraftPayload } = values
    const purposeId = purpose.id
    updateDraft(
      { ...updateDraftPayload, riskAnalysisForm: purpose.riskAnalysisForm, purposeId },
      {
        onSuccess(updatedPurpose) {
          const versionId = decoratePurposeWithMostRecentVersion(updatedPurpose).currentVersion!.id
          updateVersionDraft({ purposeId, versionId, dailyCalls }, { onSuccess: forward })
        },
      }
    )
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer>
          <Typography component="h2" variant="h5">
            {t('step1.title')}
          </Typography>

          <RHFTextField
            name="title"
            label={t('step1.nameField.label')}
            infoLabel={t('step1.nameField.infoLabel')}
            focusOnMount={true}
            inputProps={{ maxLength: 60 }}
            rules={{ required: true, minLength: 5 }}
          />

          <RHFTextField
            name="description"
            label={t('step1.descriptionField.label')}
            infoLabel={t('step1.descriptionField.infoLabel')}
            multiline
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
          />

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
          back={{
            label: t('backToListBtn'),
            type: 'link',
            to: 'SUBSCRIBE_PURPOSE_LIST',
          }}
          forward={{ label: t('forwardWithSaveBtn'), type: 'submit' }}
        />
      </Box>
    </FormProvider>
  )
}

export const PurposeEditStep1GeneralFormSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={680} />
}

export default PurposeEditStep1GeneralForm
