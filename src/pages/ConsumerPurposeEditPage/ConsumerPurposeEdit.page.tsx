import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { Stepper } from '@/components/shared/Stepper'
import { useActiveStep } from '@/hooks/useActiveStep'
import { Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { StepperStep } from '@/types/common.types'
import { PurposeEditStep1General } from './components/PurposeEditStep1General'
import { PurposeEditStep2RiskAnalysis } from './components/PurposeEditStep2RiskAnalysis'
import { PurposeEditStep3Clients } from './components/PurposeEditStep3Clients'

const ConsumerPurposeEditPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { activeStep, forward, back } = useActiveStep()

  const steps: Array<StepperStep> = [
    { label: t('edit.stepper.step1Label'), component: PurposeEditStep1General },
    { label: t('edit.stepper.step2Label'), component: PurposeEditStep2RiskAnalysis },
    { label: t('edit.stepper.step3Label'), component: PurposeEditStep3Clients },
  ]

  const { component: Step } = steps[activeStep]
  const stepProps = { forward, back }

  return (
    <PageContainer title={t('edit.emptyTitle')}>
      <Grid container>
        <Grid item xs={8}>
          <Stepper steps={steps} activeIndex={activeStep} />
          <Step {...stepProps} />
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default ConsumerPurposeEditPage
