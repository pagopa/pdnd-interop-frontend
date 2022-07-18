import React, { FunctionComponent } from 'react'
import { Paper } from '@mui/material'

type StyledPaperProps = {
  margin?: boolean
}

export const StyledPaper: FunctionComponent<StyledPaperProps> = ({ children, margin = true }) => {
  return (
    <Paper sx={{ bgcolor: 'white' /* 'background.paper' */, p: 3, mt: margin ? 2 : 0 }}>
      {children}
    </Paper>
  )
}
