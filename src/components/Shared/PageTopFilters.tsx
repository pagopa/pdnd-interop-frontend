import { Stack } from '@mui/material'
import { Box } from '@mui/system'
import React, { FunctionComponent } from 'react'

export const PageTopFilters: FunctionComponent = ({ children }) => {
  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ my: 3 }}>
      {React.Children.map(children, (c, i) => (
        <Box key={i}>{c}</Box>
      ))}
    </Stack>
  )
}
