import React, { useState } from 'react'
import { EServiceReadType, StepperStep } from '../../types'
import { EServiceWriteStep1General } from '../components/EServiceWriteStep1General'
import { EServiceWriteStep2Version } from '../components/EServiceWriteStep2Version'
import { EServiceWriteStep3Agreement } from '../components/EServiceWriteStep3Agreement'
import { EServiceWriteStep4Documents } from '../components/EServiceWriteStep4Documents'
import { Stepper } from '../components/Stepper'
import { WhiteBackground } from '../components/WhiteBackground'

export type EServiceWriteProps = {
  data?: EServiceReadType
}

export function EServiceWrite({ data }: EServiceWriteProps) {
  const [activeStep, setActiveStep] = useState(0)

  console.log('data', data)

  /*
   * Stepper actions
   */
  const back = () => {
    setActiveStep(activeStep - 1)
  }

  const forward = () => {
    setActiveStep(activeStep + 1)
  }

  const steps: StepperStep[] = [
    {
      label: 'Generale',
      Component: () => EServiceWriteStep1General({ forward, data }),
    },
    {
      label: 'Versione',
      Component: () => EServiceWriteStep2Version({ forward, back }),
    },
    {
      label: 'Accordo',
      Component: () => EServiceWriteStep3Agreement({ forward, back }),
    },
    {
      label: 'Documentazione',
      Component: () => EServiceWriteStep4Documents({ forward, back }),
    },
  ]

  const Step = steps[activeStep].Component

  return (
    <React.Fragment>
      <WhiteBackground>
        <Stepper steps={steps} activeIndex={activeStep} />
      </WhiteBackground>
      <Step />
    </React.Fragment>
  )
}
