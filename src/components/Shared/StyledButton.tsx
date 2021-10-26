import React, { FunctionComponent } from 'react'
import { Button } from '@mui/material'

export const StyledButton: FunctionComponent<any> = ({ children, ...props }) => {
  return <Button {...props}>{children}</Button>
}
