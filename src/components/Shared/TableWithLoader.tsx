import React, { Children, FunctionComponent } from 'react'
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Grid,
  Alert,
} from '@mui/material'
import { Box } from '@mui/system'
import { LoadingWithMessage } from './LoadingWithMessage'

type TableWithLoaderProps = {
  loadingText: string | null
  noDataLabel?: string
  error?: Error
  headData: Array<string>
  viewType?: 'table' | 'grid'
}

export const TableWithLoader: FunctionComponent<TableWithLoaderProps> = ({
  loadingText,
  noDataLabel = 'Questa ricerca non ha prodotto risultati',
  error,
  headData,
  viewType = 'table',
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

  if (loadingText) {
    return <LoadingWithMessage label={loadingText} transparentBackground={true} />
  }

  return viewType === 'table' ? (
    <TableContainer>
      <Table>
        <TableHead sx={{ bgcolor: 'background.default' }}>
          <TableRow>
            {headData.map((item, i) => (
              <TableCell key={i}>{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody sx={{ bgcolor: 'background.paper' }}>
          {children && Children.count(children) > 0 ? (
            children
          ) : (
            <TableRow>
              <TableCell colSpan={headData.length}>
                <Alert severity="info">{noDataLabel}</Alert>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Grid container columnSpacing={2} rowSpacing={2} alignItems="stretch">
      {children && Children.count(children) > 0 ? (
        Children.map(children, (c, i) => (
          <Grid item xs={4} key={i}>
            {c}
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Alert severity="info">{noDataLabel}</Alert>
        </Grid>
      )}
    </Grid>
  )
}
