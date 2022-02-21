import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import isEmpty from 'lodash/isEmpty'
import { scrollToTop } from '../lib/page-utils'

export type ActiveStepProps = {
  back: VoidFunction
  forward: VoidFunction
  activeStep: number
}

export const useActiveStep = (): ActiveStepProps => {
  const [activeStep, setActiveStep] = useState(0)
  const history = useHistory()

  // Handles which step to go to after a "creation" action has been performed
  // and a history.replace action has taken place and the whole EServiceCreate
  // component has rerendered and fetched fresh data
  useEffect(() => {
    // State has priority since it is a direct order to go to a location
    const locationState: Record<string, unknown> = history.location.state as Record<string, unknown>
    if (!isEmpty(locationState) && locationState.stepIndexDestination) {
      goToStep(locationState.stepIndexDestination as number)
    } else {
      // If there is no state, go to first step
      goToStep(0)
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

  return { back, forward, activeStep }
}
