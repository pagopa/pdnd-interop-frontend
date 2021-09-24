import React from 'react'
import { Button } from 'react-bootstrap'

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
        <Button
          className="me-2"
          variant="outline-primary"
          onClick={back.action}
          disabled={back.disabled}
        >
          {back.label}
        </Button>
      )}
      {forward && (
        <Button variant="primary" onClick={forward.action} disabled={forward.disabled}>
          {forward.label}
        </Button>
      )}
    </div>
  )
}
