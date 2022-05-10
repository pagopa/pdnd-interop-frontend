import React, { FunctionComponent, ReactElement } from 'react'
import { Chip, TableCell, TableRow, Typography } from '@mui/material'
import { MUIColor } from '../../../types'

type LabelCell = {
  label: string | JSX.Element
  tooltip?: ReactElement
}

type ChipCell = {
  chipLabel: string
  color?: MUIColor
}

type Cell = LabelCell | ChipCell

type StyledTableRowProps = {
  cellData: Array<Cell>
}

export const StyledTableRow: FunctionComponent<StyledTableRowProps> = ({ cellData, children }) => {
  return (
    <TableRow sx={{ bgcolor: 'common.white' }}>
      {cellData.map((cell, i) => {
        return (
          <TableCell key={i} sx={{ py: 2 }}>
            {'chipLabel' in cell ? (
              <Chip label={cell.chipLabel} color={cell.color} />
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
