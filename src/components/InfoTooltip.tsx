import React from 'react'
import { StyledOverlayTrigger } from './Shared/StyledOverlayTrigger'
import { StyledTooltip } from './Shared/StyledTooltip'

type InfoTooltipProps = {
  label: string
  className?: string
}

export function InfoTooltip({ label, className = '' }: InfoTooltipProps) {
  return (
    <StyledOverlayTrigger
      placement="top"
      overlay={
        <StyledTooltip className="opacity-100" id="tooltip">
          {label}
        </StyledTooltip>
      }
    >
      <i className={`text-primary fs-6 bi bi-info-circle ${className}`} />
    </StyledOverlayTrigger>
  )
}
