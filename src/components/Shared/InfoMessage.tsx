import React from 'react'
import { Box, SxProps } from '@mui/system'
import { InfoOutlined as InfoOutlinedIcon } from '@mui/icons-material'
import { Typography } from '@mui/material'

type InfoMessageProps = {
  label: string | JSX.Element
  sx?: SxProps
}

export function InfoMessage({ label, sx = { mt: 1 } }: InfoMessageProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      <InfoOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />
      <Typography component="span" variant="caption">
        {label}
      </Typography>
    </Box>
  )
}
