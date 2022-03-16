import React from 'react'
import { Stepper, Step, StepLabel } from '@mui/material'
import { StepperStep } from '../../../types'
import { Box } from '@mui/system'

type StepperProps = {
  steps: Array<StepperStep>
  activeIndex: number
}

export function StyledStepper({ steps, activeIndex }: StepperProps) {
  return (
    <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: 'divider', mb: 8, py: 3 }}>
      <Stepper activeStep={activeIndex} alternativeLabel>
        {steps.map(({ label }) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
