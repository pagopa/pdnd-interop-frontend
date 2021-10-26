import React from 'react'
import { StyledTooltip } from './Shared/StyledTooltip'

type InfoTooltipProps = {
  label: string
  className?: string
}

export function InfoTooltip({ label, className = '' }: InfoTooltipProps) {
  return (
    <StyledTooltip title={label}>
      <i className={`text-primary fs-6 bi bi-info-circle ${className}`} />
    </StyledTooltip>
  )
}
