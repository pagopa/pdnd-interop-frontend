import React, { FunctionComponent } from 'react'
import { Button } from '@mui/material'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledButtonComponent: FunctionComponent<any> = React.forwardRef(
  ({ children, isMock, ...props }, ref) => {
    return (
      <Button {...props} className={isMock ? 'mockFeature' : ''} ref={ref}>
        {children}
      </Button>
    )
  }
)

StyledButtonComponent.displayName = 'StyledButton'

export const StyledButton = StyledButtonComponent
