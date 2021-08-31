import { AxiosError } from 'axios'
import React, { FunctionComponent } from 'react'
import { Table } from 'react-bootstrap'
import { LoadingWithMessage } from './LoadingWithMessage'
import { TablePagination } from './TablePagination'

type TableWithLoaderProps = {
  loading: boolean
  loadingLabel?: string
  headData: string[]
  pagination?: boolean
  data?: any[]
  noDataLabel?: string
  error?: AxiosError<any>
}

export const TableWithLoader: FunctionComponent<TableWithLoaderProps> = ({
  loading,
  loadingLabel,
  headData,
  children,
  pagination = false,
  data,
  noDataLabel = 'Questa ricerca non ha prodotto risultati',
  error,
}) => {
  if (error) {
    return <div>Errore</div>
  }

  return loading ? (
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
        <tbody>
          {data && data.length > 0 ? (
            children
          ) : (
            <tr>
              <td colSpan={headData.length}>{noDataLabel}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}
