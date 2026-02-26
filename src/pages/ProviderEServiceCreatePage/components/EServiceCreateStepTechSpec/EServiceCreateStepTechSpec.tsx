import { EServiceMutations } from '@/api/eservice'
import { SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { minutesToSeconds, secondsToMinutes } from '@/utils/format.utils'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import { IconLink } from '@/components/shared/IconLink'
import LaunchIcon from '@mui/icons-material/Launch'
import { openApiCheckerLink } from '@/config/constants'
import { trackEvent } from '@/config/tracking'
import { match } from 'ts-pattern'
import { EServiceInterfaceSection } from '../sections/EServiceInterfaceSection'
import { EServiceVoucherSection } from '../sections/EServiceVoucherSection'

export type EServiceCreateStepTechSpecFormValues = {
  audience: string
  voucherLifespan: number
}

export const EServiceCreateStepTechSpec: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })

  const { descriptor, forward, back } = useEServiceCreateContext()

  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const { mutate: updateInstanceVersionDraft } = EServiceMutations.useUpdateInstanceVersionDraft({
    suppressSuccessToast: true,
  })

  const defaultValues: EServiceCreateStepTechSpecFormValues = {
    audience: descriptor?.audience?.[0] ?? '',
    voucherLifespan: descriptor ? secondsToMinutes(descriptor.voucherLifespan) : 1,
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit: SubmitHandler<EServiceCreateStepTechSpecFormValues> = (values) => {
    if (!descriptor) return

    const newDescriptorData = {
      ...values,
      voucherLifespan: minutesToSeconds(values.voucherLifespan),
      audience: [values.audience],
    }

    // If nothing has changed skip the update call
    const areDescriptorsEquals = compareObjects(newDescriptorData, descriptor)
    if (areDescriptorsEquals) {
      forward()
      return
    }

    const commonPayload = {
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      audience: newDescriptorData.audience,
      agreementApprovalPolicy: descriptor.agreementApprovalPolicy,
      dailyCallsPerConsumer: descriptor.dailyCallsPerConsumer ?? 1,
      dailyCallsTotal: descriptor.dailyCallsTotal ?? 1,
    }

    match(isEServiceCreatedFromTemplate)
      .with(true, () => updateInstanceVersionDraft(commonPayload, { onSuccess: forward }))
      .with(false, () =>
        updateVersionDraft(
          {
            ...commonPayload,
            voucherLifespan: newDescriptorData.voucherLifespan,
            attributes: remapDescriptorAttributesToDescriptorAttributesSeed(descriptor.attributes),
          },
          { onSuccess: forward }
        )
      )
      .exhaustive()
  }

  // if this field is true some textField should be disabled
  const isEServiceCreatedFromTemplate = Boolean(descriptor?.templateRef?.templateVersionId)

  const sectionDescription =
    descriptor?.eservice.technology === 'SOAP' ? (
      t(`step4.interface.description.soap`)
    ) : (
      <>
        {t(`step4.interface.description.rest`)}{' '}
        <IconLink
          href={openApiCheckerLink}
          target="_blank"
          endIcon={<LaunchIcon fontSize="small" />}
          onClick={() => trackEvent('INTEROP_EXT_LINK_DTD_API_CHECKER', { src: 'CREATE_ESERVICE' })}
        >
          {t('step4.interface.description.restLinkLabel')}
        </IconLink>
      </>
    )

  return (
    <FormProvider {...formMethods}>
      <EServiceInterfaceSection
        description={sectionDescription}
        isEServiceCreatedFromTemplate={isEServiceCreatedFromTemplate}
      />
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <EServiceVoucherSection isEServiceCreatedFromTemplate={isEServiceCreatedFromTemplate} />
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

export const EServiceCreateStepTechSpecSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={550} />
}
