import React, { FunctionComponent } from 'react'
import { Form, FormProps } from 'react-bootstrap'

export const StyledForm: FunctionComponent<FormProps> = ({ children, ...props }) => {
  return <Form {...props}>{children}</Form>
}
