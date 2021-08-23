import React, { FunctionComponent } from 'react'
import { Table } from 'react-bootstrap'
import { LoadingWithMessage } from './LoadingWithMessage'
import { TablePagination } from './TablePagination'

type TableWithLoaderProps = {
  isLoading: boolean
  loadingLabel?: string
  headData: string[]
  pagination?: boolean
}

export const TableWithLoader: FunctionComponent<TableWithLoaderProps> = ({
  isLoading,
  loadingLabel,
  headData,
  children,
  pagination = false,
}) => {
  return isLoading ? (
    <LoadingWithMessage label={loadingLabel} />
  ) : (
    <div>
      {pagination && <TablePagination />}
      <Table striped>
        <thead className="bg-light text-dark">
          <tr>
            {headData.map((item, i) => (
              <th key={i}>{item.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </Table>
    </div>
  )
}
