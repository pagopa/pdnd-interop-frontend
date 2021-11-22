import React, { ReactElement } from 'react'
import { useHistory } from 'react-router-dom'
import { TableCell, TableRow, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ActionMenu } from './ActionMenu'
import { StyledButton } from './StyledButton'
import { ActionProps } from '../../../types'

type Cell = {
  label: string
  tooltip?: ReactElement
}

type SingleActionLinkProps = {
  label: string
  to: string
}

type StyledTableRowProps = {
  cellData: Cell[]
  index: number
  singleActionBtn?: SingleActionLinkProps
  actions?: ActionProps[]
}

export function StyledTableRow({ cellData, index, singleActionBtn, actions }: StyledTableRowProps) {
  const history = useHistory()

  return (
    <TableRow sx={{ bgcolor: 'common.white' }}>
      {cellData.map(({ label, tooltip }, i) => {
        return (
          <TableCell key={i} sx={{ py: 2 }}>
            <Typography
              component="span"
              sx={{ fontWeight: i === 0 ? 600 : 300, display: 'inline-flex', alignItems: 'center' }}
              variant={i === 0 ? 'body2' : 'caption'}
            >
              {label}
              {tooltip}
            </Typography>
          </TableCell>
        )
      })}

      <TableCell align="right">
        {singleActionBtn && (
          <StyledButton
            variant="outlined"
            size="small"
            onClick={() => {
              history.push(singleActionBtn.to)
            }}
          >
            {singleActionBtn.label}
          </StyledButton>
        )}

        {actions && Boolean(actions.length > 0) ? (
          <ActionMenu actions={actions} index={index} />
        ) : (
          <Box component="span" sx={{ width: 75, display: 'inline-block' }} />
        )}
      </TableCell>
    </TableRow>
  )
}
