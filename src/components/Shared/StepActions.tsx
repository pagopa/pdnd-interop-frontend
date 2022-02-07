import React from 'react'
import { Box } from '@mui/system'
import { StyledButton } from './StyledButton'
import { StyledLink } from './StyledLink'

type ActionButton = {
  label: string
  type: 'button'
  onClick: VoidFunction
}

type ActionLink = {
  label: string
  type: 'link'
  to: string
}

type ActionSubmit = {
  label: string
  type: 'submit'
}

export type BackAction = ActionButton | ActionLink
export type ForwardAction = ActionButton | ActionSubmit

type StepActionsProps = {
  back: BackAction
  forward: ForwardAction
}

export function StepActions({ back, forward }: StepActionsProps) {
  const forwardProps = forward.type === 'button' ? { onClick: forward.onClick } : { type: 'submit' }
  const backProps =
    back.type === 'link' ? { component: StyledLink, to: back.to } : { onClick: back.onClick }

  return (
    <Box sx={{ mt: 12, pt: 4, display: 'flex', borderTop: 1, borderColor: 'divider' }}>
      <StyledButton variant="contained" sx={{ mr: 3 }} {...forwardProps}>
        {forward.label}
      </StyledButton>

      <StyledButton variant="outlined" {...backProps}>
        {back.label}
      </StyledButton>
    </Box>
  )
}
