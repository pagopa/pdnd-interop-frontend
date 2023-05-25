import { Box, Typography, Paper, Skeleton, Stack } from '@mui/material'
import type { PaperProps, SkeletonProps } from '@mui/material'
import React from 'react'

interface SectionContainerProps extends PaperProps {
  title?: string
  description?: React.ReactNode
  children: React.ReactNode
  component?: React.ElementType

  /**
   * The `newDesign` prop is temporary and will be removed when the new section container design will be
   * implemented in the overall application.
   */
  newDesign?: boolean
}

export function SectionContainer({
  title,
  description,
  children,
  sx,
  component = 'section',
  newDesign,
  ...props
}: SectionContainerProps) {
  const titleVariant = newDesign ? 'h6' : 'overline'
  const descriptionVariant = newDesign ? 'body2' : 'caption'

  return (
    <Paper component={component} sx={{ bgcolor: 'white', p: 3, mt: 2, ...sx }} {...props}>
      <Stack spacing={1}>
        {title && (
          <Typography component="h2" variant={titleVariant}>
            {title}
          </Typography>
        )}
        {description && (
          <Typography color="text.secondary" variant={descriptionVariant}>
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
