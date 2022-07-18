import React, { FunctionComponent } from 'react'
import { Grid, Stack, Typography, Box } from '@mui/material'
import { SxProps } from '@mui/system'
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
  sx = { my: 4 },
  childWrapperSx = {},
  leftGridItem = 3,
}) => {
  return (
    <Grid container sx={sx} columnSpacing={4}>
      <Grid item xs={12} xl={leftGridItem}>
        <Stack sx={{ mb: 1 }}>
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
            <Typography
              variant="caption"
              color="text.secondary"
              lineHeight={1.25}
              sx={{ display: 'inline-block' }}
            >
              {labelDescription}
            </Typography>
          )}
        </Stack>
      </Grid>
      <Grid item xs={12} xl={12 - leftGridItem}>
        <Box sx={childWrapperSx}>{children}</Box>
      </Grid>
    </Grid>
  )
}
