import { AxiosError } from 'axios'
import React, { FunctionComponent } from 'react'
import { Table } from 'react-bootstrap'
import { LoadingWithMessage } from './LoadingWithMessage'
import { TablePagination } from './TablePagination'

type TableWithLoaderProps = {
  loadingText: string | null
  headData: string[]
  pagination?: boolean
  data?: any[]
  noDataLabel?: string
  error?: AxiosError<any>
}

export const TableWithLoader: FunctionComponent<TableWithLoaderProps> = ({
  loadingText,
  headData,
  children,
  pagination = false,
  data,
  noDataLabel = 'Questa ricerca non ha prodotto risultati',
  error,
}) => {
  if (error) {
    return (
      <div className="bg-danger my-4 px-3 py-3">
        C'è stato un errore, e non è stato possibile reperire le informazioni richieste. Per favore,
        riprova più tardi
      </div>
    )
  }

  return loadingText ? (
    <LoadingWithMessage label={loadingText} />
  ) : (
    <div>
      {pagination && <TablePagination />}
      <Table striped>
        <thead className="bg-secondary">
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
