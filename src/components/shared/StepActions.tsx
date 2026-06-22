import React from 'react'
import { Stack, Button, Tooltip } from '@mui/material'
import { Link, type RouteKey } from '@/router'

type ActionButton = {
  label: string
  type: 'button'
  onClick: VoidFunction
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  disabled?: boolean
  tooltip?: string
}

type ActionLink = {
  label: string
  type: 'link'
  to: RouteKey
  disabled?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  tooltip?: string
}

type ActionSubmit = {
  label: string
  type: 'submit'
  disabled?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  tooltip?: string
}

export type BackAction = ActionButton | ActionLink
export type SecondaryAction = ActionButton | ActionLink
export type ForwardAction = ActionButton | ActionSubmit

type StepActionsProps = {
  back?: BackAction
  secondaryAction?: SecondaryAction
  forward?: ForwardAction
}

export function StepActions({ back, secondaryAction, forward }: StepActionsProps) {
  const forwardProps =
    forward &&
    (forward.type === 'button'
      ? { onClick: forward.onClick, disabled: forward.disabled }
      : { type: 'submit', disabled: forward.disabled })

  const secondaryActionProps =
    secondaryAction &&
    (secondaryAction.type === 'link'
      ? { component: Link, to: secondaryAction.to, disabled: secondaryAction.disabled }
      : { onClick: secondaryAction.onClick, disabled: secondaryAction.disabled })

  const backProps =
    back && (back.type === 'link' ? { component: Link, to: back.to } : { onClick: back.onClick })

  const getJustifyContentProp = () => {
    const hasRightActions = secondaryAction || forward

    if (back && hasRightActions) return 'space-between'

    if (!back && hasRightActions) return 'end'

    if (back && !hasRightActions) return 'start'

    return undefined
  }

  return (
    <Stack
      direction="row"
      justifyContent={getJustifyContentProp()}
      spacing={2}
      sx={{ mt: 5, alignItems: 'center' }}
    >
      {back && (
        <Tooltip open={back.tooltip ? undefined : false} title={back.tooltip}>
          <span tabIndex={back.disabled ? 0 : undefined}>
            <Button
              variant="outlined"
              startIcon={back.startIcon}
              endIcon={back.endIcon}
              {...backProps}
            >
              {back.label}
            </Button>
          </span>
        </Tooltip>
      )}

      {(secondaryAction || forward) && (
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
          {secondaryAction && (
            <Tooltip
              open={secondaryAction.tooltip ? undefined : false}
              title={secondaryAction.tooltip}
            >
              <span tabIndex={secondaryAction.disabled ? 0 : undefined}>
                <Button
                  variant="text"
                  startIcon={secondaryAction.startIcon}
                  endIcon={secondaryAction.endIcon}
                  {...secondaryActionProps}
                >
                  {secondaryAction.label}
                </Button>
              </span>
            </Tooltip>
          )}

          {forward && (
            <Tooltip arrow open={forward.tooltip ? undefined : false} title={forward.tooltip}>
              <span tabIndex={forward.disabled ? 0 : undefined}>
                <Button
                  variant="contained"
                  startIcon={forward.startIcon}
                  endIcon={forward.endIcon}
                  {...forwardProps}
                  type={forwardProps?.type as 'submit' | 'button'}
                >
                  {forward.label}
                </Button>
              </span>
            </Tooltip>
          )}
        </Stack>
      )}
    </Stack>
  )
}
