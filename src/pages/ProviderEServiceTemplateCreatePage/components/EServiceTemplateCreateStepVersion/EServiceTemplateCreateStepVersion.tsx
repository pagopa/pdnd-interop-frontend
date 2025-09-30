import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { RHFSwitch, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { minutesToSeconds, secondsToMinutes } from '@/utils/format.utils'
import { Box, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import type { UpdateEServiceTemplateVersionSeed } from '@/api/api.generatedTypes'

export type EServiceTemplateCreateStepVersionFormValues = {
  voucherLifespan: number
  description: string
  dailyCallsPerConsumer?: number
  dailyCallsTotal?: number
  agreementApprovalPolicy: boolean
  thresholdsSection: boolean
}

export const EServiceTemplateCreateStepVersion: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'create' })

  const { eserviceTemplateVersion, forward, back } = useEServiceTemplateCreateContext()

  const { mutate: updateVersionDraft } = EServiceTemplateMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const defaultValues: EServiceTemplateCreateStepVersionFormValues = {
    thresholdsSection:
      eserviceTemplateVersion?.dailyCallsPerConsumer && eserviceTemplateVersion.dailyCallsTotal
        ? true
        : false,
    voucherLifespan: eserviceTemplateVersion
      ? secondsToMinutes(eserviceTemplateVersion.voucherLifespan)
      : 1,
    description: eserviceTemplateVersion?.description ?? '',
    dailyCallsPerConsumer: eserviceTemplateVersion?.dailyCallsPerConsumer,
    dailyCallsTotal: eserviceTemplateVersion?.dailyCallsTotal,
    agreementApprovalPolicy: eserviceTemplateVersion
      ? eserviceTemplateVersion.agreementApprovalPolicy === 'MANUAL'
      : false,
  }

  const formMethods = useForm({ defaultValues })
  const isThresholdSectionVisible = formMethods.watch('thresholdsSection')

  const onSubmit = (values: EServiceTemplateCreateStepVersionFormValues) => {
    if (!eserviceTemplateVersion) return

    const newEServiceTemplateData = {
      ...values,
      voucherLifespan: minutesToSeconds(values.voucherLifespan),
      agreementApprovalPolicy: values.agreementApprovalPolicy
        ? ('MANUAL' as const)
        : ('AUTOMATIC' as const),
    }

    // If nothing has changed skip the update call
    const areEServiceTemplatesEquals = compareObjects(
      newEServiceTemplateData,
      eserviceTemplateVersion
    )
    if (areEServiceTemplatesEquals) {
      forward()
      return
    }

    const payload: UpdateEServiceTemplateVersionSeed = {
      description: newEServiceTemplateData.description,
      attributes: remapDescriptorAttributesToDescriptorAttributesSeed(
        eserviceTemplateVersion.attributes
      ),
      voucherLifespan: newEServiceTemplateData.voucherLifespan,
      agreementApprovalPolicy: newEServiceTemplateData.agreementApprovalPolicy,
      dailyCallsPerConsumer: newEServiceTemplateData.thresholdsSection
        ? newEServiceTemplateData.dailyCallsPerConsumer
        : undefined,
      dailyCallsTotal: newEServiceTemplateData.thresholdsSection
        ? newEServiceTemplateData.dailyCallsTotal
        : undefined,
    }

    updateVersionDraft(
      {
        ...payload,
        eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: eserviceTemplateVersion.id,
      },
      { onSuccess: forward }
    )
  }

  const dailyCallsPerConsumer = formMethods.watch('dailyCallsPerConsumer')

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer
          title={t('step2.versionTitle', { versionNumber: eserviceTemplateVersion?.version ?? 1 })}
          component="div"
        >
          <RHFTextField
            size="small"
            name="description"
            label={t('step2.versionDescriptionField.label')}
            multiline
            focusOnMount
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
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
                sx={{ flex: 0.49, my: 0 }}
              />
            </Stack>
          </SectionContainer>
          <SectionContainer innerSection sx={{ mt: 3 }}>
            <RHFSwitch
              label={t('step2.thresholdsSection.thresholdsSwitch.label')}
              name="thresholdsSection"
              sx={{ my: 0 }}
            />
            {isThresholdSectionVisible && (
              <SectionContainer
                innerSection
                sx={{ mt: 3 }}
                title={t('step2.thresholdsSection.title')}
              >
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <RHFTextField
                    size="small"
                    name="dailyCallsPerConsumer"
                    label={t('step2.thresholdsSection.dailyCallsPerConsumerField.label')}
                    type="number"
                    inputProps={{ min: '1' }}
                    rules={{ min: 1 }}
                    sx={{ my: 0, flex: 1 }}
                  />

                  <RHFTextField
                    size="small"
                    name="dailyCallsTotal"
                    label={t('step2.thresholdsSection.dailyCallsTotalField.label')}
                    type="number"
                    inputProps={{ min: '1' }}
                    sx={{ my: 0, flex: 1 }}
                    rules={{
                      min: {
                        value: dailyCallsPerConsumer ?? 1,
                        message: t('step2.thresholdsSection.dailyCallsTotalField.validation.min'),
                      },
                    }}
                  />
                </Stack>
              </SectionContainer>
            )}
          </SectionContainer>

          <SectionContainer innerSection sx={{ mt: 3 }}>
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

export const EServiceTemplateCreateStepVersionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={550} />
}
