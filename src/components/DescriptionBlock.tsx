import React, { FunctionComponent } from 'react'
import { Grid, Typography } from '@mui/material'
import { Box, SxProps } from '@mui/system'
import { InfoTooltip } from './Shared/InfoTooltip'

type DescriptionBlockProps = {
  label: string
  tooltipLabel?: string
  labelDescription?: string
  sx?: SxProps
  childWrapperSx?: SxProps
  leftGridItem?: 3 | 4 | 5 | 6 | 7 | 8 | 9
}

export const DescriptionBlock: FunctionComponent<DescriptionBlockProps> = ({
  children,
  label,
  labelDescription,
  tooltipLabel,
  sx = { my: 5 },
  childWrapperSx = {},
  leftGridItem = 3,
}) => {
  return (
    <Grid container sx={sx} columnSpacing={4}>
      <Grid item xs={leftGridItem}>
        <Box>
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
        </Box>
        {labelDescription && (
          <Box>
            <Typography>{labelDescription}</Typography>
          </Box>
        )}
      </Grid>
      <Grid item xs={12 - leftGridItem}>
        <Box sx={childWrapperSx}>{children}</Box>
      </Grid>
    </Grid>
  )
}
