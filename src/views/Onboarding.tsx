import React, { useState } from 'react'
import { StepperStep } from '../../types'
import { Stepper } from '../components/Stepper'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'
import { OnboardingStep1 } from '../components/OnboardingStep1'
import { OnboardingStep2 } from '../components/OnboardingStep2'
import { OnboardingStep3 } from '../components/OnboardingStep3'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { fetchWithLogs } from '../lib/api-utils'

const FORM_MAX_WIDTH = 600

function OnboardingComponent() {
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [legalEmail, setLegalEmail] = useState<string>()

  const back = () => {
    setActiveStep(activeStep - 1)
  }

  const forward = () => {
    setActiveStep(activeStep + 1)
  }

  const forwardWithData = (newFormData: any) => {
    setFormData({ ...formData, ...newFormData })
    forward()
  }

  const forwardWithDataAndEmail = (newFormData: any, newLegalEmail: string) => {
    setLegalEmail(newLegalEmail)
    forwardWithData(newFormData)
  }

  const submit = async () => {
    setLoading(true)

    console.log({ formData, legalEmail })

    await fetchWithLogs('ONBOARDING_POST_LEGALS', {
      method: 'POST',
      data: formData,
    })

    setLoading(false)
  }

  const steps: StepperStep[] = [
    {
      label: "Seleziona l'ente",
      Component: () =>
        OnboardingStep1({ forward: forwardWithDataAndEmail, maxWidth: FORM_MAX_WIDTH }),
    },
    {
      label: 'Inserisci i dati',
      Component: () =>
        OnboardingStep2({ forward: forwardWithData, back, maxWidth: FORM_MAX_WIDTH }),
    },
    {
      label: "Verifica l'accordo",
      Component: () => OnboardingStep3({ forward: submit, back, maxWidth: FORM_MAX_WIDTH }),
    },
  ]

  const Step = steps[activeStep].Component

  return (
    <LoadingOverlay isLoading={loading} loadingText="Stiamo verificando i tuoi dati">
      <WhiteBackground noVerticalMargin={true}>
        <Stepper steps={steps} activeIndex={activeStep} />
      </WhiteBackground>
      <Step />
    </LoadingOverlay>
  )
}

export const Onboarding = withLogin(OnboardingComponent)
