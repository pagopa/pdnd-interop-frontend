import React from 'react'
import useResolveError from '@/hooks/useResolveError'
import { Stack, Typography } from '@mui/material'
import type { ErrorRouteComponent } from '@tanstack/react-router'

export const ErrorComponent: ErrorRouteComponent = ({ error, reset }) => {
  const { title, description, content } = useResolveError({ error, reset })

  return (
    <Stack justifyContent="center" alignItems="center" spacing={4} sx={{ height: '100%', py: 16 }}>
      <Stack spacing={1} sx={{ textAlign: 'center', maxWidth: 560, mx: 'auto' }}>
        <Typography variant="h3" component="h1">
          {title}
        </Typography>
        <Typography variant="body1">{description}</Typography>
      </Stack>
      {content}
    </Stack>
  )
}
