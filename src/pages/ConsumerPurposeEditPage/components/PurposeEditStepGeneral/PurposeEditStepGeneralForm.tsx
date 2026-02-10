import React from 'react'
import { Alert, Box, Paper, Stack, Typography } from '@mui/material'
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
import { useGetConsumerPurporseEditPageInfoAlertProps } from '../../hooks/useGetConsumerPurporseEditPageInfoAlertProps'

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
  const isReceive = purpose.eservice.mode === 'RECEIVE'

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

  const dailyCalls = formMethods.watch('dailyCalls')

  const dailyCallsPerConsumer = purpose.dailyCallsPerConsumer

  const dailyCallsTotal = purpose.dailyCallsTotal

  const alertProps = useGetConsumerPurporseEditPageInfoAlertProps(
    dailyCalls,
    dailyCallsPerConsumer,
    dailyCallsTotal
  )

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
            required
          />

          <RHFTextField
            name="description"
            label={t('edit.stepGeneral.descriptionField.label')}
            infoLabel={t('edit.stepGeneral.descriptionField.infoLabel')}
            multiline
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
            required
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
        </SectionContainer>
        <SectionContainer title={t('edit.loadEstimationSection.title')}>
          <RHFTextField
            name="dailyCalls"
            label={t('edit.loadEstimationSection.dailyCalls.label')}
            infoLabel={t('edit.loadEstimationSection.dailyCalls.infoLabel')}
            type="number"
            inputProps={{ min: '1' }}
            rules={{ required: true, min: 1 }}
          />
          {alertProps && <Alert {...alertProps} sx={{ mt: 1, mb: 3 }} />}
          <Alert
            icon={false}
            sx={{ p: 2, borderLeftColor: 'grey.700', backgroundColor: 'grey.50' }}
          >
            <Typography fontWeight={700} sx={{ textTransform: 'uppercase' }}>
              {t('edit.loadEstimationSection.providerThresholdsInfo.label')}
            </Typography>
            <Stack direction="row" spacing={6} sx={{ mt: 0.5, mb: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography>
                  {t(
                    'edit.loadEstimationSection.providerThresholdsInfo.dailyCallsPerConsumer.label'
                  )}
                </Typography>
                <Typography fontWeight={600}>
                  {t(
                    'edit.loadEstimationSection.providerThresholdsInfo.dailyCallsPerConsumer.value',
                    {
                      min: '#' /* @TODO - add residual threshold */,
                      max: dailyCallsPerConsumer,
                    }
                  )}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography>
                  {t('edit.loadEstimationSection.providerThresholdsInfo.dailyCallsTotal.label')}
                </Typography>
                <Typography fontWeight={600}>
                  {t('edit.loadEstimationSection.providerThresholdsInfo.dailyCallsTotal.value', {
                    min: '#' /* @TODO - add residual threshold */,
                    max: dailyCallsTotal,
                  })}
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {t('edit.loadEstimationSection.providerThresholdsInfo.description')}
            </Typography>
          </Alert>
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
