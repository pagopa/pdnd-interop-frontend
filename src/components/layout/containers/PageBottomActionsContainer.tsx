import { Stack, Box } from '@mui/material'
import React from 'react'

type PageBottomActionsContainerProps = {
  children: React.ReactNode
}

export const PageBottomActionsContainer: React.FC<PageBottomActionsContainerProps> = ({
  children,
}) => {
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
      {React.Children.map(children, (c, i) => {
        if (!c) return null // Filter out falsy values
        return <Box key={i}>{c}</Box>
      })}
    </Stack>
  )
}
