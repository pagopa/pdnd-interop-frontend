import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { RHFSwitch, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { compareObjects } from '@/utils/common.utils'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import type { UpdateEServiceTemplateVersionSeed } from '@/api/api.generatedTypes'
import { useNavigate } from '@/router'
import { EServiceTemplateCreateStepVersionDoc } from './EServiceTemplateCreateStepVersionDoc'

export type EServiceTemplateCreateStepVersionFormValues = {
  description: string
  agreementApprovalPolicy: boolean
}

export const EServiceTemplateCreateStepVersion: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'create' })

  const { eserviceTemplateVersion, back } = useEServiceTemplateCreateContext()

  const navigate = useNavigate()

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

  const navigateToSummary = () => {
    if (!eserviceTemplateVersion) return
    navigate('PROVIDE_ESERVICE_TEMPLATE_SUMMARY', {
      params: {
        eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: eserviceTemplateVersion.id,
      },
    })
  }

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
      navigateToSummary()
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
      { onSuccess: navigateToSummary }
    )
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer title={t('step4.versionDescriptionTitle')} component="div">
          <RHFTextField
            size="small"
            name="description"
            label={t('step4.versionDescriptionField.label')}
            infoLabel={t('step4.versionDescriptionField.infoLabel')}
            multiline
            focusOnMount
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
            sx={{ my: 0, mt: 1 }}
          />
        </SectionContainer>
        <SectionContainer
          title={t('step4.documentationSection.title')}
          description={t('step4.documentationSection.description')}
          component="div"
        >
          <EServiceTemplateCreateStepVersionDoc />
        </SectionContainer>
        <SectionContainer title={t('step4.requestManagementSection.title')} component="div">
          <RHFSwitch
            label={t('step4.agreementApprovalPolicySection.label')}
            name="agreementApprovalPolicy"
            sx={{ my: 0, ml: 1 }}
          />
        </SectionContainer>
        <StepActions
          back={{
            label: t('backWithoutSaveBtn'),
            type: 'button',
            onClick: back,
            startIcon: <ArrowBackIcon />,
          }}
          forward={{ label: t('goToSummary'), type: 'submit', endIcon: <ArrowForwardIcon /> }}
        />
      </Box>
    </FormProvider>
  )
}

export const EServiceTemplateCreateStepVersionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={550} />
}
