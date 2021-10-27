import React from 'react'
import { StyledTooltip } from './Shared/StyledTooltip'

type InfoTooltipProps = {
  label: string
}

export function InfoTooltip({ label }: InfoTooltipProps) {
  return (
    <StyledTooltip title={label}>
      <i className={`text-primary fs-6 bi bi-info-circle ms-2`} />
    </StyledTooltip>
  )
}
