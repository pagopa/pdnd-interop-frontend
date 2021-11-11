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
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      {back && (
        <StyledButton size="small" variant="outlined" sx={{ mx: 2 }} onClick={back.action}>
          {back.label}
        </StyledButton>
      )}
      {forward && (
        <StyledButton size="small" variant="contained" type="submit">
          {forward.label}
        </StyledButton>
      )}
    </Box>
  )
}
