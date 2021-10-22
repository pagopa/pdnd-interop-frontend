import React from 'react'
import { StyledButton } from './Shared/StyledButton'

type ActionStep = {
  action?: () => void
  label?: string
  disabled?: boolean
}

type ActionStepsProps = {
  forward?: ActionStep
  back?: ActionStep
}

export function OnboardingStepActions({ forward, back }: ActionStepsProps) {
  return (
    <div className="d-flex">
      {back && (
        <StyledButton
          className="me-2"
          variant="outline-primary"
          onClick={back.action}
          disabled={back.disabled}
        >
          {back.label}
        </StyledButton>
      )}
      {forward && (
        <StyledButton variant="primary" onClick={forward.action} disabled={forward.disabled}>
          {forward.label}
        </StyledButton>
      )}
    </div>
  )
}
