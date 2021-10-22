import React, { FunctionComponent, Ref } from 'react'
import { Tooltip, TooltipProps } from 'react-bootstrap'

export const StyledTooltip: FunctionComponent<TooltipProps> = React.forwardRef(
  ({ children, ...props }, ref: Ref<HTMLDivElement> | undefined) => {
    return (
      <Tooltip {...props} ref={ref}>
        {children}
      </Tooltip>
    )
  }
)
