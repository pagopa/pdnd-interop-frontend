import React, { FunctionComponent } from 'react'
import { Col, ColProps } from 'react-bootstrap'

export const StyledCol: FunctionComponent<ColProps> = ({ children, ...props }) => {
  return <Col {...props}>{children}</Col>
}
