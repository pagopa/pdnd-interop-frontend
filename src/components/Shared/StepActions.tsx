import React from 'react'
import { StyledButton } from './StyledButton'
import { StyledLink } from './StyledLink'
import { Divider, Stack } from '@mui/material'

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
export type ForwardAction = ActionButton | ActionLink | ActionSubmit

type StepActionsProps = {
  back: BackAction
  forward?: ForwardAction
}

export function StepActions({ back, forward }: StepActionsProps) {
  const forwardProps =
    forward && (forward.type === 'button' ? { onClick: forward.onClick } : { type: 'submit' })
  const backProps =
    back.type === 'link' ? { component: StyledLink, to: back.to } : { onClick: back.onClick }

  return (
    <React.Fragment>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <StyledButton variant="outlined" {...backProps}>
          {back.label}
        </StyledButton>

        {forward && (
          <StyledButton variant="contained" {...forwardProps}>
            {forward.label}
          </StyledButton>
        )}
      </Stack>
    </React.Fragment>
  )
}
