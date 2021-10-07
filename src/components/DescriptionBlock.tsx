import React, { FunctionComponent } from 'react'
import { InfoTooltip } from './InfoTooltip'

type DescriptionBlockProps = {
  label: string
  tooltipLabel?: string
}

export const DescriptionBlock: FunctionComponent<DescriptionBlockProps> = ({
  children,
  label,
  tooltipLabel,
}) => {
  return (
    <div className="mb-3">
      <strong>{label}</strong>
      {tooltipLabel && <InfoTooltip className="ms-2" label={tooltipLabel} />}
      <br />
      {children}
    </div>
  )
}
