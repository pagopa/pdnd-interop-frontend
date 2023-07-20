import { Stack } from '@mui/material'
import React from 'react'

type PageBottomActionsContainerProps = {
  children: React.ReactNode
}

export const PageBottomActionsContainer: React.FC<PageBottomActionsContainerProps> = ({
  children,
}) => {
  return (
    <Stack direction="row" spacing={1.5} sx={{ mt: 4 }}>
      {children}
    </Stack>
  )
}
