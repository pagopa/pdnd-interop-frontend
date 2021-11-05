import React from 'react'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'

type StyledInputErrorProps = {
  error: any
}

export function StyledInputError({ error }: StyledInputErrorProps) {
  return (
    <Box>
      <Typography variant="caption" color="error">
        {error.message}
      </Typography>
    </Box>
  )
}
