import React from 'react'
import { CircularProgress, Paper, Stack, StackProps, Typography } from '@mui/material'

type LoadingWithMessageProps = {
  label?: string | null
  transparentBackground?: boolean
  direction?: StackProps['direction']
}

export function LoadingWithMessage({
  label,
  transparentBackground = false,
  direction = 'column',
}: LoadingWithMessageProps) {
  const background = transparentBackground
    ? { backgroundColor: 'transparent' }
    : { bgcolor: 'common.white' }
  const color = 'primary.main'

  return (
    <Paper sx={{ px: 3, py: 3, color, ...background }}>
      <Stack direction={direction} alignItems="center" justifyContent="center" spacing={2}>
        <CircularProgress />
        {label && (
          <Typography
            component="p"
            variant="body2"
            fontWeight={700}
            sx={{ mb: 0, color: 'inherit' }}
          >
            {label}
          </Typography>
        )}
      </Stack>
    </Paper>
  )
}
