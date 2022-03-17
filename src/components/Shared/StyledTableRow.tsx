import React, { FunctionComponent, ReactElement } from 'react'
import { Chip, TableCell, TableRow, Typography } from '@mui/material'
import has from 'lodash/has'
import { MUIColor } from '../../../types'

type LabelCell = {
  label: string
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
        const firstCell = i === 0

        return (
          <TableCell key={i} sx={{ py: 2 }}>
            {has(cell, 'chipLabel') ? (
              <Chip label={(cell as ChipCell).chipLabel} color={(cell as ChipCell).color} />
            ) : (
              <Typography
                component="span"
                sx={{ fontWeight: firstCell ? 600 : 300, display: 'inline-block' }}
                variant={firstCell ? 'body2' : 'caption'}
              >
                {(cell as LabelCell).label}
                {(cell as LabelCell).tooltip}
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
