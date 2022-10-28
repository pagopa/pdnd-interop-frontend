import React from 'react'
import { CircularProgress, Stack, StackProps, SxProps, Typography } from '@mui/material'

type SpinnerProps = {
  label?: string | null
  direction?: StackProps['direction']
  sx?: SxProps
}

export function Spinner({ label, direction = 'column', sx }: SpinnerProps) {
  return (
    <Stack sx={sx} direction={direction} alignItems="center" justifyContent="center" spacing={2}>
      <CircularProgress />
      {label && (
        <Typography component="p" variant="body2" fontWeight={700} color="primary" sx={{ mb: 0 }}>
          {label}
        </Typography>
      )}
    </Stack>
  )
}
