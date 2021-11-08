import React from 'react'
import { Box } from '@mui/system'
import { InfoOutlined as InfoOutlinedIcon } from '@mui/icons-material'
import { Typography } from '@mui/material'

type InfoMessageProps = {
  label: string
}

export function InfoMessage({ label }: InfoMessageProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
      <InfoOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />
      <Typography component="span" variant="caption">
        {label}
      </Typography>
    </Box>
  )
}
