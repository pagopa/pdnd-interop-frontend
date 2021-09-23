import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

type InfoTooltipProps = {
  label: string
  className?: string
}

export function InfoTooltip({ label, className = '' }: InfoTooltipProps) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip className="opacity-100" id="tooltip">
          {label}
        </Tooltip>
      }
    >
      <i className={`text-primary fs-6 bi bi-info-circle ${className}`} />
    </OverlayTrigger>
  )
}
