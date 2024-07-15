import React from 'react'
import { useLocation } from '@tanstack/react-router'

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
  const [activeStep, setActiveStep] = React.useState<number>(
    location.state.stepIndexDestination ?? 0
  )

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
