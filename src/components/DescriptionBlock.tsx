import React, { FunctionComponent } from 'react'
import { Box } from '@mui/system'
import { InfoTooltip } from './Shared/InfoTooltip'

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
    <Box sx={{ mb: '1rem' }}>
      <strong>{label}</strong>
      {tooltipLabel && <InfoTooltip label={tooltipLabel} />}
      <br />
      {children}
    </Box>
  )
}
