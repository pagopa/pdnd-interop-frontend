import React from 'react'
import { Stack, Button } from '@mui/material'
import { RouteKey } from '@/router/types'
import { RouterLink } from '@/router'

type ActionButton = {
  label: string
  type: 'button'
  onClick: VoidFunction
}

type ActionLink = {
  label: string
  type: 'link'
  to: RouteKey
  disabled?: boolean
}

type ActionSubmit = {
  label: string
  type: 'submit'
  disabled?: boolean
}

export type BackAction = ActionButton | ActionLink
export type ForwardAction = ActionButton | ActionSubmit

type StepActionsProps = {
  back?: BackAction
  forward?: ForwardAction
}

export function StepActions({ back, forward }: StepActionsProps) {
  const forwardProps =
    forward &&
    (forward.type === 'button'
      ? { onClick: forward.onClick }
      : { type: 'submit', disabled: forward?.disabled })
  const backProps =
    back && back.type === 'link'
      ? { component: RouterLink, to: back.to }
      : { onClick: back?.onClick }

  return (
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      {back && (
        <Button variant="outlined" {...backProps}>
          {back.label}
        </Button>
      )}

      {forward && (
        <Button
          variant="contained"
          {...forwardProps}
          type={forwardProps?.type as 'submit' | 'button'}
        >
          {forward.label}
        </Button>
      )}
    </Stack>
  )
}
