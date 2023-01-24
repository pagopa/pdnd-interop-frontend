import React from 'react'
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
  const location = useLocation()
  const [activeStep, setActiveStep] = React.useState(() => {
    const locationState: Record<string, unknown> = location.state as Record<string, unknown>

    if (!isEmpty(locationState) && locationState.stepIndexDestination) {
      return locationState.stepIndexDestination as number
    }

    return 0
  })

  /*
   * Stepper actions
   */
  const back = React.useCallback(() => {
    setActiveStep((prev) => Math.max(0, prev - 1))
  }, [])

  const forward = React.useCallback(() => {
    setActiveStep((prev) => prev + 1)
    scrollToTop()
  }, [])

  return { back, forward, activeStep }
}
