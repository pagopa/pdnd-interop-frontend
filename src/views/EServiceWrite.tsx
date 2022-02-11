import React from 'react'
import { Box } from '@mui/system'
import { EServiceReadType, StepperStep } from '../../types'
import { EServiceWriteStep1General } from '../components/EServiceWriteStep1General'
import { EServiceWriteStep2Version } from '../components/EServiceWriteStep2Version'
import { EServiceWriteStep3Documents } from '../components/EServiceWriteStep3Documents'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { Contained } from '../components/Shared/Contained'
import { ActiveStepProps } from '../hooks/useActiveStep'

const STEPS: Array<StepperStep> = [
  { label: 'Generale', component: EServiceWriteStep1General },
  { label: 'Versione', component: EServiceWriteStep2Version },
  { label: 'Documentazione', component: EServiceWriteStep3Documents },
]

export type EServiceWriteProps = ActiveStepProps & {
  fetchedData?: EServiceReadType
}

export function EServiceWrite({ fetchedData, back, forward, activeStep }: EServiceWriteProps) {
  const stepProps = { forward, back, fetchedData }
  const { component: Step } = STEPS[activeStep]

  return (
    <Box sx={{ maxWidth: 860 }}>
      <StyledIntro>{{ title: 'Crea e-service' }}</StyledIntro>
      <StyledStepper steps={STEPS} activeIndex={activeStep} />
      <Contained>
        <Step {...stepProps} />
      </Contained>
    </Box>
  )
}
