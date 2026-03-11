import React from 'react'
import { Box, Stack } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { StepActions } from '@/components/shared/StepActions'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import type {
  PurposeTemplateWithCompactCreator,
  PurposeUpdateContent,
  Purpose,
} from '@/api/api.generatedTypes'
import SaveIcon from '@mui/icons-material/Save'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { PurposeMutations } from '@/api/purpose'
import { PurposeLoadEstimationSection } from '@/components/shared/PurposeLoadEstimationSection'

export type PurposeFromTemplateEditStepGeneralFormValues = Omit<
  PurposeUpdateContent,
  'riskAnalysisForm' | 'isFreeOfCharge' | 'eserviceId'
> & {
  dailyCalls: number
  isFreeOfCharge: 'YES' | 'NO'
  freeOfChargeReason: string
  purposeTitle: string
}

type PurposeEditStepGeneralFormProps = ActiveStepProps & {
  purpose: Purpose
  purposeTemplate: PurposeTemplateWithCompactCreator
  defaultValues: PurposeFromTemplateEditStepGeneralFormValues
}

const PurposeFromTemplateEditStepGeneralForm: React.FC<PurposeEditStepGeneralFormProps> = ({
  purpose,
  purposeTemplate,
  defaultValues,
  forward,
}) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'edit.purposeFromTemplate',
  })
  const { t: tPurpose } = useTranslation('purpose')
  const { mutate: updateDraftFromPurposeTemplate } =
    PurposeMutations.useUpdateDraftFromPurposeTemplate()

  const formMethods = useForm<PurposeFromTemplateEditStepGeneralFormValues>({
    defaultValues,
  })

  const onSubmit = (values: PurposeFromTemplateEditStepGeneralFormValues) => {
    const { dailyCalls, purposeTitle } = values

    const requestPayload = {
      title: purposeTitle,
      dailyCalls,
    }

    updateDraftFromPurposeTemplate(
      { purposeTemplateId: purposeTemplate.id, purposeId: purpose.id, ...requestPayload },
      { onSuccess: forward }
    )
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer
          title={t('generalInformationSection.title')}
          description={t('generalInformationSection.subtitle')}
        >
          <SectionContainer
            innerSection
            title={t('generalInformationSection.descriptionSection.title')}
          >
            <Stack spacing={2}>
              <InformationContainer
                label={t('generalInformationSection.descriptionSection.nameField.label')}
                content={purposeTemplate.purposeTitle}
              />
              <InformationContainer
                label={t('generalInformationSection.descriptionSection.descriptionField.label')}
                content={purposeTemplate.purposeDescription}
              />
              <InformationContainer
                label={t('generalInformationSection.descriptionSection.isFreeOfChargeField.label')}
                content={
                  purposeTemplate.purposeIsFreeOfCharge
                    ? t(
                        'generalInformationSection.descriptionSection.isFreeOfChargeField.options.YES'
                      )
                    : t(
                        'generalInformationSection.descriptionSection.isFreeOfChargeField.options.NO'
                      )
                }
              />
              {purposeTemplate.purposeIsFreeOfCharge && (
                <InformationContainer
                  label={t(
                    'generalInformationSection.descriptionSection.freeOfChargeReasonField.label'
                  )}
                  content={purposeTemplate.purposeFreeOfChargeReason ?? ''}
                />
              )}
            </Stack>
          </SectionContainer>
        </SectionContainer>
        <SectionContainer title={t('technicalInformationsSection.title')}>
          <RHFTextField
            name="purposeTitle"
            label={t('technicalInformationsSection.instanceNameField.label')}
            fullWidth
            inputProps={{ maxLength: 60 }}
            rules={{ required: true, minLength: 5 }}
          />
        </SectionContainer>
        <PurposeLoadEstimationSection
          purposeId={purpose.id}
          dailyCallsPerConsumer={purpose.dailyCallsPerConsumer}
          dailyCallsTotal={purpose.dailyCallsTotal}
        />
        <StepActions
          back={{
            to: 'SUBSCRIBE_PURPOSE_LIST',
            label: tPurpose('backToListBtn'),
            type: 'link',
          }}
          forward={{
            label: tPurpose('edit.forwardWithSaveBtn'),
            type: 'submit',
            startIcon: <SaveIcon />,
          }}
        />
      </Box>
    </FormProvider>
  )
}

export const PurposeFromTemplateEditStepGeneralFormSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={680} />
}

export default PurposeFromTemplateEditStepGeneralForm
