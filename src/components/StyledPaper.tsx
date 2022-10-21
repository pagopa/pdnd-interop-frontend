import React, { FunctionComponent } from 'react'
import { Paper, SxProps } from '@mui/material'

type StyledPaperProps = {
  sx?: SxProps
  margin?: boolean
}

export const StyledPaper: FunctionComponent<StyledPaperProps> = ({
  children,
  sx,
  margin = true,
}) => {
  return (
    <Paper sx={{ bgcolor: 'white' /* 'background.paper' */, p: 3, mt: margin ? 2 : 0, ...sx }}>
      {children}
    </Paper>
  )
}
