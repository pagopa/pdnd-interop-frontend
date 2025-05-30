import { EServiceMutations } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { RHFSwitch, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { minutesToSeconds, secondsToMinutes } from '@/utils/format.utils'
import { Box, Link, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import omit from 'lodash/omit'
import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { payloadVerificationGuideLink } from '@/config/constants'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import type { UpdateEServiceDescriptorTemplateInstanceSeed } from '@/api/api.generatedTypes'

export type EServiceCreateStepVersionFormValues = {
  audience: string
  version: string
  voucherLifespan: number
  description: string
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  agreementApprovalPolicy: boolean
}

export const EServiceCreateStepVersion: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })

  const { descriptor, forward, back } = useEServiceCreateContext()

  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const { mutate: updateInstanceVersionDraft } = EServiceMutations.useUpdateInstanceVersionDraft({
    suppressSuccessToast: true,
  })

  const defaultValues: EServiceCreateStepVersionFormValues = {
    version: descriptor?.version ?? '1',
    audience: descriptor?.audience?.[0] ?? '',
    voucherLifespan: descriptor ? secondsToMinutes(descriptor.voucherLifespan) : 1,
    description: descriptor?.description ?? '',
    dailyCallsPerConsumer: descriptor?.dailyCallsPerConsumer ?? 1,
    dailyCallsTotal: descriptor?.dailyCallsTotal ?? 1,
    agreementApprovalPolicy: descriptor ? descriptor.agreementApprovalPolicy === 'MANUAL' : false,
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit = (values: EServiceCreateStepVersionFormValues) => {
    if (!descriptor) return

    const newDescriptorData = {
      ...values,
      voucherLifespan: minutesToSeconds(values.voucherLifespan),
      audience: [values.audience],
      agreementApprovalPolicy: values.agreementApprovalPolicy
        ? ('MANUAL' as const)
        : ('AUTOMATIC' as const),
    }

    // If nothing has changed skip the update call
    const areDescriptorsEquals = compareObjects(newDescriptorData, descriptor)
    if (areDescriptorsEquals) {
      forward()
      return
    }

    if (isEServiceCreatedFromTemplate) {
      const payload: UpdateEServiceDescriptorTemplateInstanceSeed = {
        agreementApprovalPolicy: newDescriptorData.agreementApprovalPolicy,
        audience: newDescriptorData.audience,
        dailyCallsPerConsumer: values.dailyCallsPerConsumer,
        dailyCallsTotal: values.dailyCallsTotal,
      }

      updateInstanceVersionDraft(
        {
          ...payload,
          eserviceId: descriptor.eservice.id,
          descriptorId: descriptor.id,
        },
        { onSuccess: forward }
      )
    } else {
      const payload = {
        eserviceId: descriptor.eservice.id,
        attributes: { certified: [], verified: [], declared: [] },
        ...omit(newDescriptorData, ['version']),
      }

      updateVersionDraft(
        {
          ...payload,
          descriptorId: descriptor.id,
          attributes: remapDescriptorAttributesToDescriptorAttributesSeed(descriptor.attributes),
        },
        { onSuccess: forward }
      )
    }
  }

  const dailyCallsPerConsumer = formMethods.watch('dailyCallsPerConsumer')
  // if this field is true some textField should be disabled
  const isEServiceCreatedFromTemplate = Boolean(descriptor?.templateRef?.templateVersionId)

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer
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
            disabled={isEServiceCreatedFromTemplate}
            sx={{ my: 0, mt: 1 }}
          />
          <SectionContainer innerSection title={t('step2.voucherSection.title')} sx={{ mt: 3 }}>
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
                disabled={isEServiceCreatedFromTemplate}
              />

              <RHFTextField
                size="small"
                name="audience"
                label={t('step2.voucherSection.audienceField.label')}
                infoLabel={
                  <Trans
                    components={{ 1: <Link href={payloadVerificationGuideLink} target="_blank" /> }}
                  >
                    {t('step2.voucherSection.audienceField.infoLabel')}
                  </Trans>
                }
                inputProps={{ maxLength: 250 }}
                rules={{ required: true, minLength: 1 }}
                sx={{ flex: 1, my: 0 }}
              />
            </Stack>
          </SectionContainer>
          <SectionContainer innerSection title={t('step2.thresholdSection.title')} sx={{ mt: 3 }}>
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
            innerSection
            title={t('step2.agreementApprovalPolicySection.title')}
            sx={{ mt: 3 }}
          >
            <RHFSwitch
              label={t('step2.agreementApprovalPolicySection.label')}
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

export const EServiceCreateStepVersionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={550} />
}
