import React, { useState } from 'react'
import { StepperStep } from '../../types'
import { Stepper } from '../components/Stepper'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'

function OnboardingComponent() {
  const [activeStep, setActiveStep] = useState(0)
  const steps: StepperStep[] = [
    { label: "Seleziona l'ente" },
    { label: 'Inserisci i dati' },
    { label: "Verifica l'accordo" },
  ]

  return (
    <React.Fragment>
      <WhiteBackground noVerticalMargin={true}>
        <Stepper steps={steps} activeIndex={activeStep} />
      </WhiteBackground>
      <WhiteBackground>onboarding</WhiteBackground>
    </React.Fragment>
  )
}

export const Onboarding = withLogin(OnboardingComponent)
