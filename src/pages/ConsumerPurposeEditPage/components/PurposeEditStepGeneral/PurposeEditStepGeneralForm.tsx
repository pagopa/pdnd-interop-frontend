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
import { useNavigate } from '@/router'

export type PurposeEditStepGeneralFormValues = Omit<
  PurposeUpdateContent,
  'riskAnalysisForm' | 'isFreeOfCharge' | 'eserviceId'
> & {
  dailyCalls: number
  isFreeOfCharge: 'YES' | 'NO'
}

type PurposeEditStepGeneralFormProps = ActiveStepProps & {
  purpose: Purpose
  defaultValues: PurposeEditStepGeneralFormValues
}

const PurposeEditStepGeneralForm: React.FC<PurposeEditStepGeneralFormProps> = ({
  purpose,
  defaultValues,
  forward,
}) => {
  const { t } = useTranslation('purpose')
  const { mutate: updateDraft } = PurposeMutations.useUpdateDraft()
  const { mutate: updateDraftForReceive } = PurposeMutations.useUpdateDraftForReceiveEService()
  const navigate = useNavigate()

  // The endpoint to call depends on whether the e-service is
  // in RECEIVE or DELIVER mode
  const isReceive = !!purpose.riskAnalysisForm?.riskAnalysisId

  const formMethods = useForm<PurposeEditStepGeneralFormValues>({
    defaultValues,
  })

  const goToSummary = () => {
    navigate('SUBSCRIBE_PURPOSE_SUMMARY', {
      params: {
        purposeId: purpose.id,
      },
    })
  }

  const onSubmit = (values: PurposeEditStepGeneralFormValues) => {
    const { dailyCalls, isFreeOfCharge, freeOfChargeReason, ...updateDraftPayload } = values
    const isFreeOfChargeBool = isFreeOfCharge === 'YES'
    const purposeId = purpose.id

    const requestPayload = {
      ...updateDraftPayload,
      isFreeOfCharge: isFreeOfChargeBool,
      freeOfChargeReason: isFreeOfChargeBool ? freeOfChargeReason : undefined,
      purposeId,
      dailyCalls: dailyCalls,
    }

    if (isReceive) {
      updateDraftForReceive(requestPayload, { onSuccess: goToSummary })
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
        <SectionContainer title={t('edit.stepGeneral.title')}>
          <RHFTextField
            name="title"
            label={t('edit.stepGeneral.nameField.label')}
            infoLabel={t('edit.stepGeneral.nameField.infoLabel')}
            focusOnMount
            inputProps={{ maxLength: 60 }}
            rules={{ required: true, minLength: 5 }}
          />

          <RHFTextField
            name="description"
            label={t('edit.stepGeneral.descriptionField.label')}
            infoLabel={t('edit.stepGeneral.descriptionField.infoLabel')}
            multiline
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
          />

          <RHFRadioGroup
            name="isFreeOfCharge"
            label={t('edit.stepGeneral.isFreeOfChargeField.label')}
            options={[
              { label: t('edit.stepGeneral.isFreeOfChargeField.options.YES'), value: 'YES' },
              { label: t('edit.stepGeneral.isFreeOfChargeField.options.NO'), value: 'NO' },
            ]}
          />

          {isFreeOfCharge === 'YES' && (
            <RHFTextField
              name="freeOfChargeReason"
              label={t('edit.stepGeneral.freeOfChargeReasonField.label')}
              infoLabel={t('edit.stepGeneral.freeOfChargeReasonField.infoLabel')}
              multiline
              inputProps={{ maxLength: 250 }}
              rules={{ required: true, minLength: 10 }}
            />
          )}

          <RHFTextField
            name="dailyCalls"
            label={t('edit.stepGeneral.dailyCallsField.label')}
            type="number"
            inputProps={{ min: '1' }}
            sx={{ mb: 0 }}
            rules={{ required: true, min: 1 }}
          />
        </SectionContainer>
        <StepActions
          back={{ to: 'SUBSCRIBE_PURPOSE_LIST', label: t('backToListBtn'), type: 'link' }}
          forward={{
            label: isReceive ? t('edit.endWithSaveBtn') : t('edit.forwardWithSaveBtn'),
            type: 'submit',
            startIcon: <SaveIcon />,
          }}
        />
      </Box>
    </FormProvider>
  )
}

export const PurposeEditStepGeneralFormSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={680} />
}

export default PurposeEditStepGeneralForm
