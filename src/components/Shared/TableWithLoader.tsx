import React, { FunctionComponent } from 'react'
import { AxiosError } from 'axios'
import { LoadingWithMessage } from './LoadingWithMessage'
import {
  TableContainer,
  Table,
  // TableFooter,
  // TablePagination,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@mui/material'

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
    <LoadingWithMessage label={loadingText} transparentBackground={true} />
  ) : (
    <TableContainer>
      <Table sx={{ borderSpacing: '0 1rem', borderCollapse: 'separate' }}>
        <TableHead>
          <TableRow>
            {headData.map((item, i) => (
              <TableCell key={i}>{item.toUpperCase()}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? (
            children
          ) : (
            <TableRow>
              <TableCell colSpan={headData.length}>{noDataLabel}</TableCell>
            </TableRow>
          )}
        </TableBody>
        {/* <TableFooter>{pagination && <TablePagination />}</TableFooter> */}
      </Table>
    </TableContainer>
  )
}
