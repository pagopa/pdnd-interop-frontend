import React, { FunctionComponent } from 'react'
import { Button } from '@mui/material'
import { StyledLink } from './StyledLink'

// This 'any' is needed. It is not possible to type this now due to MUI's typing of this component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledButtonComponent: FunctionComponent<any> = React.forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <Button {...props} component={props.to ? StyledLink : undefined} ref={ref}>
        {children}
      </Button>
    )
  }
)

StyledButtonComponent.displayName = 'StyledButton'

export const StyledButton = StyledButtonComponent
