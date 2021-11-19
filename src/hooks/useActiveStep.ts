import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import isEmpty from 'lodash/isEmpty'
import { scrollToTop } from '../lib/page-utils'
import { EServiceReadType } from '../../types'

type ActiveStepProps = {
  data: EServiceReadType
}

export const useActiveStep = ({ data }: ActiveStepProps) => {
  const [activeStep, setActiveStep] = useState(0)
  const history = useHistory()

  // Handles which step to go to after a "creation" action has been performed
  // and a history.replace action has taken place and the whole EServiceGate
  // component has rerendered and fetched fresh data
  useEffect(() => {
    // State has priority since it is a direct order to go to a location
    const locationState: Record<string, unknown> = history.location.state as Record<string, unknown>
    if (!isEmpty(locationState) && locationState.stepIndexDestination) {
      goToStep(locationState.stepIndexDestination as number)
      // If there is no state but we have data, compute the location
    } else if (!isEmpty(data)) {
      goToStep(getInitialStepIndexDestination(data))
    }
  }, [history.location, data])

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

  const getInitialStepIndexDestination = (data: EServiceReadType) => {
    // Descriptors never created
    if (data.descriptors.length === 0) {
      // Go to step 2 to create them
      return 1
    }

    // Version step already completed
    // We do not have to check all fields. If there is an activeDescriptor,
    // it means that the user has already saved a version step for this version
    // before. This means that the version step is already complete, and we can
    // skip to the following step, aka go to step 3
    return 2
  }

  return { back, forward, activeStep }
}
