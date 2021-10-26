import React, { FunctionComponent } from 'react'
import { Button } from '@mui/material'

/*
className
style
variant
onClick
type
disabled
as
to

*/

export const StyledButton: FunctionComponent<any> = ({ children, classes, ...props }) => {
  console.log(props)

  return <Button {...props}>{children}</Button>
}
