import React, { FunctionComponent } from 'react'
import { Box, Skeleton, Typography } from '@mui/material'
import { SxProps } from '@mui/system'
import { MUIColor } from '../../../types'

export type StyledIntroChildrenProps = {
  title: React.ReactNode
  description?: React.ReactNode
}

type TitleH = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type TextH = 'body1' | 'body2'

type StyledIntroProps = {
  children: StyledIntroChildrenProps
  component?: TitleH
  sx?: SxProps
  centered?: boolean
  isLoading?: boolean
}

export const StyledIntro: FunctionComponent<StyledIntroProps> = ({
  children,
  component = 'h1',
  sx = {},
  centered = false,
  isLoading = false,
}) => {
  const pProps = centered ? { ml: 'auto', mr: 'auto' } : {}
  const pageTitleSpacing = component === 'h1' ? { mb: 3 } : {}
  // This mapping comes from MUI Italia in Figma
  const variant = { h1: 'h4', h2: 'h5', h3: 'h6', h4: 'h6', h5: 'h6', h6: 'h6' }[
    component
  ] as TitleH
  const textVariant = {
    h1: { variant: 'body1' },
    h2: { variant: 'body1', color: 'text.secondary' },
    h3: { variant: 'body2', color: 'text.secondary' },
    h4: { variant: 'body2', color: 'text.secondary' },
    h5: { variant: 'body2', color: 'text.secondary' },
    h6: { variant: 'body2', color: 'text.secondary' },
  }[component] as { variant: TextH; color?: MUIColor }

  return (
    <Box sx={{ ...sx, ...pageTitleSpacing }}>
      <Typography component={component} variant={variant} color="inherit">
        {/* Weirldy enough, it doesn't show it without explicitly setting the height */}
        {isLoading ? <Skeleton height={40} /> : children.title}
      </Typography>
      {Object.keys(children).includes('description') && (
        <Typography
          component="p"
          variant={textVariant.variant}
          color={textVariant.color}
          sx={{ mt: 1, mb: 0, ...pProps }}
        >
          {isLoading ? <Skeleton height={27} /> : children.description}
        </Typography>
      )}
    </Box>
  )
}
