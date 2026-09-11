import React from 'react'
import { Box } from '@mui/material'
import { MIStepper } from '@pagopa/mui-italia/components/MIStepper'
import type { StepperStep } from '@/types/common.types'

type StepperProps = {
  steps: Array<StepperStep>
  activeIndex: number
}

export function Stepper({ steps, activeIndex }: StepperProps) {
  return (
    <Box sx={{ py: 3 }}>
      step
      <MIStepper activeStep={activeIndex} steps={steps.map(({ label }) => ({ label }))} />
    </Box>
  )
}
