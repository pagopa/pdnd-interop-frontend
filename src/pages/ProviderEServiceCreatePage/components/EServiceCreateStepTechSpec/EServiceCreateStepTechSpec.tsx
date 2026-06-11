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
import { trackEvent } from '@/config/tracking'
import { match } from 'ts-pattern'
import { EServiceInterfaceSection } from '../sections/EServiceInterfaceSection'
import { EServiceVoucherSection } from '../sections/EServiceVoucherSection'
import {
  EServiceProducerKeychainSection,
  type ProducerKeychainFieldArrayItem,
} from '../sections/EServiceProducerKeychainSection'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { EServiceAsyncExchangeSection } from '../sections/EServiceAsyncExchangeSection'
import { getAsyncExchangePropertiesWithDefaults } from '@/utils/eservice.utils'
import { AuthHooks } from '@/api/auth/auth.hooks'
import { RestInterfaceDescription } from '@/components/shared/RestInterfaceDescription'

type AsyncExchangePropertiesFormValues = {
  responseTime: number | ''
  resourceAvailableTime: number | ''
  maxResultSet: number | ''
  confirmation: boolean
  bulk: boolean
}

export type EServiceCreateStepTechSpecFormValues = {
  audience: string
  voucherLifespan: number
  keychains: ProducerKeychainFieldArrayItem[]
  asyncExchangeProperties: AsyncExchangePropertiesFormValues
}

export const EServiceCreateStepTechSpec: React.FC<ActiveStepProps> = () => {
  const { descriptor } = useEServiceCreateContext()

  const { isOperatorAPI } = AuthHooks.useJwt()

  const isEServiceCreatedFromTemplate = Boolean(descriptor?.templateRef?.templateVersionId)
  const isEServiceAsync = Boolean(descriptor?.eservice.asyncExchange)

  const { data: initialAssociatedKeychains, isLoading } = useQuery({
    ...KeychainQueries.getAllKeychainsList({
      eserviceId: descriptor?.eservice.id ?? '',
    }),
    enabled: isEServiceAsync && Boolean(descriptor?.eservice.id) && !isOperatorAPI,
  })

  if (isEServiceAsync && isLoading) {
    return <EServiceCreateStepTechSpecSkeleton />
  }

  return (
    <EServiceCreateStepTechSpecForm
      isEServiceCreatedFromTemplate={isEServiceCreatedFromTemplate}
      initialAssociatedKeychains={initialAssociatedKeychains ?? []}
    />
  )
}

type EServiceCreateStepTechSpecFormProps = {
  isEServiceCreatedFromTemplate: boolean
  initialAssociatedKeychains: CompactProducerKeychain[]
}

