import React from 'react'
import { Box, Paper, Typography } from '@mui/material'

export const AttributesContainer: React.FC<{
  title: string
  description: string
  children: React.ReactNode
}> = ({ title, description, children }) => {
  return (
    <Paper component="section">
      <Typography variant="sidenav" component="h3">
        {title}
      </Typography>
      <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Box sx={{ mt: 2 }}>{children}</Box>
    </Paper>
  )
}
