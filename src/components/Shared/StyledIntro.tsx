import { Typography } from '@mui/material'
import { Box, SxProps } from '@mui/system'
import React, { FunctionComponent } from 'react'
import { NARROW_MAX_WIDTH } from '../../lib/constants'

type ChildrenProps = {
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
  children: ChildrenProps
  variant?: TypographyVariant
  sx?: SxProps
}

export const StyledIntro: FunctionComponent<StyledIntroProps> = ({
  children,
  variant = 'h1',
  sx = {},
}) => {
  return (
    <Box sx={{ maxWidth: NARROW_MAX_WIDTH, mb: '2rem', pb: '1.5rem', ...sx }}>
      <Typography variant={variant} sx={{ mb: '1rem' }}>
        {children.title}
      </Typography>
      {children.description && <Typography className="mb-0">{children.description}</Typography>}
    </Box>
  )
}
