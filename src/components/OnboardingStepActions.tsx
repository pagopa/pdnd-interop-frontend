import React from 'react'
import { Box } from '@mui/system'
import { StyledButton } from './Shared/StyledButton'

type ForwardActionStep = {
  label: string
}

type BackActionStep = ForwardActionStep & {
  action: (e?: any) => void
}

type ActionStepsProps = {
  forward?: ForwardActionStep
  back?: BackActionStep
}

export function OnboardingStepActions({ forward, back }: ActionStepsProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '2rem' }}>
      {back && (
        <StyledButton variant="outlined" sx={{ mx: '0.5rem' }} onClick={back.action}>
          {back.label}
        </StyledButton>
      )}
      {forward && (
        <StyledButton variant="contained" type="submit">
          {forward.label}
        </StyledButton>
      )}
    </Box>
  )
}
