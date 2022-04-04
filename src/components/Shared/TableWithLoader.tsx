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
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { LoadingWithMessage } from './LoadingWithMessage'
import { ButtonNaked } from '@pagopa/mui-italia'
import { useHistory } from 'react-router-dom'
import { ReportGmailerrorred as ReportGmailerrorredIcon } from '@mui/icons-material'

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
  const history = useHistory()
  const reload = () => {
    history.go(0)
  }

  if (error) {
    return (
      <Box
        sx={{ my: 4, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        bgcolor="background.paper"
        color="text.secondary"
      >
        <ReportGmailerrorredIcon sx={{ mr: 1 }} fontSize="small" color="inherit" />
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
          Non siamo riusciti a recuperare questi dati.{' '}
          <ButtonNaked
            sx={{ fontSize: 'inherit', ml: 0.5, color: 'primary.main' }}
            onClick={reload}
          >
            Ricarica la pagina
          </ButtonNaked>
        </Typography>
      </Box>
    )
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
