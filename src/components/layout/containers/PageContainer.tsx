import React from 'react'
import { Box, Stack, SxProps, Typography } from '@mui/material'

type Props = {
  title: string
  description?: string
  topSideActions?: React.ReactNode
  sx?: SxProps
}

export const PageContainer: React.FC<Props & { children: React.ReactNode }> = ({
  children,
  sx,
  ...props
}) => {
  return (
    <Box sx={sx}>
      <StyledIntro {...props} />
      <Box sx={{ mt: 4 }}>{children}</Box>
    </Box>
  )
}

type StyledIntroProps = {
  title: string
  description?: string
  topSideActions?: React.ReactNode
}

const StyledIntro: React.FC<StyledIntroProps> = ({ title, description, topSideActions = null }) => {
  return (
    <Stack direction="row" alignItems="end" spacing={2}>
      <Box sx={{ flex: 1 }}>
        <Typography component="h1" variant="h4">
          {title}
        </Typography>
        {description && (
          <Typography component="p" variant="body1" sx={{ mt: 1, mb: 0 }}>
            {description}
          </Typography>
        )}
      </Box>

      {topSideActions}
    </Stack>
  )
}
