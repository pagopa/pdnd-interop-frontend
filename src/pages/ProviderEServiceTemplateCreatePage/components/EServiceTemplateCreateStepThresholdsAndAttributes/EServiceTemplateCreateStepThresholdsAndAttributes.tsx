import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { RHFSwitch, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { Alert, Box, Button, Link, Stack, Tab, Tabs, Typography } from '@mui/material'
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
import { attributesHelpLink } from '@/config/constants'

type EServiceTemplateCreateStepThresholdsAndAttributesFormValues = {
  dailyCallsPerConsumer?: number
  dailyCallsTotal?: number
  thresholdsSection: boolean
}

export const EServiceTemplateCreateStepThresholdsAndAttributes: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'create' })

  const { eserviceTemplateVersion, forward, back } = useEServiceTemplateCreateContext()

  const { mutate: updateVersionDraft } = EServiceTemplateMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const defaultValues: EServiceTemplateCreateStepThresholdsAndAttributesFormValues = {
    thresholdsSection:
      eserviceTemplateVersion?.dailyCallsPerConsumer && eserviceTemplateVersion.dailyCallsTotal
        ? true
        : false,
    dailyCallsPerConsumer: eserviceTemplateVersion?.dailyCallsPerConsumer,
    dailyCallsTotal: eserviceTemplateVersion?.dailyCallsTotal,
  }

  const formMethods = useForm({ defaultValues })
  const isThresholdSectionVisible = formMethods.watch('thresholdsSection')

  const [activeTab, setActiveTab] = React.useState(0)

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const onSubmit = (values: EServiceTemplateCreateStepThresholdsAndAttributesFormValues) => {
    if (!eserviceTemplateVersion) return

    const newData = {
      thresholdsSection: values.thresholdsSection,
      dailyCallsPerConsumer: values.thresholdsSection ? values.dailyCallsPerConsumer : undefined,
      dailyCallsTotal: values.thresholdsSection ? values.dailyCallsTotal : undefined,
    }

    const currentData = {
      thresholdsSection: defaultValues.thresholdsSection,
      dailyCallsPerConsumer: defaultValues.thresholdsSection
        ? defaultValues.dailyCallsPerConsumer
        : undefined,
      dailyCallsTotal: defaultValues.thresholdsSection ? defaultValues.dailyCallsTotal : undefined,
    }

    if (compareObjects(newData, currentData)) {
      forward()
      return
    }

    const payload: UpdateEServiceTemplateVersionSeed = {
      description: eserviceTemplateVersion.description,
      attributes: remapDescriptorAttributesToDescriptorAttributesSeed(
        eserviceTemplateVersion.attributes
      ),
      voucherLifespan: eserviceTemplateVersion.voucherLifespan,
      agreementApprovalPolicy: eserviceTemplateVersion.agreementApprovalPolicy,
      dailyCallsPerConsumer: newData.dailyCallsPerConsumer,
      dailyCallsTotal: newData.dailyCallsTotal,
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

  const tabDescriptions = [
    t('stepThresholdsAndAttributes.accessRequirements.tabs.certifiedDescription'),
    t('stepThresholdsAndAttributes.accessRequirements.tabs.verifiedDescription'),
    t('stepThresholdsAndAttributes.accessRequirements.tabs.declaredDescription'),
  ]

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer title={t('stepThresholdsAndAttributes.thresholdsTitle')} component="div">
          <RHFSwitch
            label={t('stepThresholdsAndAttributes.thresholdsSwitch.label')}
            name="thresholdsSection"
            sx={{ my: 0 }}
          />
          {isThresholdSectionVisible && (
            <>
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <RHFTextField
                  size="small"
                  name="dailyCallsPerConsumer"
                  label={t('stepThresholdsAndAttributes.dailyCallsPerConsumerField.label')}
                  infoLabel={t('stepThresholdsAndAttributes.dailyCallsPerConsumerField.infoLabel')}
                  type="number"
                  inputProps={{ min: '1' }}
                  rules={{ required: true, min: 1 }}
                  sx={{ my: 0, flex: 1 }}
                  required
                />
                <RHFTextField
                  size="small"
                  name="dailyCallsTotal"
                  label={t('stepThresholdsAndAttributes.dailyCallsTotalField.label')}
                  infoLabel={t('stepThresholdsAndAttributes.dailyCallsTotalField.infoLabel')}
                  type="number"
                  inputProps={{ min: '1' }}
                  sx={{ my: 0, flex: 1 }}
                  rules={{
                    required: true,
                    min: {
                      value: dailyCallsPerConsumer ?? 1,
                      message: t('stepThresholdsAndAttributes.dailyCallsTotalField.validation.min'),
                    },
                  }}
                  required
                />
              </Stack>
              <Alert severity="info" sx={{ mt: 3 }}>
                {t('stepThresholdsAndAttributes.thresholdsInfoAlert')}
              </Alert>
            </>
          )}
        </SectionContainer>

        {/**
         * TODO: Implement correct UI for access requirements section
         */}
        <SectionContainer
          title={t('stepThresholdsAndAttributes.accessRequirements.title')}
          description={
            <>
              {t('stepThresholdsAndAttributes.accessRequirements.description')}{' '}
              <Link href={attributesHelpLink} target="_blank" underline="hover">
                {t('stepThresholdsAndAttributes.accessRequirements.learnMoreLink')}
              </Link>
            </>
          }
          component="div"
          sx={{ mt: 4 }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 1 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label={t('stepThresholdsAndAttributes.accessRequirements.tabs.certified')} />
              <Tab label={t('stepThresholdsAndAttributes.accessRequirements.tabs.verified')} />
              <Tab label={t('stepThresholdsAndAttributes.accessRequirements.tabs.declared')} />
            </Tabs>
          </Box>

          <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">
            {tabDescriptions[activeTab]}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Button variant="outlined" color="primary" sx={{ fontWeight: 700 }} disabled>
              {t('stepThresholdsAndAttributes.accessRequirements.createRequirementBtn')}
            </Button>
          </Box>
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

export const EServiceTemplateCreateStepThresholdsAndAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={550} />
}
