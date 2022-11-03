import React, { FunctionComponent } from 'react'
import { Paper, PaperProps } from '@mui/material'

type StyledPaperProps = {
  margin?: boolean
} & PaperProps

export const StyledPaper: FunctionComponent<StyledPaperProps> = ({
  children,
  margin = true,
  sx,
  ...props
}) => {
  return (
    <Paper
      sx={{ bgcolor: 'white' /* 'background.paper' */, p: 3, mt: margin ? 2 : 0, ...sx }}
      {...props}
    >
      {children}
    </Paper>
  )
}
