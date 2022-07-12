import React, { FunctionComponent, ReactElement } from 'react'
import { TableCell, TableRow, Typography } from '@mui/material'

type LabelCell = {
  label: string | JSX.Element
  tooltip?: ReactElement
}

type CustomCell = {
  custom: React.ReactNode
}

type Cell = LabelCell | CustomCell

type StyledTableRowProps = {
  cellData: Array<Cell>
}

export const StyledTableRow: FunctionComponent<StyledTableRowProps> = ({ cellData, children }) => {
  return (
    <TableRow sx={{ bgcolor: 'common.white' }}>
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
    </TableRow>
  )
}
