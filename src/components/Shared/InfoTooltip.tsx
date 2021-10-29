import React from 'react'
import { StyledTooltip } from './StyledTooltip'
import { Info as InfoIcon } from '@mui/icons-material'

type InfoTooltipProps = {
  label: string
}

export function InfoTooltip({ label }: InfoTooltipProps) {
  return (
    <StyledTooltip title={label}>
      <InfoIcon color="primary" fontSize="small" sx={{ ml: '0.25rem' }} />
    </StyledTooltip>
  )
}
