import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import type { StepperStep } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import { useActiveStep } from '@/hooks/useActiveStep'
import { Redirect, useParams } from '@/router'
import { EServiceQueries } from '@/api/eservice'
import { Stepper } from '@/components/shared/Stepper'
import type { EServiceMode } from '@/api/api.generatedTypes'
import { useQuery } from '@tanstack/react-query'
import { CreateContextProvider } from '@/components/shared/CreateContext'
import {
  CreateStepVersion,
  CreateStepVersionSkeleton,
} from '@/components/shared/CreateFormComponents/CreateStepVersion'
import {
  CreateStepGeneral,
  CreateStepGeneralSkeleton,
} from '@/components/shared/CreateFormComponents/CreateStepGeneral'
import {
  CreateStepDocuments,
  CreateStepDocumentsSkeleton,
} from '@/components/shared/CreateFormComponents/CreateStepDocuments/CreateStepDocuments'
import {
  CreateStepAttributes,
  CreateStepAttributesSkeleton,
} from '@/components/shared/CreateFormComponents/CreateStepAttributes/CreateStepAttributes'
import {
  CreateStepPurpose,
  CreateStepPurposeSkeleton,
} from '@/components/shared/CreateFormComponents/CreateStepPurpose/CreateStepPurpose'

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
          { label: t('create.stepper.step1Label'), component: CreateStepGeneral },
          { label: t('create.stepper.step2Label'), component: CreateStepVersion },
          { label: t('create.stepper.step3Label'), component: CreateStepAttributes },
          { label: t('create.stepper.step4Label'), component: CreateStepDocuments },
        ]
      : [
          { label: t('create.stepper.step1Label'), component: CreateStepGeneral },
          { label: t('create.stepper.step2ReceiveLabel'), component: CreateStepPurpose },
          { label: t('create.stepper.step2Label'), component: CreateStepVersion },
          { label: t('create.stepper.step3Label'), component: CreateStepAttributes },
          { label: t('create.stepper.step4Label'), component: CreateStepDocuments },
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
          <CreateStepGeneralSkeleton key={1} />,
          <CreateStepVersionSkeleton key={2} />,
          <CreateStepAttributesSkeleton key={3} />,
          <CreateStepDocumentsSkeleton key={4} />,
        ]
      : [
          <CreateStepGeneralSkeleton key={1} />,
          <CreateStepPurposeSkeleton key={2} />,
          <CreateStepVersionSkeleton key={3} />,
          <CreateStepAttributesSkeleton key={4} />,
          <CreateStepDocumentsSkeleton key={5} />,
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
        <CreateContextProvider
          descriptor={descriptor}
          eserviceMode={eserviceMode}
          onEserviceModeChange={setSelectedEServiceMode}
          {...stepProps}
        >
          <Step />
        </CreateContextProvider>
      )}
      {!isReady && stepsLoadingSkeletons[activeStep]}
    </PageContainer>
  )
}

export default ProviderEServiceCreatePage
