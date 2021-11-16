import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import { Box } from '@mui/system'
import { Paper } from '@mui/material'
import { EServiceReadType, StepperStep } from '../../types'
import { scrollToTop } from '../lib/page-utils'
import { EServiceWriteStep1General } from '../components/EServiceWriteStep1General'
import { EServiceWriteStep2Version } from '../components/EServiceWriteStep2Version'
import { EServiceWriteStep3Agreement } from '../components/EServiceWriteStep3Agreement'
import { EServiceWriteStep4Documents } from '../components/EServiceWriteStep4Documents'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { Contained } from '../components/Shared/Contained'

const STEPS: (StepperStep & { intro: { title: string; description?: string } })[] = [
  {
    label: 'Generale',
    component: EServiceWriteStep1General,
    intro: {
      title: 'Crea e-service: informazioni generali',
      description:
        "Attenzione: una volta pubblicata la prima versione dell'e-service, le informazioni contenute in questa sezione non saranno più modificabili",
    },
  },
  {
    label: 'Versione',
    component: EServiceWriteStep2Version,
    intro: { title: 'Crea e-service: informazioni di versione' },
  },
  {
    label: 'Accordo',
    component: EServiceWriteStep3Agreement,
    intro: {
      title: 'Crea e-service: accordo di interoperabilità*',
      description: 'Seleziona il template di accordo che intendi proporre al fruitore',
    },
  },
  {
    label: 'Documentazione',
    component: EServiceWriteStep4Documents,
    intro: { title: 'Crea e-service: documentazione' },
  },
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
  const { component: Step, intro } = STEPS[activeStep]

  return (
    <Box sx={{ maxWidth: 860 }}>
      <StyledIntro sx={{ my: 2 }}>{intro}</StyledIntro>
      <Paper sx={{ mb: 12 }}>
        <StyledStepper steps={STEPS} activeIndex={activeStep} />
      </Paper>
      <Contained>
        <Step {...stepProps} />
      </Contained>
    </Box>
  )
}
