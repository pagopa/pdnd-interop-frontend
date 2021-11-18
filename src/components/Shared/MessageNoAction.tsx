import React from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { RequestOutcomeMessage } from '../../../types'

export function MessageNoAction({ img, title, description }: RequestOutcomeMessage) {
  return (
    <Box sx={{ textAlign: 'center', m: 'auto' }}>
      <i>
        <img width={100} src={img.src} alt={img.alt} />
      </i>
      <Typography variant="h2" component="h1" sx={{ mt: 3, mb: 2 }}>
        {title}
      </Typography>
      {description}
    </Box>
  )
}
