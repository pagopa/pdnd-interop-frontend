import React, { FunctionComponent } from 'react'
import { LoadingWithMessage } from './LoadingWithMessage'
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'

type TableWithLoaderProps = {
  loadingText: string | null
  noDataLabel?: string
  error?: Error
  headData: Array<string>
}

export const TableWithLoader: FunctionComponent<TableWithLoaderProps> = ({
  loadingText,
  noDataLabel = 'Questa ricerca non ha prodotto risultati',
  error,
  headData,
  children,
}) => {
  if (error) {
    return (
      <Box sx={{ my: 4, p: 2 }} bgcolor="error.main" color="common.white">
        C’è stato un errore, e non è stato possibile reperire le informazioni richieste. Per favore,
        riprova più tardi
      </Box>
    )
  }

  return loadingText ? (
    <LoadingWithMessage label={loadingText} transparentBackground={true} />
  ) : (
    <TableContainer>
      <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
        <TableHead>
          <TableRow>
            {headData.map((item, i) => (
              <TableCell key={i}>
                <Typography
                  component="span"
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 700 }}
                >
                  {item.toUpperCase()}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {children || (
            <TableRow>
              <TableCell colSpan={headData.length}>{noDataLabel}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
