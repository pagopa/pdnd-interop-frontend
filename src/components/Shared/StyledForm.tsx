import React, { FunctionComponent } from 'react'

export const StyledForm: FunctionComponent<
  React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
> = ({ children, ...props }) => {
  return <form {...props}>{children}</form>
}
