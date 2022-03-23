import React, { FunctionComponent } from 'react'
import { Typography } from '@mui/material'
import { Box, SxProps } from '@mui/system'

export type StyledIntroChildrenProps = {
  title: React.ReactNode
  description?: React.ReactNode
}

type StyledIntroProps = {
  children: StyledIntroChildrenProps
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  sx?: SxProps
  centered?: boolean
}

export const StyledIntro: FunctionComponent<StyledIntroProps> = ({
  children,
  variant = 'h1',
  sx = { mb: 4, pb: 3 },
  centered = false,
}) => {
  const pProps = centered ? { ml: 'auto', mr: 'auto' } : {}

  return (
    <Box sx={sx}>
      <Typography variant={variant} color="inherit">
        {children.title}
      </Typography>
      {children.description && (
        <Typography sx={{ mt: 0.5, mb: 0, maxWidth: 740, ...pProps }} color="text.secondary">
          {children.description}
        </Typography>
      )}
    </Box>
  )
}
