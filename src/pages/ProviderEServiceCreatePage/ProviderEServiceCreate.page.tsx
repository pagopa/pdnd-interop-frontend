import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import type { StepperStep } from '@/types/common.types'
import {
  EServiceCreateStepGeneral,
  EServiceCreateStepGeneralSkeleton,
} from './components/EServiceCreateStepGeneral'
import {
  EServiceCreateStepVersion,
  EServiceCreateStepVersionSkeleton,
} from './components/EServiceCreateStepVersion'
import {
  EServiceCreateStepDocuments,
  EServiceCreateStepDocumentsSkeleton,
} from './components/EServiceCreateStepDocuments'
import { useTranslation } from 'react-i18next'
import { useActiveStep } from '@/hooks/useActiveStep'
import { Redirect, useParams } from '@/router'
import { EServiceQueries } from '@/api/eservice'
import { Stepper } from '@/components/shared/Stepper'
import { EServiceCreateContextProvider } from './components/EServiceCreateContext'
import { URL_FRAGMENTS } from '@/router/router.utils'
import {
  EServiceCreateStepAttributes,
  EServiceCreateStepAttributesSkeleton,
} from './components/EServiceCreateStepAttributes'
import {
  EServiceCreateStepPurpose,
  EServiceCreateStepPurposeSkeleton,
} from './components/EServiceCreateStepPurpose/EServiceCreateStepPurpose'
import { useSearchParams } from 'react-router-dom'

const ProviderEServiceCreatePage: React.FC = () => {
  const { t } = useTranslation('eservice')
  const params = useParams<'PROVIDE_ESERVICE_CREATE' | 'PROVIDE_ESERVICE_EDIT'>()
  const { activeStep, ...stepProps } = useActiveStep()

  const isNewEService = !params?.eserviceId
  const isDraftEService = !isNewEService && params?.descriptorId === URL_FRAGMENTS.FIRST_DRAFT
  const isDraftDescriptor = !isNewEService && params?.descriptorId && !isDraftEService

  const { data: eservice, isLoading: isLoadingEService } = EServiceQueries.useGetSingle(
    params?.eserviceId,
    { suspense: false, enabled: !!isDraftEService }
  )

  const { data: descriptor, isLoading: isLoadingDescriptor } =
    EServiceQueries.useGetDescriptorProvider(params?.eserviceId, params?.descriptorId, {
      suspense: false,
      enabled: !!isDraftDescriptor,
    })

  /**
   *  If we are creating a new e-service that has no descriptors, we take the e-service data from the
   *  useGetSingle query. Otherwise, we take it from the descriptor using the useGetDescriptorProvider query.
   */
  const eserviceData = isDraftEService ? eservice : descriptor?.eservice

  const [searchParams, setSearchParams] = useSearchParams()

  const handleEserviceModeChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set('mode', value)
      return prev
    })
  }

  const eserviceMode = eserviceData?.mode
    ? eserviceData.mode
    : searchParams.get('mode') ?? 'DELIVER'

  const steps: Array<StepperStep> =
    eserviceMode === 'DELIVER'
      ? [
          { label: t('create.stepper.step1Label'), component: EServiceCreateStep1General },
          { label: t('create.stepper.step2Label'), component: EServiceCreateStep2Version },
          { label: t('create.stepper.step3Label'), component: EServiceCreateStep3Attributes },
          { label: t('create.stepper.step4Label'), component: EServiceCreateStep4Documents },
        ]
      : [
          { label: t('create.stepper.step1Label'), component: EServiceCreateStepGeneral },
          { label: 'Purpose step', component: EServiceCreateStepPurpose },
          { label: t('create.stepper.step2Label'), component: EServiceCreateStepVersion },
          { label: t('create.stepper.step3Label'), component: EServiceCreateStepAttributes },
          { label: t('create.stepper.step4Label'), component: EServiceCreateStepDocuments },
        ]

  const { component: Step } = steps[activeStep]

  // If this e-service is not in draft, you cannot edit it
  if (descriptor && descriptor.state !== 'DRAFT') {
    return (
      <Redirect
        to="PROVIDE_ESERVICE_MANAGE"
        params={{ eserviceId: descriptor.eservice.id, descriptorId: descriptor.id }}
      />
    )
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

  const intro = isNewEService
    ? { title: t('create.emptyTitle') }
    : {
        title: eserviceData?.name,
        description: eserviceData?.description,
      }

  return (
    <PageContainer
      {...intro}
      backToAction={{
        label: t('backToListBtn'),
        to: 'PROVIDE_ESERVICE_LIST',
      }}
      isLoading={!isReady}
    >
      <Stepper steps={steps} activeIndex={activeStep} />
      {isReady && (
        <EServiceCreateContextProvider
          eservice={eserviceData}
          descriptor={descriptor}
          onEserviceModeChange={handleEserviceModeChange}
          {...stepProps}
        >
          <Step />
        </EServiceCreateContextProvider>
      )}
      {!isReady && stepsLoadingSkeletons[activeStep]}
    </PageContainer>
  )
}

export default ProviderEServiceCreatePage
