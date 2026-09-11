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
          {
            action,
            label,
            color,
            icon: Icon,
            tooltip,
            onPointerEnter,
            onFocusVisible,
            disabled,
            ...props
          },
          i
        ) => {
          const isAriaDisabled = Boolean(disabled)
          const tooltipText = typeof tooltip === 'string' ? tooltip : undefined

          const Wrapper = tooltip
            ? ({ children }: { children: React.ReactElement }) => (
                <Tooltip arrow title={tooltip} describeChild>
                  <span>{children}</span>
                </Tooltip>
              )
            : React.Fragment

          return (
            <Wrapper key={i}>
              <Button
                onClick={action}
                color={color}
                startIcon={Icon && <Icon />}
                onPointerEnter={onPointerEnter}
                onFocusVisible={onFocusVisible}
                aria-disabled={isAriaDisabled}
                aria-description={tooltipText}
                className={isAriaDisabled ? 'Mui-disabled' : undefined}
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
