import React from 'react'
import { Box } from '@mui/system'
import { EServiceReadType, StepperStep } from '../../types'
import { EServiceCreateStep1General } from '../components/EServiceCreateStep1General'
import { EServiceCreateStep2Version } from '../components/EServiceCreateStep2Version'
import { EServiceCreateStep3Documents } from '../components/EServiceCreateStep3Documents'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { Contained } from '../components/Shared/Contained'
import { ActiveStepProps } from '../hooks/useActiveStep'

const STEPS: Array<StepperStep> = [
  { label: 'Generale', component: EServiceCreateStep1General },
  { label: 'Versione', component: EServiceCreateStep2Version },
  { label: 'Documentazione', component: EServiceCreateStep3Documents },
]

export type EServiceCreateProps = ActiveStepProps & {
  fetchedData?: EServiceReadType
}

export function EServiceCreate({ fetchedData, back, forward, activeStep }: EServiceCreateProps) {
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
