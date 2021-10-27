import React, { FunctionComponent } from 'react'
import { Tooltip, TooltipProps } from '@mui/material'

export const StyledTooltip: FunctionComponent<TooltipProps> = ({ title, children }) => {
  return (
    <Tooltip title={title} placement="top">
      {children}
    </Tooltip>
  )
}
