import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Box, Link /* Divider */, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
// import { AddAttributesToForm } from '../../../../components/shared/AddAttributesToForm'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceMutations } from '@/api/eservice'
import { Trans, useTranslation } from 'react-i18next'
import { StepActions } from '@/components/shared/StepActions'
import type {
  // DescriptorAttribute,
  // DescriptorAttributes,
  UpdateEServiceDescriptorSeed,
  UpdateEServiceDescriptorTemplateInstanceSeed,
} from '@/api/api.generatedTypes'
// import type { AttributeKey } from '@/types/attribute.types'
// import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// import { CreateAttributeDrawer } from '../../../../components/shared/CreateAttributeDrawer'
// import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import { EServiceCreateStepDocumentsInterface } from '../EServiceCreateStepDocuments/EServiceCreateStepDocumentsInterface'
import { IconLink } from '@/components/shared/IconLink'
import LaunchIcon from '@mui/icons-material/Launch'
import { openApiCheckerLink, payloadVerificationGuideLink } from '@/config/constants'
import { trackEvent } from '@/config/tracking'
import { minutesToSeconds, secondsToMinutes } from '@/utils/format.utils'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { compareObjects } from '@/utils/common.utils'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'

export type CreateStepTechSpecFormValues = {
  audience: string
  voucherLifespan: number
}

export const EServiceCreateStepTechSpec: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { descriptor, forward, back } = useEServiceCreateContext()

  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })
  const { mutate: updateInstanceVersionDraft } = EServiceMutations.useUpdateInstanceVersionDraft({
    suppressSuccessToast: true,
  })

  const isEServiceCreatedFromTemplate = Boolean(descriptor?.templateRef?.templateVersionId)

  const defaultValues: CreateStepTechSpecFormValues = {
    voucherLifespan: descriptor ? secondsToMinutes(descriptor.voucherLifespan) : 1,
    audience: descriptor?.audience?.[0] ?? '',
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit = (values: CreateStepTechSpecFormValues) => {
    if (!descriptor) return

    const newDescriptorData = {
      ...descriptor,
      voucherLifespan: minutesToSeconds(values.voucherLifespan),
      audience: [values.audience],
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
        dailyCallsPerConsumer: newDescriptorData.dailyCallsPerConsumer,
        dailyCallsTotal: newDescriptorData.dailyCallsTotal,
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
      const payload: UpdateEServiceDescriptorSeed = {
        audience: newDescriptorData.audience,
        voucherLifespan: newDescriptorData.voucherLifespan,
        dailyCallsPerConsumer: newDescriptorData.dailyCallsPerConsumer,
        dailyCallsTotal: newDescriptorData.dailyCallsTotal,
        agreementApprovalPolicy: newDescriptorData.agreementApprovalPolicy,
        attributes: remapDescriptorAttributesToDescriptorAttributesSeed(
          newDescriptorData.attributes
        ),
      }

      updateVersionDraft(
        {
          ...payload,
          eserviceId: descriptor.eservice.id,
          descriptorId: descriptor.id,
        },
        { onSuccess: forward }
      )
    }
  }

  const sectionDescription =
    descriptor?.eservice.technology === 'SOAP' ? (
      t(`step3.interface.description.soap`)
    ) : (
      <>
        {t(`step3.interface.description.rest`)}{' '}
        <IconLink
          href={openApiCheckerLink}
          target="_blank"
          endIcon={<LaunchIcon fontSize="small" />}
          onClick={() => trackEvent('INTEROP_EXT_LINK_DTD_API_CHECKER', { src: 'CREATE_ESERVICE' })}
        >
          {t('step3.interface.description.restLinkLabel')}
        </IconLink>
      </>
    )

  return (
    <>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <SectionContainer title={t('step3.interface.title')} description={sectionDescription}>
            <EServiceCreateStepDocumentsInterface />
          </SectionContainer>
          <SectionContainer title={t('step3.voucherSection.title')} sx={{ mt: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <RHFTextField
                size="small"
                name="voucherLifespan"
                label={t('step3.voucherSection.voucherLifespanField.label')}
                infoLabel={t('step3.voucherSection.voucherLifespanField.infoLabel')}
                type="number"
                inputProps={{ min: 1, max: 1440 }}
                rules={{ required: true, min: 1, max: 1440 }}
                sx={{ flex: 1, my: 0 }}
                disabled={isEServiceCreatedFromTemplate}
              />

              <RHFTextField
                size="small"
                name="audience"
                label={t('step3.voucherSection.audienceField.label')}
                infoLabel={
                  <Trans
                    components={{ 1: <Link href={payloadVerificationGuideLink} target="_blank" /> }}
                  >
                    {t('step3.voucherSection.audienceField.infoLabel')}
                  </Trans>
                }
                inputProps={{ maxLength: 250 }}
                rules={{ required: true, minLength: 1 }}
                sx={{ flex: 1, my: 0 }}
              />
            </Stack>
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
    </>
  )
}

// TODO fix height of the skeleton
export const EServiceCreateStepTechSpecSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={924} />
}
