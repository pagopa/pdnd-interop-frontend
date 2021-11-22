import React from 'react'
import { Box } from '@mui/system'
import { Paper } from '@mui/material'
import { EServiceReadType, StepperStep } from '../../types'
import { EServiceWriteStep1General } from '../components/EServiceWriteStep1General'
import { EServiceWriteStep2Version } from '../components/EServiceWriteStep2Version'
import { EServiceWriteStep3Agreement } from '../components/EServiceWriteStep3Agreement'
import { EServiceWriteStep4Documents } from '../components/EServiceWriteStep4Documents'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { StyledIntro, StyledIntroChildrenProps } from '../components/Shared/StyledIntro'
import { Contained } from '../components/Shared/Contained'

const STEPS: Array<StepperStep & { intro: StyledIntroChildrenProps }> = [
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
  fetchedDataMaybe?: EServiceReadType
  back: VoidFunction
  forward: VoidFunction
  activeStep: number
}

export type EServiceWriteStepProps = {
  fetchedData: EServiceReadType
}

export function EServiceWrite({ fetchedDataMaybe, back, forward, activeStep }: EServiceWriteProps) {
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
