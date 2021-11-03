import React, { FunctionComponent } from 'react'
import { Button } from '@mui/material'

export const StyledButton: FunctionComponent<any> = React.forwardRef(
  ({ children, isMock, ...props }, ref) => {
    return (
      <Button {...props} className={isMock ? 'mockFeature' : ''} ref={ref}>
        {children}
      </Button>
    )
  }
)
