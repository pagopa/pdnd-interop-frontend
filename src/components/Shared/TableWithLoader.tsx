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
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'

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
      <Box sx={{ my: '2rem', px: '1.5rem', py: '1.5rem', bgcolor: 'error' }}>
        C'è stato un errore, e non è stato possibile reperire le informazioni richieste. Per favore,
        riprova più tardi
      </Box>
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
              <TableCell key={i}>
                <Typography
                  component="span"
                  variant="caption"
                  color="secondary.main"
                  sx={{ fontWeight: 700 }}
                >
                  {item.toUpperCase()}
                </Typography>
              </TableCell>
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
