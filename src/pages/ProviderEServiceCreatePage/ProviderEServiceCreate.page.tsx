import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import type { StepperStep } from '@/types/common.types'
import {
  EServiceCreateStep1General,
  EServiceCreateStep1GeneralSkeleton,
} from './components/EServiceCreateStep1General'
import {
  EServiceCreateStep2Version,
  EServiceCreateStep2VersionSkeleton,
} from './components/EServiceCreateStep2Version'
import {
  EServiceCreateStep4Documents,
  EServiceCreateStep4DocumentsSkeleton,
} from './components/EServiceCreateStep4Documents'
import { useTranslation } from 'react-i18next'
import { useActiveStep } from '@/hooks/useActiveStep'
import { Redirect, useParams } from '@/router'
import { EServiceQueries } from '@/api/eservice'
import { Grid } from '@mui/material'
import { Stepper } from '@/components/shared/Stepper'
import { EServiceCreateContextProvider } from './components/EServiceCreateContext'
import { URL_FRAGMENTS } from '@/router/router.utils'
import {
  EServiceCreateStep3Attributes,
  EServiceCreateStep3AttributesSkeleton,
} from './components/EServiceCreateStep3Attributes'

const ProviderEServiceCreatePage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
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

  const steps: Array<StepperStep> = [
    { label: t('stepper.step1Label'), component: EServiceCreateStep1General },
    { label: t('stepper.step2Label'), component: EServiceCreateStep2Version },
    { label: t('stepper.step3Label'), component: EServiceCreateStep3Attributes },
    { label: t('stepper.step4Label'), component: EServiceCreateStep4Documents },
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
    <EServiceCreateStep1GeneralSkeleton key={1} />,
    <EServiceCreateStep2VersionSkeleton key={2} />,
    <EServiceCreateStep3AttributesSkeleton key={3} />,
    <EServiceCreateStep4DocumentsSkeleton key={4} />,
  ]

  const intro = isNewEService
    ? { title: t('emptyTitle') }
    : {
        title: eserviceData?.name,
        description: eserviceData?.description,
      }

  return (
    <PageContainer {...intro} isLoading={!isReady}>
      <Grid container>
        <Grid item lg={8}>
          <Stepper steps={steps} activeIndex={activeStep} />
          {isReady && (
            <EServiceCreateContextProvider
              eservice={eserviceData}
              descriptor={descriptor}
              isNewEService={isNewEService}
              {...stepProps}
            >
              <Step />
            </EServiceCreateContextProvider>
          )}
          {!isReady && stepsLoadingSkeletons[activeStep]}
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default ProviderEServiceCreatePage
