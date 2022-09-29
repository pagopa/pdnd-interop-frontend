import React from 'react'
import { Box, Typography, Stack, Divider } from '@mui/material'

interface InformationRowProps {
  label: React.ReactNode | string
  labelDescription?: string
  children: React.ReactNode
  rightContent?: React.ReactNode
}

export function InformationRow({
  label,
  labelDescription,
  rightContent,
  children,
}: InformationRowProps) {
  return (
    <Stack spacing={4} direction="row">
      <Box sx={{ flexShrink: 0, maxWidth: '200px', flex: 1 }}>
        <Typography variant="body2">{label}</Typography>
        {labelDescription && (
          <>
            <Divider sx={{ my: '3px' }} />
            <Typography sx={{ fontSize: '0.875rem' }} color="text.secondary" variant="body2">
              {labelDescription}
            </Typography>
          </>
        )}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography component="div" variant="body2" fontWeight={600}>
          {children}
        </Typography>
      </Box>
      {rightContent && <Stack justifyContent="start">{rightContent}</Stack>}
    </Stack>
  )
}
