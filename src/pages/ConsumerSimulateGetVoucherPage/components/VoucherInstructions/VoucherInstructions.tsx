import React from 'react'
import { Stepper } from '@/components/shared/Stepper'
import { useActiveStep } from '@/hooks/useActiveStep'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import { SectionContainerSkeleton } from '@/components/layout/containers'
import { VoucherInstructionsContextProvider } from './VoucherInstructionsContext'

import type { VoucherInstructionsGeneralFormValues } from './VoucherInstructionsGeneralForm'
import { VoucherInstructionsGeneralForm } from './VoucherInstructionsGeneralForm'
import { VoucherInstructionsClientAssertionStep } from './steps/VoucherInstructionsClientAssertionStep'
import { VoucherInstructionsAccessTokenStep } from './steps/VoucherInstructionsAccessTokenStep'
import { VoucherInstructionsDataAccessStep } from './steps/VoucherInstructionsDataAccessStep'
import { RequiredTextLabel } from '@/components/shared/RequiredTextLabel'
import { VoucherInstructionsFirstDPoPProofStep } from './steps/VoucherInstructionsFirstDPoPProofStep'
import { VoucherInstructionsSecondDPoPProofStep } from './steps/VoucherInstructionsSecondDPoPProofStep'

export const VoucherInstructions: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const { activeStep, forward, back } = useActiveStep()
  const [showStepper, setShowStepper] = React.useState(false)
  const [steps, setSteps] = React.useState<{ label: string; component: React.FC<{}> }[]>([])

  const Step = steps?.[activeStep]?.component

  const handleBack = () => {
    if (activeStep === 0) {
      setShowStepper(false)
    } else {
      back()
    }
  }

  const contextProps = {
    goToPreviousStep: handleBack,
    goToNextStep: forward,
    startStepper: (values: VoucherInstructionsGeneralFormValues) => generateSteps(values),
  }

  const bearerFlowSteps = [
    {
      label: t('clientAssertionStep.stepperLabel'),
      component: VoucherInstructionsClientAssertionStep,
    },
    {
      label: t('accessTokenStep.stepperLabel'),
      component: VoucherInstructionsAccessTokenStep,
    },
    {
      label: t('dataAccessStep.stepperLabelBearer'),
      component: VoucherInstructionsDataAccessStep,
    },
  ]

  const dPoPFlowSteps = [
    {
      label: t('clientAssertionStep.stepperLabel'),
      component: VoucherInstructionsClientAssertionStep,
    },
    {
      label: t('firstDPoPProofStep.stepperLabel'),
      component: VoucherInstructionsFirstDPoPProofStep,
    },
    {
      label: t('accessTokenStep.stepperLabel'),
      component: VoucherInstructionsAccessTokenStep,
    },
    {
      label: t('dataAccessStep.stepperLabelDPoP'),
      component: VoucherInstructionsDataAccessStep,
    },
    {
      label: t('secondDPoPProofStep.stepperLabel'),
      component: VoucherInstructionsSecondDPoPProofStep,
    },
  ]

  const generateSteps = (values: VoucherInstructionsGeneralFormValues) => {
    const newSteps: { label: string; component: React.FC<{}> }[] =
      values.voucherType === 'BEARER' ? bearerFlowSteps : dPoPFlowSteps

    setSteps(newSteps)
    setShowStepper(true)
  }

  return (
    <>
      <VoucherInstructionsContextProvider {...contextProps}>
        {!showStepper ? (
          <>
            <RequiredTextLabel />
            <VoucherInstructionsGeneralForm />
          </>
        ) : (
          <>
            <Stepper steps={steps} activeIndex={activeStep} />
            <React.Suspense
              fallback={<SectionContainerSkeleton height={clientKind === 'CONSUMER' ? 356 : 297} />}
            >
              {Step ? <Step /> : null}
            </React.Suspense>
          </>
        )}
      </VoucherInstructionsContextProvider>
    </>
  )
}
