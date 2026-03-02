import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import type { StepperStep } from '@/types/common.types'
import {
  EServiceCreateStepOne,
  EServiceCreateStepOneSkeleton,
} from './components/EServiceCreateStepOne'
import { EServiceCreateFromTemplateStepDocumentsSkeleton } from './components/EServiceCreateStepDocuments'
import { useTranslation } from 'react-i18next'
import { useActiveStep } from '@/hooks/useActiveStep'
import { Redirect, useParams } from '@/router'
import { EServiceQueries } from '@/api/eservice'
import { Stepper } from '@/components/shared/Stepper'
import { EServiceCreateContextProvider } from './components/EServiceCreateContext'
import {
  EServiceCreateStepPurpose,
  EServiceCreateStepPurposeSkeleton,
} from './components/EServiceCreateStepPurpose/EServiceCreateStepPurpose'
import type { EServiceMode } from '@/api/api.generatedTypes'
import { useQuery } from '@tanstack/react-query'
import { EServiceCreateFromTemplateStepPurpose } from './components/EServiceCreateStepPurpose/EServiceCreateFromTemplateStepPurpose'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import {
  EServiceCreateStepFour,
  EServiceCreateStepFourSkeleton,
} from './components/EServiceCreateStepFour'
import {
  EServiceCreateStepThree,
  EServiceCreateStepThreeSkeleton,
} from './components/EServiceCreateStepThree'
import {
  EServiceCreateStepTwo,
  EServiceCreateStepTwoSkeleton,
} from './components/EServiceCreateStepTwo'
import { Typography } from '@mui/material'

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
  const isEserviceFromTemplate = Boolean(descriptor?.templateRef)
  const eserviceTemplateId = descriptor?.templateRef?.templateId
  const { data: eserviceTemplate } = useQuery({
    ...EServiceTemplateQueries.getSingleByEServiceTemplateId(eserviceTemplateId as string),
    enabled: isEserviceFromTemplate,
  })

  const eserviceMode =
    selectedEServiceMode || // The mode selected by the user
    eservice?.mode || // The mode of the e-service
    'DELIVER' // Default mode

  const CreateStepPurpose = isEserviceFromTemplate
    ? EServiceCreateFromTemplateStepPurpose
    : EServiceCreateStepPurpose

  const steps: Array<StepperStep> =
    eserviceMode === 'DELIVER'
      ? [
          { label: t('create.stepper.step1Label'), component: EServiceCreateStepOne },
          { label: t('create.stepper.step2Label'), component: EServiceCreateStepTwo },
          { label: t('create.stepper.step3Label'), component: EServiceCreateStepThree },
          { label: t('create.stepper.step4Label'), component: EServiceCreateStepFour },
        ]
      : [
          { label: t('create.stepper.step1Label'), component: EServiceCreateStepOne },
          {
            label: t('create.stepper.step2ReceiveLabel'),
            component: CreateStepPurpose,
          },
          { label: t('create.stepper.step2Label'), component: EServiceCreateStepTwo },
          { label: t('create.stepper.step3Label'), component: EServiceCreateStepThree },
          { label: t('create.stepper.step4Label'), component: EServiceCreateStepFour },
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

  const CreateStepDocumentsSkeleton = isEserviceFromTemplate
    ? EServiceCreateFromTemplateStepDocumentsSkeleton
    : EServiceCreateStepFourSkeleton

  const CreateStepPurposeSkeleton = isEserviceFromTemplate
    ? EServiceCreateFromTemplateStepDocumentsSkeleton
    : EServiceCreateStepPurposeSkeleton

  const stepsLoadingSkeletons =
    eserviceMode === 'DELIVER'
      ? [
          <EServiceCreateStepOneSkeleton key={1} />,
          <EServiceCreateStepTwoSkeleton key={2} />,
          <EServiceCreateStepThreeSkeleton key={3} />,
          <CreateStepDocumentsSkeleton key={4} />,
        ]
      : [
          <EServiceCreateStepOneSkeleton key={1} />,
          <CreateStepPurposeSkeleton key={2} />,
          <EServiceCreateStepTwoSkeleton key={3} />,
          <EServiceCreateStepThreeSkeleton key={4} />,
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
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 700,
          color: 'text.secondary',
        }}
      >
        {t('create.requiredLabel')}
      </Typography>
      <Stepper steps={steps} activeIndex={activeStep} />
      {isReady && (
        <EServiceCreateContextProvider
          descriptor={descriptor}
          eserviceMode={eserviceMode}
          onEserviceModeChange={setSelectedEServiceMode}
          eserviceTemplate={eserviceTemplate}
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
