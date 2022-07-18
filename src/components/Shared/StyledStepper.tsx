import React from 'react'
import { Stepper, Step, StepLabel, Box } from '@mui/material'
import { StepperStep } from '../../../types'

type StepperProps = {
  steps: Array<StepperStep>
  activeIndex: number
}

export function StyledStepper({ steps, activeIndex }: StepperProps) {
  return (
    <Box bgcolor="background.paper" sx={{ py: 3 }}>
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
