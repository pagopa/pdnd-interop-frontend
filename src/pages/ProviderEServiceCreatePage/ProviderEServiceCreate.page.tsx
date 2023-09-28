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
  EServiceCreateStep4Documents,
  EServiceCreateStep4DocumentsSkeleton,
} from './components/EServiceCreateStep4Documents'
import { useTranslation } from 'react-i18next'
import { useActiveStep } from '@/hooks/useActiveStep'
import { Redirect, useParams } from '@/router'
import { EServiceQueries } from '@/api/eservice'
import { Stepper } from '@/components/shared/Stepper'
import { EServiceCreateContextProvider } from './components/EServiceCreateContext'
import { URL_FRAGMENTS } from '@/router/router.utils'
import {
  EServiceCreateStep3Attributes,
  EServiceCreateStep3AttributesSkeleton,
} from './components/EServiceCreateStep3Attributes'
import { Typography } from '@mui/material'
import type { EServiceMode } from '@/api/api.generatedTypes'

const ProviderEServiceCreatePage: React.FC = () => {
  const { t } = useTranslation('eservice')
  const params = useParams<'PROVIDE_ESERVICE_CREATE' | 'PROVIDE_ESERVICE_EDIT'>()
  const { activeStep, ...stepProps } = useActiveStep()

  const [eserviceMode, setEserviceMode] = React.useState<EServiceMode>('DELIVER')

  const handleEserviceModeChange = (value: string) => {
    setEserviceMode(value as 'DELIVER' | 'RECEIVE')
  }

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

  const TestComponent: React.FC = () => <Typography>AAAAAA test</Typography> //TODO

  const steps: Array<StepperStep> =
    eserviceMode === 'DELIVER'
      ? [
          { label: t('create.stepper.step1Label'), component: EServiceCreateStep1General },
          { label: t('create.stepper.step2Label'), component: EServiceCreateStep2Version },
          { label: t('create.stepper.step3Label'), component: EServiceCreateStep3Attributes },
          { label: t('create.stepper.step4Label'), component: EServiceCreateStep4Documents },
        ]
      : [
          { label: t('create.stepper.step1Label'), component: EServiceCreateStep1General },
          { label: 'Purpose step', component: TestComponent }, // TODO
          { label: t('create.stepper.step2Label'), component: EServiceCreateStep2Version },
          { label: t('create.stepper.step3Label'), component: EServiceCreateStep3Attributes },
          { label: t('create.stepper.step4Label'), component: EServiceCreateStep4Documents },
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

  const stepsLoadingSkeletons = [
    <EServiceCreateStepGeneralSkeleton key={1} />,
    <EServiceCreateStepVersionSkeleton key={2} />,
    <EServiceCreateStepAttributesSkeleton key={3} />,
    <EServiceCreateStep4DocumentsSkeleton key={4} />,
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
