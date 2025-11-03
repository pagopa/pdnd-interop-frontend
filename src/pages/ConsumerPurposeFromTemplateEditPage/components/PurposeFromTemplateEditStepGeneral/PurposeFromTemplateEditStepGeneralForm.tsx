import React from 'react'
import { Box } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { StepActions } from '@/components/shared/StepActions'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import type {
  PurposeTemplateWithCompactCreator,
  PurposeUpdateContent,
} from '@/api/api.generatedTypes'
import SaveIcon from '@mui/icons-material/Save'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { PurposeMutations } from '@/api/purpose'
import { Stack } from '@mui/system'

export type PurposeFromTemplateEditStepGeneralFormValues = Omit<
  PurposeUpdateContent,
  'riskAnalysisForm' | 'isFreeOfCharge' | 'eserviceId'
> & {
  dailyCalls: number
  isFreeOfCharge: 'YES' | 'NO'
  freeOfChargeReason: string
  instanceName: string
}

type PurposeEditStepGeneralFormProps = ActiveStepProps & {
  purposeTemplate: PurposeTemplateWithCompactCreator
  defaultValues: PurposeFromTemplateEditStepGeneralFormValues
}

const PurposeFromTemplateEditStepGeneralForm: React.FC<PurposeEditStepGeneralFormProps> = ({
  purposeTemplate,
  defaultValues,
  forward,
}) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'edit.purposeFromTemplate',
  })
  const { t: tPurposeActions } = useTranslation('purpose')
  const { mutate: updateDraft } = PurposeMutations.useUpdateDraft() //TODO PATCH:/purposeTemplates/{purposeTemplateId}/purposes/{purposeId} CALL THIS

  const formMethods = useForm<PurposeFromTemplateEditStepGeneralFormValues>({
    defaultValues,
  })

  const onSubmit = (values: PurposeFromTemplateEditStepGeneralFormValues) => {
    forward() //TODO FIX WHEN TYPES FROM BFF WILL BE READY
    // const { dailyCalls, isFreeOfCharge, freeOfChargeReason, ...updateDraftPayload } = values
    // const isFreeOfChargeBool = isFreeOfCharge === 'YES'
    // const purposeId = purposeTemplate.id

    // const requestPayload = {
    //   ...updateDraftPayload,
    //   isFreeOfCharge: isFreeOfChargeBool,
    //   freeOfChargeReason: isFreeOfChargeBool ? freeOfChargeReason : undefined,
    //   purposeId,
    //   dailyCalls: dailyCalls,
    // }

    // updateDraft(
    //   { ...requestPayload, riskAnalysisForm: purposeTemplate.riskAnalysisForm },
    //   { onSuccess: forward }
    // )
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
            name="instanceName"
            label={t('technicalInformationsSection.instanceNameField.label')}
            fullWidth
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 5 }}
          />
          <RHFTextField
            name="dailyCalls"
            label={t('technicalInformationsSection.dailyCallsField.label')}
            fullWidth
            rules={{ required: true }}
          />
        </SectionContainer>
        <StepActions
          back={{
            to: 'SUBSCRIBE_PURPOSE_LIST',
            label: tPurposeActions('backToListBtn'),
            type: 'link',
          }}
          forward={{
            label: tPurposeActions('edit.forwardWithSaveBtn'),
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
