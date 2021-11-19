import React, { FunctionComponent } from 'react'
import { Typography } from '@mui/material'
import { Box, SxProps } from '@mui/system'

export type StyledIntroChildrenProps = {
  title: React.ReactNode
  description?: React.ReactNode
}

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'button'
  | 'overline'
  | 'inherit'
  | undefined

type StyledIntroProps = {
  children: StyledIntroChildrenProps
  variant?: TypographyVariant
  sx?: SxProps
}

export const StyledIntro: FunctionComponent<StyledIntroProps> = ({
  children,
  variant = 'h1',
  sx = {},
}) => {
  return (
    <Box sx={{ mb: 4, pb: 3, ...sx }}>
      <Typography variant={variant} sx={{ mb: 2 }} color="inherit">
        {children.title}
      </Typography>
      {children.description && (
        <Typography sx={{ mb: 0, maxWidth: 740 }} color="inherit">
          {children.description}
        </Typography>
      )}
    </Box>
  )
}
