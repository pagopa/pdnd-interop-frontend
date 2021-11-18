import React, { FunctionComponent } from 'react'
import { Button } from '@mui/material'

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
