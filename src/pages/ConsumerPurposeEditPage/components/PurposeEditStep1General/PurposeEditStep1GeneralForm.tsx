import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { number, object, string } from 'yup'
import { TextField } from '@/components/shared/ReactHookFormInputs'
import { useTranslation } from 'react-i18next'
import { StepActions } from '@/components/shared/StepActions'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { PurposeMutations } from '@/api/purpose'
import { ActiveStepProps } from '@/hooks/useActiveStep'
import { Purpose } from '@/types/purpose.types'
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

  const validationSchema = object({
    title: string().required().min(5),
    description: string().required().min(10),
    dailyCalls: number().required(),
  })

  const formMethods = useForm<PurposeEditStep1GeneralFormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
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
      <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer>
          <Typography component="h2" variant="h5">
            {t('step1.title')}
          </Typography>

          <TextField
            name="title"
            label={t('step1.nameField.label')}
            infoLabel={t('step1.nameField.infoLabel')}
            focusOnMount={true}
            inputProps={{ maxLength: 60 }}
          />

          <TextField
            name="description"
            label={t('step1.descriptionField.label')}
            infoLabel={t('step1.descriptionField.infoLabel')}
            multiline
            inputProps={{ maxLength: 250 }}
          />

          <TextField
            name="dailyCalls"
            label={t('step1.dailyCallsField.label')}
            infoLabel={t('step1.dailyCallsField.infoLabel')}
            type="number"
            inputProps={{ min: '1' }}
            sx={{ mb: 0 }}
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
