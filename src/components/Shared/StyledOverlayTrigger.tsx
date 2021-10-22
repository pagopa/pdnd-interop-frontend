import React, { FunctionComponent } from 'react'
import { OverlayTrigger, OverlayTriggerProps } from 'react-bootstrap'

export const StyledOverlayTrigger: FunctionComponent<OverlayTriggerProps> = ({
  children,
  ...props
}) => {
  return <OverlayTrigger {...props}>{children}</OverlayTrigger>
}
