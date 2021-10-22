import React, { FunctionComponent } from 'react'
import { Button, ButtonProps } from 'react-bootstrap'

type AdditionalTempProps = {
  to?: string
}

export const StyledButton: FunctionComponent<ButtonProps & AdditionalTempProps> = React.forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <Button ref={ref} {...props}>
        {children}
      </Button>
    )
  }
)
