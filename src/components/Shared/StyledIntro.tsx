import React, { FunctionComponent } from 'react'
import { Box, Skeleton, Typography } from '@mui/material'
import { SxProps } from '@mui/system'

export type StyledIntroChildrenProps = {
  title: React.ReactNode
  description?: React.ReactNode
}

type TitleH = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

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

  return (
    <Box sx={{ ...sx, ...pageTitleSpacing }}>
      <Typography component={component} variant={variant} color="inherit">
        {/* Weirldy enough, it doesn't show it without explicitly setting the height */}
        {isLoading ? <Skeleton height={40} /> : children.title}
      </Typography>
      {Object.keys(children).includes('description') && (
        <Typography sx={{ mt: 1, mb: 0, ...pProps }}>
          {isLoading ? <Skeleton height={27} /> : children.description}
        </Typography>
      )}
    </Box>
  )
}