const EServiceCreateStepTechSpecForm: React.FC<EServiceCreateStepTechSpecFormProps> = ({
  isEServiceCreatedFromTemplate,
  initialAssociatedKeychains,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { descriptor, forward, back, areEServiceGeneralInfoEditable } = useEServiceCreateContext()
  const queryClient = useQueryClient()

  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const { mutate: updateInstanceVersionDraft } = EServiceMutations.useUpdateInstanceVersionDraft({
    suppressSuccessToast: true,
  })

  const { mutateAsync: addKeychainToEService } = KeychainMutations.useAddKeychainToEService()
  const { mutateAsync: removeKeychainFromEService } =
    KeychainMutations.useRemoveKeychainFromEService({ withConfirmationDialog: false })

  const defaultValues: EServiceCreateStepTechSpecFormValues = {
    audience: descriptor?.audience?.[0] ?? '',
    voucherLifespan: descriptor ? secondsToMinutes(descriptor.voucherLifespan) : 1,
    keychains:
      initialAssociatedKeychains.length > 0
        ? initialAssociatedKeychains.map((k) => ({ value: k }))
        : [{ value: null }],
    asyncExchangeProperties: getAsyncExchangePropertiesWithDefaults(
      descriptor?.asyncExchangeProperties
    ),
  }

  const formMethods = useForm<EServiceCreateStepTechSpecFormValues>({ defaultValues })
  const isAsyncExchange = descriptor?.eservice.asyncExchange === true

  const onSubmit: SubmitHandler<EServiceCreateStepTechSpecFormValues> = async (values) => {
    if (!descriptor) return
    const { asyncExchangeProperties, ...restValues } = values

    const hasValidAsyncProps =
      asyncExchangeProperties.responseTime !== '' &&
      asyncExchangeProperties.resourceAvailableTime !== '' &&
      asyncExchangeProperties.maxResultSet !== ''

    const asyncExchangeNumericPayload =
      isAsyncExchange && hasValidAsyncProps
        ? {
            responseTime: Number(asyncExchangeProperties.responseTime),
            resourceAvailableTime: Number(asyncExchangeProperties.resourceAvailableTime),
            maxResultSet: Number(asyncExchangeProperties.maxResultSet),
          }
        : null

    if (isAsyncExchange && areEServiceGeneralInfoEditable) {
      const allKeychainsListQuery = KeychainQueries.getAllKeychainsList({
        eserviceId: descriptor.eservice.id,
      })

      const currentAssociatedKeychains =
        queryClient.getQueryData<CompactProducerKeychain[]>(allKeychainsListQuery.queryKey) ??
        initialAssociatedKeychains

      const initialIds = currentAssociatedKeychains.map((k) => k.id)
      const finalIds = values.keychains
        .map((row) => row.value?.id)
        .filter((id): id is string => Boolean(id))
      const finalAssociatedKeychains = values.keychains
        .map((row) => row.value)
        .filter((keychain): keychain is CompactProducerKeychain => Boolean(keychain?.id))

      const addedIds = finalIds.filter((id) => !initialIds.includes(id))
      const removedIds = initialIds.filter((id) => !finalIds.includes(id))

      const results = await Promise.allSettled([
        ...addedIds.map((keychainId) =>
          addKeychainToEService({ keychainId, eserviceId: descriptor.eservice.id })
        ),
        ...removedIds.map((keychainId) =>
          removeKeychainFromEService({ keychainId, eserviceId: descriptor.eservice.id })
        ),
      ])

      const hasFailures = results.some((r) => r.status === 'rejected')
      if (hasFailures) {
        try {
          const refreshedKeychains = await queryClient.fetchQuery(allKeychainsListQuery)
          formMethods.reset({
            ...formMethods.getValues(),
            keychains:
              refreshedKeychains.length > 0
                ? refreshedKeychains.map((k) => ({ value: k }))
                : [{ value: null }],
          })
        } catch {
          // Refetch failed: keep the user on the step with the current form state so they can retry.
        }
        return
      }

      queryClient.setQueryData(allKeychainsListQuery.queryKey, finalAssociatedKeychains)
    }

    const newDescriptorData = {
      ...restValues,
      voucherLifespan: minutesToSeconds(values.voucherLifespan),
      audience: [values.audience],
      ...(asyncExchangeNumericPayload
        ? {
            asyncExchangeProperties: {
              ...asyncExchangeNumericPayload,
              confirmation: asyncExchangeProperties.confirmation,
              bulk: asyncExchangeProperties.bulk,
            },
          }
        : {}),
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
      .with(true, () =>
        updateInstanceVersionDraft(
          {
            ...commonPayload,
            ...(asyncExchangeNumericPayload
              ? { asyncExchangeProperties: asyncExchangeNumericPayload }
              : {}),
          },
          { onSuccess: forward }
        )
      )
      .with(false, () =>
        updateVersionDraft(
          {
            ...commonPayload,
            voucherLifespan: newDescriptorData.voucherLifespan,
            attributes: remapDescriptorAttributesToDescriptorAttributesSeed(descriptor.attributes),
            ...(newDescriptorData.asyncExchangeProperties
              ? { asyncExchangeProperties: newDescriptorData.asyncExchangeProperties }
              : {}),
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
      <RestInterfaceDescription
        description={t('step4.interface.description.rest')}
        beforePublishing={t('step4.interface.description.beforePublishing')}
        technicalCompliance={t('step4.interface.description.technicalCompliance')}
        technicalComplianceDescription={t(
          'step4.interface.description.technicalComplianceDescription'
        )}
        semanticCompliance={t('step4.interface.description.semanticCompliance')}
        semanticComplianceDescription={t(
          'step4.interface.description.semanticComplianceDescription'
        )}
        openApiCheckerLabel={t('step4.interface.description.restLinkLabel')}
        schemaEditorLabel={t('step4.interface.description.schemaEditorLinkLabel')}
        onOpenApiCheckerClick={() =>
          trackEvent('INTEROP_EXT_LINK_DTD_API_CHECKER', { src: 'CREATE_ESERVICE' })
        }
      />
    )

  return (
    <FormProvider {...formMethods}>
      <EServiceInterfaceSection
        description={sectionDescription}
        descriptionTypographyProps={{
          component:
            descriptor?.eservice.technology === 'REST' && !isEServiceCreatedFromTemplate
              ? 'div'
              : undefined,
        }}
        isEServiceCreatedFromTemplate={isEServiceCreatedFromTemplate}
      />
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <EServiceVoucherSection isEServiceCreatedFromTemplate={isEServiceCreatedFromTemplate} />
        {isAsyncExchange && (
          <EServiceAsyncExchangeSection
            areEServiceGeneralInfoEditable={true}
            isEServiceCreatedFromTemplate={isEServiceCreatedFromTemplate}
          />
        )}
        {isAsyncExchange && <EServiceProducerKeychainSection />}
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
