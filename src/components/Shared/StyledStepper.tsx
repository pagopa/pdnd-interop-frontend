import React from 'react'
import { Stepper, Step, StepLabel, Typography } from '@mui/material'
import { StepperStep } from '../../../types'

type StepperProps = {
  steps: Array<StepperStep>
  activeIndex: number
}

export function StyledStepper({ steps, activeIndex }: StepperProps) {
  return (
    <Stepper activeStep={activeIndex} sx={{ py: 4 }} alternativeLabel>
      {steps.map(({ label }) => (
        <Step key={label}>
          <StepLabel>
            <Typography component="span" color="secondary" fontWeight={600} fontSize={14}>
              {label}
            </Typography>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
