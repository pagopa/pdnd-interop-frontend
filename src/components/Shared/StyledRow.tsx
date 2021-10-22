import React, { FunctionComponent } from 'react'
import { Row, RowProps } from 'react-bootstrap'

export const StyledRow: FunctionComponent<RowProps> = ({ children, ...props }) => {
  return <Row {...props}>{children}</Row>
}
