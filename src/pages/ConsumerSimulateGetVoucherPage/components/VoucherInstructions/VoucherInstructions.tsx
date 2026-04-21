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

export const VoucherInstructions: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const { activeStep, forward, back } = useActiveStep()
  const [showStepper, setShowStepper] = React.useState(false)

  const steps = [
    {
      label: t('clientAssertionStep.stepperLabel'),
      component: VoucherInstructionsClientAssertionStep,
    },
    { label: t('accessTokenStep.stepperLabel'), component: VoucherInstructionsAccessTokenStep },
    {
      label:
        clientKind === 'CONSUMER'
          ? t('dataAccessStep.consumerStepperLabel')
          : t('dataAccessStep.apiStepperLabel'),
      component: VoucherInstructionsDataAccessStep,
    },
  ]

  const { component: Step } = steps[activeStep]

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
    startStepper: (values: VoucherInstructionsGeneralFormValues) => generateStepper(values),
  }

  const generateStepper = (values: VoucherInstructionsGeneralFormValues) => {
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
              <Step />
            </React.Suspense>
          </>
        )}
      </VoucherInstructionsContextProvider>
    </>
  )
}
