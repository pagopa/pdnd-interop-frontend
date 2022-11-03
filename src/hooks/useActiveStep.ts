import { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useLocation } from 'react-router-dom'

export type ActiveStepProps = {
  back: VoidFunction
  forward: VoidFunction
  activeStep: number
}

export function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

export const useActiveStep = (): ActiveStepProps => {
  const [activeStep, setActiveStep] = useState(0)
  const location = useLocation()

  // Handles which step to go to after a "creation" action has been performed
  // and a history.replace action has taken place and the whole EServiceCreate
  // component has rerendered and fetched fresh data
  useEffect(() => {
    // State has priority since it is a direct order to go to a location
    const locationState: Record<string, unknown> = location.state as Record<string, unknown>
    if (!isEmpty(locationState) && locationState.stepIndexDestination) {
      goToStep(locationState.stepIndexDestination as number)
    } else {
      // If there is no state, go to first step
      goToStep(0)
    }
  }, [location])

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
