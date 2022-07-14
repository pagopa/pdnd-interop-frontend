import { Stack } from '@mui/material'
import { Box } from '@mui/system'
import React, { FunctionComponent } from 'react'

export const PageBottomActions: FunctionComponent = ({ children }) => {
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      {React.Children.map(children, (c, i) => {
        if (!c) return null // Filter out falsy values
        return <Box key={i}>{c}</Box>
      })}
    </Stack>
  )
}
