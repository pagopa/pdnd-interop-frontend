import React, { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import { EServiceReadType } from '../../types'
import { EServiceWriteStep1General } from '../components/EServiceWriteStep1General'
import { EServiceWriteStep2Version } from '../components/EServiceWriteStep2Version'
import { EServiceWriteStep3Agreement } from '../components/EServiceWriteStep3Agreement'
import { EServiceWriteStep4Documents } from '../components/EServiceWriteStep4Documents'
import { Stepper } from '../components/Stepper'
import { WhiteBackground } from '../components/WhiteBackground'
import { useHistory } from 'react-router-dom'
import { scrollToTop } from '../lib/page-utils'

const STEPS: any[] = [
  { label: 'Generale', component: EServiceWriteStep1General },
  { label: 'Versione', component: EServiceWriteStep2Version },
  { label: 'Accordo', component: EServiceWriteStep3Agreement },
  { label: 'Documentazione', component: EServiceWriteStep4Documents },
]

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
  // and a history.replace action has taken place and the whole EServiceGate
  // component has rerendered and fetched fresh data
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
    scrollToTop()
  }

  const goToStep = (step: number) => {
    setActiveStep(step)
    scrollToTop()
  }

  const fetchedData = fetchedDataMaybe as EServiceReadType
  const stepProps = { forward, back, fetchedData, fetchedDataMaybe }
  const Step = STEPS[activeStep].component

  return (
    <React.Fragment>
      <WhiteBackground>
        <Stepper steps={STEPS} activeIndex={activeStep} />
      </WhiteBackground>
      <Step {...stepProps} />
    </React.Fragment>
  )
}
