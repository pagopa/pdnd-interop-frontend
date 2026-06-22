import type { ActionItemButton } from '@/types/common.types'
import { Box, Button, Stack, Tooltip } from '@mui/material'
import React from 'react'
import { ActionMenu } from '../ActionMenu'

type ActionsButtonsProps = {
  actions: ActionItemButton[]
}

export const ActionsButtons: React.FC<ActionsButtonsProps> = ({ actions }) => {
  const primaryActions = actions.length <= 2 ? actions : actions.slice(0, 2)
  const secondaryActions = actions.length <= 2 ? undefined : actions.slice(2)

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {primaryActions.map(
        (
          { action, label, color, icon: Icon, tooltip, onPointerEnter, onFocusVisible, ...props },
          i
        ) => {
          const Wrapper = tooltip
            ? ({ children }: { children: React.ReactElement }) => (
                <Tooltip arrow title={tooltip}>
                  <span tabIndex={props.disabled ? 0 : undefined}>{children}</span>
                </Tooltip>
              )
            : React.Fragment

          return (
            <Wrapper key={i}>
              <Button
                onClick={action}
                variant="text"
                color={color}
                startIcon={Icon && <Icon />}
                onPointerEnter={onPointerEnter}
                onFocusVisible={onFocusVisible}
                {...props}
              >
                {label}
              </Button>
            </Wrapper>
          )
        }
      )}
      {secondaryActions && (
        <Box component="span" sx={{ display: 'inline-block' }}>
          <ActionMenu actions={secondaryActions} />
        </Box>
      )}
    </Stack>
  )
}
