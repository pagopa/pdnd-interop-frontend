import React from 'react'
import { Stepper } from '@/components/shared/Stepper'
import { useActiveStep } from '@/hooks/useActiveStep'
import { Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import { SectionContainerSkeleton } from '@/components/layout/containers'
import { VoucherInstructionsContextProvider } from './VoucherInstructionsContext'

import { VoucherInstructionsStep1 } from './VoucherInstructionsStep1'
import { VoucherInstructionsStep2 } from './VoucherInstructionsStep2'
import { VoucherInstructionsStep3 } from './VoucherInstructionsStep3'
import { VoucherInstructionsStep4 } from './VoucherInstructionsStep4'

interface VoucherInstructionsProps {
  clientId: string
}

export const VoucherInstructions: React.FC<VoucherInstructionsProps> = ({ clientId }) => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const { activeStep, forward, back } = useActiveStep()

  const steps = [
    { label: t('step1.stepperLabel'), component: VoucherInstructionsStep1 },
    { label: t('step2.stepperLabel'), component: VoucherInstructionsStep2 },
    { label: t('step3.stepperLabel'), component: VoucherInstructionsStep3 },
    {
      label:
        clientKind === 'CONSUMER' ? t('step4.consumerStepperLabel') : t('step4.apiStepperLabel'),
      component: VoucherInstructionsStep4,
    },
  ]

  const { component: Step } = steps[activeStep]

  const contextProps = {
    goToPreviousStep: back,
    goToNextStep: forward,
    clientId,
  }

  return (
    <VoucherInstructionsContextProvider {...contextProps}>
      <Grid container>
        <Grid item xs={8}>
          <Stepper steps={steps} activeIndex={activeStep} />
          <React.Suspense
            fallback={<SectionContainerSkeleton height={clientKind === 'CONSUMER' ? 356 : 297} />}
          >
            <Step />
          </React.Suspense>
        </Grid>
      </Grid>
    </VoucherInstructionsContextProvider>
  )
}
