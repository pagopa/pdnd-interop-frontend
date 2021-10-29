import React from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { StyledSpinner } from './StyledSpinner'

type LoadingWithMessageProps = {
  label?: string
  transparentBackground?: boolean
}

export function LoadingWithMessage({
  label,
  transparentBackground = false,
}: LoadingWithMessageProps) {
  const background = transparentBackground
    ? { backgroundColor: 'transparent' }
    : { bgcolor: 'common.white' }

  return (
    <Box
      sx={{
        textAlign: 'center',
        px: '1.5rem',
        py: '1.5rem',
        color: 'primary.main',
        ...background,
      }}
    >
      <StyledSpinner />
      {label && <Typography sx={{ mt: '1rem', mb: 0 }}>{label}</Typography>}
    </Box>
  )
}
