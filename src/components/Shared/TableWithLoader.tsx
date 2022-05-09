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
import { LoadingWithMessage } from './LoadingWithMessage'
import { PageReloadMessage } from './PageReloadMessage'

type TableWithLoaderProps = {
  isLoading: boolean
  loadingText?: string
  noDataLabel?: string
  error?: Error
  headData: Array<string>
  viewType?: 'table' | 'grid'
}

export const TableWithLoader: FunctionComponent<TableWithLoaderProps> = ({
  isLoading,
  loadingText,
  noDataLabel = 'Questa ricerca non ha prodotto risultati',
  error,
  headData,
  viewType = 'table',
  children,
}) => {
  if (error) {
    return <PageReloadMessage />
  }

  if (isLoading) {
    return <LoadingWithMessage label={loadingText} transparentBackground />
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
              <TableCell colSpan={headData.length} sx={{ p: 0 }}>
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
