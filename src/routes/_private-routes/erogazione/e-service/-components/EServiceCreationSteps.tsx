import type { EServiceMode } from '@/api/api.generatedTypes'
import { getDescriptorProviderQueryOptions, getSingleEServiceQueryOptions } from '@/api/eservice'
import { Stepper } from '@/components/shared/Stepper'
import { useActiveStep } from '@/hooks/useActiveStep'
import { EServiceCreateContextProvider } from '@/pages/ProviderEServiceCreatePage/components/EServiceCreateContext'
import {
  EServiceCreateStepAttributes,
  EServiceCreateStepAttributesSkeleton,
} from '@/pages/ProviderEServiceCreatePage/components/EServiceCreateStepAttributes'
import {
  EServiceCreateStepDocuments,
  EServiceCreateStepDocumentsSkeleton,
} from '@/pages/ProviderEServiceCreatePage/components/EServiceCreateStepDocuments'
import {
  EServiceCreateStepGeneral,
  EServiceCreateStepGeneralSkeleton,
} from '@/pages/ProviderEServiceCreatePage/components/EServiceCreateStepGeneral'
import {
  EServiceCreateStepPurpose,
  EServiceCreateStepPurposeSkeleton,
} from '@/pages/ProviderEServiceCreatePage/components/EServiceCreateStepPurpose/EServiceCreateStepPurpose'
import {
  EServiceCreateStepVersion,
  EServiceCreateStepVersionSkeleton,
} from '@/pages/ProviderEServiceCreatePage/components/EServiceCreateStepVersion'
import { URL_FRAGMENTS } from '@/router/router.utils'
import type { StepperStep } from '@/types/common.types'
import { useQuery } from '@tanstack/react-query'
import { redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function EServiceCreationSteps(params?: { eserviceId?: string; descriptorId?: string }) {
  const { t } = useTranslation('eservice')
  const { activeStep, ...stepProps } = useActiveStep()

  const eserviceId = params?.eserviceId
  const descriptorId = params?.descriptorId

  const isNewEService = !eserviceId
  const isDraftEService = !isNewEService && descriptorId === URL_FRAGMENTS.FIRST_DRAFT
  const isDraftDescriptor = Boolean(!isNewEService && descriptorId && !isDraftEService)

  const [selectedEServiceMode, setSelectedEServiceMode] = useState<EServiceMode | undefined>()

  const { data: eservice, isLoading: isLoadingEService } = useQuery({
    ...getSingleEServiceQueryOptions(eserviceId!),
    enabled: isDraftEService,
  })

  const { data: descriptor, isLoading: isLoadingDescriptor } = useQuery({
    ...getDescriptorProviderQueryOptions({ eserviceId: eserviceId!, descriptorId: descriptorId! }),
    enabled: isDraftDescriptor,
  })

  /**
   *  If we are creating a new e-service that has no descriptors, we take the e-service data from the
   *  useGetSingle query. Otherwise, we take it from the descriptor using the useGetDescriptorProvider query.
   */
  const eserviceData = isDraftEService ? eservice : descriptor?.eservice

  const eserviceMode = selectedEServiceMode || eserviceData?.mode || 'DELIVER'

  const steps: Array<StepperStep> =
    eserviceMode === 'DELIVER'
      ? [
          { label: t('create.stepper.step1Label'), component: EServiceCreateStepGeneral },
          { label: t('create.stepper.step2Label'), component: EServiceCreateStepVersion },
          { label: t('create.stepper.step3Label'), component: EServiceCreateStepAttributes },
          { label: t('create.stepper.step4Label'), component: EServiceCreateStepDocuments },
        ]
      : [
          { label: t('create.stepper.step1Label'), component: EServiceCreateStepGeneral },
          { label: t('create.stepper.step2ReceiveLabel'), component: EServiceCreateStepPurpose },
          { label: t('create.stepper.step2Label'), component: EServiceCreateStepVersion },
          { label: t('create.stepper.step3Label'), component: EServiceCreateStepAttributes },
          { label: t('create.stepper.step4Label'), component: EServiceCreateStepDocuments },
        ]

  const { component: Step } = steps[activeStep]

  // If this e-service is not in draft, you cannot edit it
  if (descriptor && descriptor.state !== 'DRAFT') {
    throw redirect({
      to: '/erogazione/e-service/$eserviceId/$descriptorId',
      params: { eserviceId: descriptor.eservice.id, descriptorId: descriptor.id },
    })
  }

  const isReady = !!(
    isNewEService ||
    (isDraftEService && !isLoadingEService && eservice) ||
    (isDraftDescriptor && !isLoadingDescriptor && descriptor)
  )

  const stepsLoadingSkeletons =
    eserviceMode === 'DELIVER'
      ? [
          <EServiceCreateStepGeneralSkeleton key={1} />,
          <EServiceCreateStepVersionSkeleton key={2} />,
          <EServiceCreateStepAttributesSkeleton key={3} />,
          <EServiceCreateStepDocumentsSkeleton key={4} />,
        ]
      : [
          <EServiceCreateStepGeneralSkeleton key={1} />,
          <EServiceCreateStepPurposeSkeleton key={2} />,
          <EServiceCreateStepVersionSkeleton key={3} />,
          <EServiceCreateStepAttributesSkeleton key={4} />,
          <EServiceCreateStepDocumentsSkeleton key={5} />,
        ]

  // const intro = isNewEService
  //   ? { title: t('create.emptyTitle') }
  //   : {
  //       title: eserviceData?.name,
  //       description: eserviceData?.description,
  //     }

  return (
    // <PageContainer
    //   {...intro}
    //   backToAction={{
    //     label: t('backToListBtn'),
    //     to: 'PROVIDE_ESERVICE_LIST',
    //   }}
    //   isLoading={!isReady}
    // >
    <>
      <Stepper steps={steps} activeIndex={activeStep} />
      {isReady && (
        <EServiceCreateContextProvider
          eservice={eserviceData}
          descriptor={descriptor}
          eserviceMode={eserviceMode}
          onEserviceModeChange={setSelectedEServiceMode}
          {...stepProps}
        >
          <Step />
        </EServiceCreateContextProvider>
      )}
      {!isReady && stepsLoadingSkeletons[activeStep]}
    </>
    // </PageContainer>
  )
}
