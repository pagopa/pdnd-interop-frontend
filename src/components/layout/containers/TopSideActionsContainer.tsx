import React from 'react'
import { Stack } from '@mui/material'

export const TopSideActionsContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {children}
    </Stack>
  )
}
