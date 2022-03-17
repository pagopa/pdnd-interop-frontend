import React, { FunctionComponent } from 'react'
import { Grid, Typography } from '@mui/material'
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
  sx = { my: 5 },
  childWrapperSx = {},
}) => {
  return (
    <Grid container sx={sx} columnSpacing={4}>
      <Grid item xs={3}>
        <Typography
          component="span"
          fontWeight={700}
          textTransform="uppercase"
          color="text.secondary"
          variant="body2"
        >
          {label}
        </Typography>
        {tooltipLabel && <InfoTooltip label={tooltipLabel} />}
      </Grid>
      <Grid item xs={9}>
        <Box sx={childWrapperSx}>{children}</Box>
      </Grid>
    </Grid>
  )
}
