import React from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { StyledSpinner } from './StyledSpinner'

type LoadingWithMessageProps = {
  label?: string
}

export function LoadingWithMessage({ label }: LoadingWithMessageProps) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        px: '1.5rem',
        py: '1.5rem',
        bgcolor: 'common.white',
        color: 'primary.main',
      }}
    >
      <StyledSpinner />
      {label && <Typography sx={{ mt: '1rem', mb: 0 }}>{label}</Typography>}
    </Box>
  )
}
