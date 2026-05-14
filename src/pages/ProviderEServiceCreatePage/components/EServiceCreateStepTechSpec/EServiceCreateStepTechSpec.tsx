import { EServiceMutations } from '@/api/eservice'
import { KeychainMutations, KeychainQueries } from '@/api/keychain'
import type { CompactProducerKeychain } from '@/api/api.generatedTypes'
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
import { EServiceProducerKeychainSection } from '../sections/EServiceProducerKeychainSection'
import { useQuery } from '@tanstack/react-query'

type KeychainFieldArrayItem = { value: CompactProducerKeychain | null }

export type EServiceCreateStepTechSpecFormValues = {
  audience: string
  voucherLifespan: number
  keychains: KeychainFieldArrayItem[]
}

export const EServiceCreateStepTechSpec: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { descriptor, eserviceTemplate, forward, back } = useEServiceCreateContext()

  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const { mutate: updateInstanceVersionDraft } = EServiceMutations.useUpdateInstanceVersionDraft({
    suppressSuccessToast: true,
  })

  const { mutateAsync: addKeychainToEService } = KeychainMutations.useAddKeychainToEService()
  const { mutateAsync: removeKeychainFromEService } =
    KeychainMutations.useRemoveKeychainFromEService()

  // if this field is true some textField should be disabled
  const isEServiceCreatedFromTemplate = Boolean(descriptor?.templateRef?.templateVersionId)

  const isEServiceAsync = Boolean(descriptor?.eservice.asyncExchange)
  const isProducerKeychainSectionVisible =
    isEServiceAsync && !eserviceTemplate && !isEServiceCreatedFromTemplate

  const { data: initialAssociatedKeychains = [] } = useQuery({
    ...KeychainQueries.getKeychainsList({
      eserviceId: descriptor?.eservice.id ?? '',
      limit: 50,
      offset: 0,
    }),
    select: (d) => d.results,
    enabled: isProducerKeychainSectionVisible && Boolean(descriptor?.eservice.id),
  })

  const defaultValues: EServiceCreateStepTechSpecFormValues = {
    audience: descriptor?.audience?.[0] ?? '',
    voucherLifespan: descriptor ? secondsToMinutes(descriptor.voucherLifespan) : 1,
    keychains: [{ value: null }],
  }

  const formMethods = useForm({ defaultValues })

  const hasInitializedKeychainsRef = React.useRef(false)
  React.useEffect(() => {
    if (hasInitializedKeychainsRef.current) return
    if (!isProducerKeychainSectionVisible) return
    if (initialAssociatedKeychains.length === 0) return

    hasInitializedKeychainsRef.current = true
    formMethods.setValue(
      'keychains',
      initialAssociatedKeychains.map((k) => ({ value: k }))
    )
  }, [initialAssociatedKeychains, isProducerKeychainSectionVisible, formMethods])

  const onSubmit: SubmitHandler<EServiceCreateStepTechSpecFormValues> = async (values) => {
    if (!descriptor) return

    if (isProducerKeychainSectionVisible) {
      const initialIds = initialAssociatedKeychains.map((k) => k.id)
      const finalIds = values.keychains
        .map((row) => row.value?.id)
        .filter((id): id is string => Boolean(id))

      const addedIds = finalIds.filter((id) => !initialIds.includes(id))
      const removedIds = initialIds.filter((id) => !finalIds.includes(id))

      try {
        await Promise.all([
          ...addedIds.map((keychainId) =>
            addKeychainToEService({ keychainId, eserviceId: descriptor.eservice.id })
          ),
          ...removedIds.map((keychainId) =>
            removeKeychainFromEService({ keychainId, eserviceId: descriptor.eservice.id })
          ),
        ])
      } catch {
        // toast already shown by mutation meta; abort step submission
        return
      }
    }

    const newDescriptorData = {
      ...values,
      voucherLifespan: minutesToSeconds(values.voucherLifespan),
      audience: [values.audience],
    }

    // If nothing has changed skip the update call
    const { keychains: _keychains, ...newDescriptorDataWithoutKeychains } = newDescriptorData
    const areDescriptorsEquals = compareObjects(newDescriptorDataWithoutKeychains, descriptor)
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

  const sectionDescription =
    descriptor?.eservice.technology === 'SOAP' ? (
      t(`step4.interface.description.soap`)
    ) : isEServiceCreatedFromTemplate ? (
      t('step4.interface.description.restForm')
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
        {isProducerKeychainSectionVisible && <EServiceProducerKeychainSection />}
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
