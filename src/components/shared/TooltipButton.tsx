import { Tooltip, Button, Stack } from '@mui/material'
import React from 'react'

type TooltipButtonProps = {
  tooltip?: React.ReactNode
  label: string
  Icon?: React.ElementType
} & React.ComponentProps<typeof Button>

export const TooltipButton: React.FC<TooltipButtonProps> = ({
  tooltip,
  label,
  Icon,
  disabled,
  ...props
}) => {
  const Wrapper = tooltip
    ? ({ children }: { children: React.ReactElement }) => (
        <Tooltip placement="right-end" arrow title={tooltip}>
          <span>{children}</span>
        </Tooltip>
      )
    : React.Fragment

  return (
    <Stack direction="row">
      <Wrapper key={label}>
        <Button
          disabled={disabled}
          onClick={props.onClick}
          sx={{
            maxHeight: 2,
            paddingX: 1,
          }}
          variant="text"
          startIcon={Icon && <Icon />}
          {...props}
        >
          {label}
        </Button>
      </Wrapper>
    </Stack>
  )
}
