import React, { FunctionComponent, ReactElement } from 'react'
import { TableCell, TableRow, Typography } from '@mui/material'

type Cell = {
  label: string
  tooltip?: ReactElement
}

type StyledTableRowProps = {
  cellData: Array<Cell>
}

export const StyledTableRow: FunctionComponent<StyledTableRowProps> = ({ cellData, children }) => {
  return (
    <TableRow sx={{ bgcolor: 'common.white' }}>
      {cellData.map(({ label, tooltip }, i) => {
        const firstCell = i === 0

        return (
          <TableCell key={i} sx={{ py: 2 }}>
            <Typography
              component="span"
              sx={{
                fontWeight: firstCell ? 600 : 300,
                display: 'inline-flex',
                alignItems: 'center',
              }}
              variant={firstCell ? 'body2' : 'caption'}
            >
              {label}
              {tooltip}
            </Typography>
          </TableCell>
        )
      })}
      {children && <TableCell align="right">{children}</TableCell>}
    </TableRow>
  )
}
