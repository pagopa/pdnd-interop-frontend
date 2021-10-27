import React, { FunctionComponent } from 'react'
import { Button } from '@mui/material'

export const StyledButton: FunctionComponent<any> = React.forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <Button {...props} ref={ref}>
        {children}
      </Button>
    )
  }
)
