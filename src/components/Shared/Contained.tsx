import React, { FunctionComponent } from 'react'
import { Box } from '@mui/system'
import { MEDIUM_MAX_WIDTH, NARROW_MAX_WIDTH } from '../../lib/constants'

type ContainedProps = {
  type?: 'medium' | 'narrow'
}

export const Contained: FunctionComponent<ContainedProps> = ({ type = 'medium', children }) => {
  return (
    <Box sx={{ maxWidth: type === 'medium' ? MEDIUM_MAX_WIDTH : NARROW_MAX_WIDTH }}>{children}</Box>
  )
}
