import React, { FunctionComponent } from 'react'
import { Stack, Box } from '@mui/material'

export const PageTopFilters: FunctionComponent = ({ children }) => {
  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ my: 3 }}>
      {React.Children.map(children, (c, i) => (
        <Box key={i}>{c}</Box>
      ))}
    </Stack>
  )
}
