import { EServiceMutations } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { RHFSwitch, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useNavigate } from '@/router'
import { minutesToSeconds, secondsToMinutes } from '@/utils/format.utils'
import { Box, Link, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import omit from 'lodash/omit'
import type { AgreementApprovalPolicy } from '@/api/api.generatedTypes'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/api/eservice/eservice.api.utils'
import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export type EServiceCreateStep2FormValues = {
  audience: string
  version: string
  voucherLifespan: number
  description: string
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  agreementApprovalPolicy: boolean
}

export const EServiceCreateStep2Version: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const navigate = useNavigate()
  const { eservice, descriptor, forward, back } = useEServiceCreateContext()
  const { mutate: createVersionDraft } = EServiceMutations.useCreateVersionDraft({
    suppressSuccessToast: true,
    showConfirmationDialog: false,
  })
  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  let defaultValues: EServiceCreateStep2FormValues = {
    version: '1',
    audience: '',
    voucherLifespan: 1,
    description: '',
    dailyCallsPerConsumer: 1,
    dailyCallsTotal: 1,
    agreementApprovalPolicy: true,
  }

  // Pre-fill if there is already a draft of the service available
  if (descriptor) {
    defaultValues = {
      version: descriptor.version,
      audience: descriptor.audience.length > 0 ? descriptor.audience[0] : '',
      voucherLifespan: secondsToMinutes(descriptor.voucherLifespan),
      description: descriptor?.description ?? '',
      dailyCallsPerConsumer: descriptor.dailyCallsPerConsumer || 1,
      dailyCallsTotal: descriptor.dailyCallsTotal || 1,
      agreementApprovalPolicy: descriptor.agreementApprovalPolicy === 'MANUAL',
    }
  }

  const formMethods = useForm({
    defaultValues,
  })

  const onSubmit = (values: EServiceCreateStep2FormValues) => {
    if (!eservice) return
    const newDescriptorData = {
      ...values,
      voucherLifespan: minutesToSeconds(values.voucherLifespan),
      audience: [values.audience],
      agreementApprovalPolicy: (values.agreementApprovalPolicy
        ? 'MANUAL'
        : 'AUTOMATIC') as AgreementApprovalPolicy,
    }

    // If nothing has changed skip the update call
    if (descriptor) {
      const areDescriptorsEquals = compareObjects(newDescriptorData, descriptor)
      if (areDescriptorsEquals) {
        forward()
        return
      }
    }

    const payload = {
      eserviceId: eservice.id,
      attributes: { certified: [], verified: [], declared: [] },
      ...omit(newDescriptorData, ['version']),
    }

    if (descriptor) {
      const descriptorAttributeSeed = remapDescriptorAttributesToDescriptorAttributesSeed(
        descriptor.attributes
      )
      updateVersionDraft(
        { ...payload, descriptorId: descriptor.id, attributes: descriptorAttributeSeed },
        { onSuccess: forward }
      )
      return
    }
    createVersionDraft(payload, {
      onSuccess(data) {
        navigate('PROVIDE_ESERVICE_EDIT', {
          params: { eserviceId: eservice.id, descriptorId: data.id },
          replace: true,
        })
        forward()
      },
    })
  }

  const dailyCallsPerConsumer = formMethods.watch('dailyCallsPerConsumer')

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer
          newDesign
          title={t('step2.versionTitle', { versionNumber: descriptor?.version ?? '1' })}
          component="div"
        >
          <RHFTextField
            size="small"
            name="description"
            label={t('step2.descriptionField.label')}
            multiline
            focusOnMount
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
            sx={{ my: 0, mt: 1 }}
          />
          <SectionContainer
            newDesign
            innerSection
            title={t('step2.voucherSection.title')}
            sx={{ mt: 3 }}
          >
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <RHFTextField
                size="small"
                name="voucherLifespan"
                label={t('step2.voucherSection.voucherLifespanField.label')}
                infoLabel={t('step2.voucherSection.voucherLifespanField.infoLabel')}
                type="number"
                inputProps={{ min: 1, max: 1440 }}
                rules={{ required: true, min: 1, max: 1440 }}
                sx={{ flex: 1, my: 0 }}
              />

              <RHFTextField
                size="small"
                name="audience"
                label={t('step2.voucherSection.audienceField.label')}
                infoLabel={
                  <Trans components={{ 1: <Link href="/" target="_blank" /> }}>
                    {t('step2.voucherSection.audienceField.infoLabel')}
                  </Trans>
                }
                inputProps={{ maxLength: 250 }}
                rules={{ required: true, minLength: 1 }}
                sx={{ flex: 1, my: 0 }}
              />
            </Stack>
          </SectionContainer>
          <SectionContainer
            newDesign
            innerSection
            title={t('step2.thresholdSection.title')}
            sx={{ mt: 3 }}
          >
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <RHFTextField
                size="small"
                name="dailyCallsPerConsumer"
                label={t('step2.thresholdSection.dailyCallsPerConsumerField.label')}
                type="number"
                inputProps={{ min: '1' }}
                rules={{ required: true, min: 1 }}
                sx={{ my: 0, flex: 1 }}
              />

              <RHFTextField
                size="small"
                name="dailyCallsTotal"
                label={t('step2.thresholdSection.dailyCallsTotalField.label')}
                type="number"
                inputProps={{ min: '1' }}
                sx={{ my: 0, flex: 1 }}
                rules={{
                  required: true,
                  min: {
                    value: dailyCallsPerConsumer,
                    message: t('step2.thresholdSection.dailyCallsTotalField.validation.min'),
                  },
                }}
              />
            </Stack>
          </SectionContainer>

          <SectionContainer
            newDesign
            innerSection
            title={t('step2.agreementApprovalPolicySection.title')}
            sx={{ mt: 3 }}
          >
            <RHFSwitch
              label={t('step2.agreementApprovalPolicySection.label')}
              vertical
              name="agreementApprovalPolicy"
              sx={{ my: 0 }}
            />
          </SectionContainer>
        </SectionContainer>
        <StepActions
          back={{
            label: t('backWithoutSaveBtn'),
            type: 'button',
            onClick: back,
            startIcon: <ArrowBackIcon />,
          }}
          forward={{ label: t('forwardWithSaveBtn'), type: 'submit', startIcon: <SaveIcon /> }}
        />
      </Box>
    </FormProvider>
  )
}

export const EServiceCreateStep2VersionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={1010} />
}
