import React from 'react'
import { CircularProgress, Paper, Typography } from '@mui/material'

type LoadingWithMessageProps = {
  label?: string | null
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
    <Paper
      sx={{
        textAlign: 'center',
        px: 3,
        py: 3,
        color: 'text.primary',
        ...background,
      }}
    >
      <CircularProgress color="inherit" />
      {label && (
        <Typography component="p" variant="body2" fontWeight={700} sx={{ mt: 2, mb: 0 }}>
          {label}
        </Typography>
      )}
    </Paper>
  )
}
