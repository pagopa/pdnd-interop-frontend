import React, { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import { EServiceReadType, StepperStep } from '../../types'
import { EServiceWriteStep1General } from '../components/EServiceWriteStep1General'
import { EServiceWriteStep2Version } from '../components/EServiceWriteStep2Version'
import { EServiceWriteStep3Agreement } from '../components/EServiceWriteStep3Agreement'
import { EServiceWriteStep4Documents } from '../components/EServiceWriteStep4Documents'
import { Stepper } from '../components/Stepper'
import { WhiteBackground } from '../components/WhiteBackground'
import { useHistory } from 'react-router-dom'

export type EServiceWriteProps = {
  fetchedData: EServiceReadType | undefined
}

// Represents when a new service is created, and there was no draft before
// In this case, we have no "data" coming as a prop, but still we have an
// eserviceId  to POST data to
export type EServiceWriteStepperProps = EServiceWriteProps & {}

export function EServiceWrite({ fetchedData }: EServiceWriteProps) {
  const [activeStep, setActiveStep] = useState(0)
  const history = useHistory()

  // Handles which step to go to after a "creation" action has been performed
  // and a history.replace action has taken place
  useEffect(() => {
    const { state } = history.location

    if (!isEmpty(state) && has(state, 'stepIndexDestination')) {
      goToStep((state as any).stepIndexDestination)
    }
  }, [history.location])

  /*
   * Stepper actions
   */
  const back = () => {
    setActiveStep(activeStep - 1)
  }

  const forward = () => {
    setActiveStep(activeStep + 1)
  }

  const goToStep = (step: number) => {
    setActiveStep(step)
  }

  const props = { forward, back, fetchedData }

  const steps: StepperStep[] = [
    {
      label: 'Generale',
      Component: () => EServiceWriteStep1General(props),
    },
    {
      label: 'Versione',
      Component: () => EServiceWriteStep2Version(props),
    },
    {
      label: 'Accordo',
      Component: () => EServiceWriteStep3Agreement(props),
    },
    {
      label: 'Documentazione',
      Component: () => EServiceWriteStep4Documents(props),
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
