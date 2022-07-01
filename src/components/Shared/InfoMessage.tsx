import React from 'react'
import { SxProps } from '@mui/system'
import { InfoOutlined as InfoOutlinedIcon } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'

type InfoMessageProps = {
  label: string | JSX.Element
  sx?: SxProps
}

export function InfoMessage({ label, sx = {} }: InfoMessageProps) {
  return (
    <Stack direction="row" sx={{ ...sx, color: 'text.secondary' }}>
      <InfoOutlinedIcon sx={{ fontSize: 18, mr: 1 }} color="inherit" />
      <Typography component="span" variant="caption" color="inherit">
        {label}
      </Typography>
    </Stack>
  )
}
