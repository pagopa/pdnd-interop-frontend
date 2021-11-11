import React, { FunctionComponent } from 'react'
import { Box } from '@mui/system'
import { InfoTooltip } from './Shared/InfoTooltip'

type DescriptionBlockProps = {
  label: string
  tooltipLabel?: string
  sx?: any
}

export const DescriptionBlock: FunctionComponent<DescriptionBlockProps> = ({
  children,
  label,
  tooltipLabel,
  sx = {},
}) => {
  return (
    <Box sx={{ my: 4, ...sx }}>
      <strong>{label}</strong>
      {tooltipLabel && <InfoTooltip label={tooltipLabel} />}
      <br />
      {children}
    </Box>
  )
}
