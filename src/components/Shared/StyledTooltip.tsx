import React, { FunctionComponent } from 'react'
import { Tooltip, TooltipProps } from '@mui/material'

export const StyledTooltip: FunctionComponent<TooltipProps> = ({
  title,
  placement = 'top',
  children,
}) => {
  return (
    <Tooltip title={title} placement={placement}>
      {children}
    </Tooltip>
  )
}
