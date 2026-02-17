import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { RHFSwitch, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { Box } from '@mui/material'
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
  description: string
  agreementApprovalPolicy: boolean
}

export const EServiceTemplateCreateStepVersion: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'create' })

  const { eserviceTemplateVersion, forward, back } = useEServiceTemplateCreateContext()

  const { mutate: updateVersionDraft } = EServiceTemplateMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const defaultValues: EServiceTemplateCreateStepVersionFormValues = {
    description: eserviceTemplateVersion?.description ?? '',
    agreementApprovalPolicy: eserviceTemplateVersion
      ? eserviceTemplateVersion.agreementApprovalPolicy === 'MANUAL'
      : false,
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit = (values: EServiceTemplateCreateStepVersionFormValues) => {
    if (!eserviceTemplateVersion) return

    const newEServiceTemplateData = {
      ...values,
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
      voucherLifespan: eserviceTemplateVersion.voucherLifespan,
      agreementApprovalPolicy: newEServiceTemplateData.agreementApprovalPolicy,
      dailyCallsPerConsumer: eserviceTemplateVersion.dailyCallsPerConsumer,
      dailyCallsTotal: eserviceTemplateVersion.dailyCallsTotal,
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
