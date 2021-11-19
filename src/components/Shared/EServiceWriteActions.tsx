import React from 'react'
import { Box } from '@mui/system'
import { StyledButton } from './StyledButton'
import { StyledLink } from './StyledLink'

type BackAction = {
  label: string
  to?: string
  onClick?: VoidFunction
}

type ForwardAction = {
  label: string
  onClick?: VoidFunction
}

type EServiceWriteActionsProps = {
  back: BackAction
  forward: ForwardAction
}

export function EServiceWriteActions({ back, forward }: EServiceWriteActionsProps) {
  const forwardProps = forward.onClick ? { onClick: forward.onClick } : { type: 'submit' }
  const backProps = back.to ? { component: StyledLink, to: back.to } : { onClick: back.onClick }

  return (
    <Box sx={{ mt: 12, pt: 4, display: 'flex', borderTop: 1, borderColor: 'divider' }}>
      <StyledButton variant="contained" sx={{ mr: 3 }} {...forwardProps}>
        {forward.label}
      </StyledButton>

      <StyledButton variant="outlined" {...backProps}>
        {back.label}
      </StyledButton>
    </Box>
  )
}
