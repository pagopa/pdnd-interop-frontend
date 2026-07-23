import React from 'react'
import { Box } from '@mui/material'
import type { StepperStep } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import { MIStepper } from '@pagopa/mui-italia'

type StepperProps = {
  steps: Array<StepperStep>
  activeIndex: number
}

export function Stepper({ steps, activeIndex }: StepperProps) {
  return (
    <Box sx={{ py: 3 }}>
      <MIStepper activeStep={activeIndex} steps={steps} />
    </Box>
  )
}
