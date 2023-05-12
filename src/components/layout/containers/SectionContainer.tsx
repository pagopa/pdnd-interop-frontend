import { Box, Typography, Paper, Skeleton, Stack } from '@mui/material'
import type { PaperProps, SkeletonProps } from '@mui/material'
import React from 'react'

type SectionContainerProps = {
  title?: string
  description?: React.ReactNode
  children: React.ReactNode
}

export function SectionContainer({
  title,
  description,
  children,
  sx,
  ...props
}: PaperProps & SectionContainerProps) {
  return (
    <Paper sx={{ bgcolor: 'white', p: 3, mt: 2, ...sx }} {...props}>
      <Stack spacing={1}>
        {title && (
          <Typography component="h2" variant="overline">
            {title}
          </Typography>
        )}
        {description && (
          <Typography color="text.secondary" variant="caption">
            {description}
          </Typography>
        )}
      </Stack>
      <Box sx={{ mt: !!(title || description) ? 2 : 0 }}>{children}</Box>
    </Paper>
  )
}

export const SectionContainerSkeleton: React.FC<SkeletonProps> = ({ sx, ...props }) => {
  return <Skeleton variant="rectangular" sx={{ borderRadius: 1, mt: 2, ...sx }} {...props} />
}
