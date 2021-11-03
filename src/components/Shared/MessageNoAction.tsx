import React from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { RequestOutcomeMessage } from '../../../types'
import { NARROW_MAX_WIDTH } from '../../lib/constants'

export function MessageNoAction({ img, title, description }: RequestOutcomeMessage) {
  return (
    <Box sx={{ textAlign: 'center', m: 'auto', maxWidth: NARROW_MAX_WIDTH }}>
      <i>
        <img width={120} src={img.src} alt={img.alt} />
      </i>
      <Typography variant="h1" sx={{ mt: 3, mb: 2 }}>
        {title}
      </Typography>
      {description.map((paragraph, i) => (
        <React.Fragment key={i}>{paragraph}</React.Fragment>
      ))}
    </Box>
  )
}
