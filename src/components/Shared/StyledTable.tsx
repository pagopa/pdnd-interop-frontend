import React, { FunctionComponent } from 'react'
import { Table, TableProps } from 'react-bootstrap'

export const StyledTable: FunctionComponent<TableProps> = ({ children, ...props }) => {
  return <Table {...props}>{children}</Table>
}
