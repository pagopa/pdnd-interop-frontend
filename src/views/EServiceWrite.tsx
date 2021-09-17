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
  fetchedDataMaybe: EServiceReadType | undefined
}

export type EServiceWriteStepProps = {
  fetchedData: EServiceReadType
}

export function EServiceWrite({ fetchedDataMaybe }: EServiceWriteProps) {
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

  const props = { forward, back }
  const fetchedData = fetchedDataMaybe as EServiceReadType

  const steps: StepperStep[] = [
    {
      label: 'Generale',
      Component: () => EServiceWriteStep1General({ ...props, fetchedDataMaybe }),
    },
    {
      label: 'Versione',
      Component: () => EServiceWriteStep2Version({ ...props, fetchedData }),
    },
    {
      label: 'Accordo',
      Component: () => EServiceWriteStep3Agreement({ ...props, fetchedData }),
    },
    {
      label: 'Documentazione',
      Component: () => EServiceWriteStep4Documents({ ...props, fetchedData }),
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
