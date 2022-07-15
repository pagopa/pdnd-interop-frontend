import React from 'react'
import { Box, Typography } from '@mui/material'

type StyledInputErrorProps = {
  error: unknown
}

type Error = {
  message: string
}

export function StyledInputError({ error }: StyledInputErrorProps) {
  return (
    <Box>
      <Typography variant="caption" color="error">
        {(error as Error).message}
      </Typography>
    </Box>
  )
}
