import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { RHFSwitch, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { minutesToSeconds, secondsToMinutes } from '@/utils/format.utils'
import { Box, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import omit from 'lodash/omit'
import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { payloadVerificationGuideLink } from '@/config/constants'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { TemplateMutations, TemplateQueries } from '@/api/template'
import { useQuery } from '@tanstack/react-query'

export type EServiceTemplateCreateStepVersionFormValues = {
  audienceDescription: string
  version: number
  voucherLifespan: number
  eserviceDescription: string
  dailyCallsPerConsumer?: number
  dailyCallsTotal?: number
  agreementApprovalPolicy: boolean
}

export const EServiceTemplateCreateStepVersion: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('template', { keyPrefix: 'create' })

  const { template: producerEserviceTemplate, forward, back } = useEServiceTemplateCreateContext()

  const templateId = producerEserviceTemplate?.id
  const versionTemplateId = producerEserviceTemplate?.draftVersion?.id

  const template =
    templateId && versionTemplateId
      ? useQuery(TemplateQueries.getSingle(templateId, versionTemplateId))
      : undefined

  const { mutate: updateVersionDraft } = TemplateMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const defaultValues: EServiceTemplateCreateStepVersionFormValues = {
    version: template?.data?.version ?? 1,
    audienceDescription: template?.data?.eserviceTemplate.audienceDescription ?? '',
    voucherLifespan: template?.data ? secondsToMinutes(template.data.voucherLifespan) : 1,
    eserviceDescription: template?.data?.eserviceTemplate.eserviceDescription ?? '',
    dailyCallsPerConsumer: template?.data?.dailyCallsPerConsumer,
    dailyCallsTotal: template?.data?.dailyCallsTotal,
    agreementApprovalPolicy: template?.data
      ? template.data.agreementApprovalPolicy === 'MANUAL'
      : false,
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit = (values: EServiceTemplateCreateStepVersionFormValues) => {
    forward()
    if (!template?.data) return //TODO CONTROLLO CHECK

    const newTemplateData = {
      ...values,
      voucherLifespan: minutesToSeconds(values.voucherLifespan),
      audienceDescription: [values.audienceDescription],
      agreementApprovalPolicy: values.agreementApprovalPolicy
        ? ('MANUAL' as const)
        : ('AUTOMATIC' as const),
    }

    // If nothing has changed skip the update call
    const areTemplatesEquals = compareObjects(newTemplateData, template.data)
    if (areTemplatesEquals) {
      forward()
      return
    }

    const payload = {
      eserviceTemplateId: template.data.id,
      attributes: { certified: [], verified: [], declared: [] },
      ...omit(newTemplateData, ['version']),
    }

    /*updateVersionDraft(
      {
        ...payload,
        eserviceTemplateId: template.id,
        attributes: remapDescriptorAttributesToDescriptorAttributesSeed(template.attributes), //TODO
      },
      { onSuccess: forward }
    )*/
  }

  const dailyCallsPerConsumer = formMethods.watch('dailyCallsPerConsumer')

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer
          title={t('step2.versionTitle', { versionNumber: template?.data?.version ?? 1 })}
          component="div"
        >
          <RHFTextField
            size="small"
            name="versionDescription"
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
          <SectionContainer innerSection title={t('step2.thresholdSection.title')} sx={{ mt: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <RHFTextField
                size="small"
                name="dailyCallsPerConsumer"
                label={t('step2.thresholdSection.dailyCallsPerConsumerField.label')}
                type="number"
                inputProps={{ min: '1' }}
                rules={{ min: 1 }}
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
                  min: {
                    value: dailyCallsPerConsumer ?? 1,
                    message: t('step2.thresholdSection.dailyCallsTotalField.validation.min'),
                  },
                }}
              />
            </Stack>
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
