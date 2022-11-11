import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { StepperStep } from '@/types/common.types'
import {
  EServiceCreateStep1General,
  EServiceCreateStep1GeneralSkeleton,
} from './components/EServiceCreateStep1General'
import {
  EServiceCreateStep2Version,
  EServiceCreateStep2VersionSkeleton,
} from './components/EServiceCreateStep2Version'
import {
  EServiceCreateStep3Documents,
  EServiceCreateStep3DocumentsSkeleton,
} from './components/EServiceCreateStep3Documents'
import { useTranslation } from 'react-i18next'
import { useActiveStep } from '@/hooks/useActiveStep'
import { Redirect, useRouteParams } from '@/router'
import { EServiceQueries } from '@/api/eservice'
import { Grid } from '@mui/material'
import { Stepper } from '@/components/shared/Stepper'
import { EServiceCreateContextProvider } from './components/EServiceCreateContext'

const ProviderEServiceCreatePage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const params = useRouteParams<'PROVIDE_ESERVICE_CREATE' | 'PROVIDE_ESERVICE_EDIT'>()
  const { activeStep, ...stepProps } = useActiveStep()

  const isNewEService = !params?.eserviceId && !params?.eserviceId

  const { data: eservice, isLoading: isLoadingEService } = EServiceQueries.useGetSingle(
    params?.eserviceId,
    params?.descriptorId,
    { suspense: false }
  )

  const steps: Array<StepperStep> = [
    { label: t('stepper.step1Label'), component: EServiceCreateStep1General },
    { label: t('stepper.step2Label'), component: EServiceCreateStep2Version },
    { label: t('stepper.step3Label'), component: EServiceCreateStep3Documents },
  ]

  const { component: Step } = steps[activeStep]

  // If this e-service is not in draft, you cannot edit it
  if (eservice && eservice?.viewingDescriptor && eservice?.viewingDescriptor.state !== 'DRAFT') {
    return (
      <Redirect
        to="PROVIDE_ESERVICE_MANAGE"
        params={{ eserviceId: eservice.id, descriptorId: eservice.viewingDescriptor.id }}
      />
    )
  }

  const isReady = !!(isNewEService || (!isLoadingEService && eservice))
  const stepsLoadingSkeletons = [
    <EServiceCreateStep1GeneralSkeleton key={1} />,
    <EServiceCreateStep2VersionSkeleton key={2} />,
    <EServiceCreateStep3DocumentsSkeleton key={3} />,
  ]

  const intro = isNewEService
    ? { title: t('emptyTitle') }
    : { title: eservice?.name, description: eservice?.description }

  return (
    <PageContainer {...intro} isLoading={!isReady}>
      <Grid container>
        <Grid item lg={8}>
          <Stepper steps={steps} activeIndex={activeStep} />
          {isReady && (
            <EServiceCreateContextProvider
              eservice={eservice}
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
