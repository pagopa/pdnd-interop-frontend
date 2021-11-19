import React, { FunctionComponent } from 'react'
import { Typography } from '@mui/material'
import { Box, SxProps } from '@mui/system'
import { InfoTooltip } from './Shared/InfoTooltip'

type DescriptionBlockProps = {
  label: string
  tooltipLabel?: string
  sx?: SxProps
}

export const DescriptionBlock: FunctionComponent<DescriptionBlockProps> = ({
  children,
  label,
  tooltipLabel,
  sx = {},
}) => {
  return (
    <Box sx={{ my: 4, ...sx }}>
      <Typography component="span" fontWeight={700} color="secondary">
        {label}
      </Typography>
      {tooltipLabel && <InfoTooltip label={tooltipLabel} />}
      <br />
      {children}
    </Box>
  )
}
