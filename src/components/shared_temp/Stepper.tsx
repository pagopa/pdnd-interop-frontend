import React from 'react'
import { Stepper as MUIStepper, Step, StepLabel, Box } from '@mui/material'
import { StepperStep } from '@/types/common.types'

type StepperProps = {
  steps: Array<StepperStep>
  activeIndex: number
}

export function Stepper({ steps, activeIndex }: StepperProps) {
  return (
    <Box bgcolor="background.paper" sx={{ py: 3 }}>
      <MUIStepper activeStep={activeIndex} alternativeLabel>
        {steps.map(({ label }) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </MUIStepper>
    </Box>
  )
}
