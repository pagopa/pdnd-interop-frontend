import React from 'react'
import { Stepper as MUIStepper, Step, StepLabel, Box } from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import type { StepperStep } from '@/types/common.types'
import { useTranslation } from 'react-i18next'

type StepperProps = {
  steps: Array<StepperStep>
  activeIndex: number
}

export function Stepper({ steps, activeIndex }: StepperProps) {
  const { t } = useTranslation('shared-components', { keyPrefix: 'stepper' })

  return (
    <Box sx={{ py: 3 }}>
      <MUIStepper activeStep={activeIndex} alternativeLabel>
        {steps.map(({ label }, index) => {
          const isCompleted = index < activeIndex
          const isCurrent = index === activeIndex

          let statusText = ''
          if (isCompleted) statusText = t('completeLabel') + ': '
          else if (isCurrent) statusText = t('currentStepLabel') + ': '

          return (
            <Step key={index}>
              {/* force the non-interactive label into the tab order to improve accessibility */}
              <StepLabel tabIndex={0}>
                <span style={visuallyHidden}>
                  {statusText}
                  {t('stepperLabel', { currentStep: index + 1, totalSteps: steps.length })}
                </span>
                {label}
              </StepLabel>
            </Step>
          )
        })}
      </MUIStepper>
    </Box>
  )
}
