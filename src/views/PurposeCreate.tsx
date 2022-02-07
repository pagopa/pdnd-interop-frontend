import { Paper } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { StepperStep } from '../../types'
import { PurposeWriteStep1General } from '../components/PurposeWriteStep1General'
import { PurposeWriteStep2RiskAnalysis } from '../components/PurposeWriteStep2RiskAnalysis'
import { PurposeWriteStep3Clients } from '../components/PurposeWriteStep3Clients'
import { Contained } from '../components/Shared/Contained'
import { StyledIntro, StyledIntroChildrenProps } from '../components/Shared/StyledIntro'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { useActiveStep } from '../hooks/useActiveStep'

const STEPS: Array<StepperStep & { intro: StyledIntroChildrenProps }> = [
  {
    label: 'Caratteristiche generali',
    component: PurposeWriteStep1General,
    intro: { title: 'Crea finalità: informazioni generali' },
  },
  {
    label: 'Analisi del rischio',
    component: PurposeWriteStep2RiskAnalysis,
    intro: { title: 'Crea finalità: analisi del rischio' },
  },
  {
    label: 'Client associati',
    component: PurposeWriteStep3Clients,
    intro: { title: 'Crea finalità: associazione client' },
  },
]

export const PurposeCreate = () => {
  const { activeStep, forward, back } = useActiveStep()
  const { component: Step, intro } = STEPS[activeStep]
  const stepProps = { forward, back }

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
