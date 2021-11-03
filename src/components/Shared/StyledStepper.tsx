import React from 'react'
import { Stepper, Step, StepLabel } from '@mui/material'
import { StepperStep } from '../../../types'

type StepperProps = {
  steps: StepperStep[]
  activeIndex: number
}

export function StyledStepper({ steps, activeIndex }: StepperProps) {
  return (
    <Stepper activeStep={activeIndex} sx={{ py: '2rem' }} alternativeLabel>
      {steps.map(({ label }) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
