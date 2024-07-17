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
import {
  EServiceCreateStepAttributes,
  EServiceCreateStepAttributesSkeleton,
} from './components/EServiceCreateStepAttributes'
import {
  EServiceCreateStepPurpose,
  EServiceCreateStepPurposeSkeleton,
} from './components/EServiceCreateStepPurpose/EServiceCreateStepPurpose'
import type { EServiceMode } from '@/api/api.generatedTypes'
import { useQuery } from '@tanstack/react-query'

const ProviderEServiceCreatePage: React.FC = () => {
  const { t } = useTranslation('eservice')
  const params = useParams<'PROVIDE_ESERVICE_CREATE' | 'PROVIDE_ESERVICE_EDIT'>()
  const { activeStep, ...stepProps } = useActiveStep()

  const isNewEService = !params?.descriptorId || !params?.eserviceId

  const [selectedEServiceMode, setSelectedEServiceMode] = React.useState<EServiceMode | undefined>()

  const { data: descriptor, isLoading: isLoadingDescriptor } = useQuery({
    ...EServiceQueries.getDescriptorProvider(
      params?.eserviceId as string,
      params?.descriptorId as string
    ),
    enabled: !isNewEService,
  })

  const eservice = descriptor?.eservice

  const eserviceMode =
    selectedEServiceMode || // The mode selected by the user
    eservice?.mode || // The mode of the e-service
    'DELIVER' // Default mode

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
    return (
      <Redirect
        to="PROVIDE_ESERVICE_MANAGE"
        params={{ eserviceId: descriptor.eservice.id, descriptorId: descriptor.id }}
      />
    )
  }

  const isReady = Boolean(isNewEService || (!isLoadingDescriptor && descriptor))

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
        title: eservice?.name,
        description: eservice?.description,
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
          descriptor={descriptor}
          eserviceMode={eserviceMode}
          onEserviceModeChange={setSelectedEServiceMode}
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
