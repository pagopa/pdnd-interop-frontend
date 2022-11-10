import React from 'react'
import { Box, Typography } from '@mui/material'

type InputErrorProps = {
  error: unknown
}

type Error = {
  message: string
}

export function InputError({ error }: InputErrorProps) {
  return (
    <Box>
      <Typography variant="caption" color="error">
        {(error as Error).message}
      </Typography>
    </Box>
  )
}
