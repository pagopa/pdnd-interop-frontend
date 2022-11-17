import React from 'react'
import {
  TableContainer,
  Table as MUITable,
  TableBody,
  TableHead,
  TableRow as MUITableRow,
  TableCell,
  Alert,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

type TableProps = {
  children: React.ReactNode
  headLabels: Array<string>
  isEmpty?: boolean
  noDataLabel?: string
}

export const Table: React.FC<TableProps> = ({ children, noDataLabel, headLabels, isEmpty }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'table' })

  return (
    <TableContainer sx={{ borderRadius: 1 }}>
      <MUITable>
        <TableHead sx={{ bgcolor: 'background.default' }}>
          <MUITableRow>
            {headLabels.map((item, i) => (
              <TableCell key={i}>{item}</TableCell>
            ))}
          </MUITableRow>
        </TableHead>
        <TableBody sx={{ bgcolor: 'background.paper' }}>
          {children}
          {isEmpty && (
            <MUITableRow>
              <TableCell colSpan={headLabels.length} sx={{ p: 0 }}>
                <Alert severity="info">{noDataLabel || t('noDataLabel')}</Alert>
              </TableCell>
            </MUITableRow>
          )}
        </TableBody>
      </MUITable>
    </TableContainer>
  )
}

type LabelCell = {
  label: string | JSX.Element
  tooltip?: React.ReactElement
}

type CustomCell = {
  custom: React.ReactNode
}

type Cell = LabelCell | CustomCell

type TableRowProps = {
  children?: React.ReactNode
  cellData: Array<Cell>
}

export const TableRow: React.FC<TableRowProps> = ({ cellData, children }) => {
  return (
    <MUITableRow sx={{ bgcolor: 'common.white' }}>
      {cellData.map((cell, i) => {
        return (
          <TableCell key={i} sx={{ py: 2 }}>
            {'custom' in cell ? (
              cell.custom
            ) : (
              <Typography component="span" sx={{ display: 'inline-block' }} variant="body2">
                {cell.label}
                {cell.tooltip}
              </Typography>
            )}
          </TableCell>
        )
      })}
      {children && (
        <TableCell sx={{ minWidth: '15rem' }} align="right">
          {children}
        </TableCell>
      )}
    </MUITableRow>
  )
}
