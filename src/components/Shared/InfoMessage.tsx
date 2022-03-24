import React from 'react'
import { Box, SxProps } from '@mui/system'
import { InfoOutlined as InfoOutlinedIcon } from '@mui/icons-material'
import { Typography } from '@mui/material'

type InfoMessageProps = {
  label: string | JSX.Element
  sx?: SxProps
}

export function InfoMessage({ label, sx = {} }: InfoMessageProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx, color: 'text.secondary' }}>
      <InfoOutlinedIcon sx={{ fontSize: 18, mr: 1 }} color="inherit" />
      <Typography component="span" variant="caption" color="inherit">
        {label}
      </Typography>
    </Box>
  )
}
