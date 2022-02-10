import React, { FunctionComponent } from 'react'
import { Typography } from '@mui/material'
import { Box, SxProps } from '@mui/system'
import { InfoTooltip } from './Shared/InfoTooltip'

type DescriptionBlockProps = {
  label: string
  tooltipLabel?: string
  sx?: SxProps
  childWrapperSx?: SxProps
}

export const DescriptionBlock: FunctionComponent<DescriptionBlockProps> = ({
  children,
  label,
  tooltipLabel,
  sx = { my: 4 },
  childWrapperSx = { pt: 1 },
}) => {
  return (
    <Box sx={sx}>
      <Typography component="span" fontWeight={700} color="secondary">
        {label}
      </Typography>
      {tooltipLabel && <InfoTooltip label={tooltipLabel} />}
      <br />
      <Box sx={childWrapperSx}>{children}</Box>
    </Box>
  )
}
