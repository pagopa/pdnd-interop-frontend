import React from 'react'
import { Stack, Button } from '@mui/material'
import { Link, type RouteKey } from '@/router'

type ActionButton = {
  label: string
  type: 'button'
  onClick: VoidFunction
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

type ActionLink = {
  label: string
  type: 'link'
  to: RouteKey
  disabled?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

type ActionSubmit = {
  label: string
  type: 'submit'
  disabled?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
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
    back && back.type === 'link' ? { component: Link, to: back.to } : { onClick: back?.onClick }

  const getJustifyContentProp = () => {
    if (back && forward) return 'space-between'

    if (!back && forward) return 'end'

    if (back && !forward) return 'start'

    return undefined
  }

  return (
    <Stack direction="row" justifyContent={getJustifyContentProp()} spacing={2} sx={{ mt: 5 }}>
      {back && (
        <Button variant="outlined" startIcon={back.startIcon} endIcon={back.endIcon} {...backProps}>
          {back.label}
        </Button>
      )}

      {forward && (
        <Button
          variant="contained"
          startIcon={forward.startIcon}
          endIcon={forward.endIcon}
          {...forwardProps}
          type={forwardProps?.type as 'submit' | 'button'}
        >
          {forward.label}
        </Button>
      )}
    </Stack>
  )
}
