import React from 'react'
import { Box } from '@mui/system'
import { Paper } from '@mui/material'
import { EServiceReadType, StepperStep } from '../../types'
import { EServiceWriteStep1General } from '../components/EServiceWriteStep1General'
import { EServiceWriteStep2Version } from '../components/EServiceWriteStep2Version'
import { EServiceWriteStep3Documents } from '../components/EServiceWriteStep3Documents'
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
    label: 'Documentazione',
    component: EServiceWriteStep3Documents,
    intro: { title: 'Crea e-service: documentazione' },
  },
]

export type EServiceWriteProps = {
  fetchedData?: EServiceReadType
  back: VoidFunction
  forward: VoidFunction
  activeStep: number
}

export function EServiceWrite({ fetchedData, back, forward, activeStep }: EServiceWriteProps) {
  const stepProps = { forward, back, fetchedData }
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
