import { Box, Typography, Paper, Skeleton, Stack } from '@mui/material'
import type { PaperProps, SkeletonProps } from '@mui/material'
import React from 'react'

type TypographyProps = Omit<React.ComponentProps<typeof Typography>, 'ref'> & {
  component?: React.ElementType
}

interface SectionContainerProps extends PaperProps {
  title?: string
  description?: React.ReactNode
  children: React.ReactNode
  component?: React.ElementType
  titleTypographyProps?: TypographyProps
  descriptionTypographyProps?: TypographyProps

  innerSection?: boolean

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
  innerSection,
  sx,
  component = 'section',
  titleTypographyProps,
  descriptionTypographyProps,
  newDesign,
  ...props
}: SectionContainerProps) {
  const titleVariant = !newDesign ? 'overline' : innerSection ? 'sidenav' : 'h6'
  const descriptionVariant = newDesign ? 'body2' : 'caption'

  return (
    <Paper
      component={component}
      sx={{ bgcolor: 'white', p: !innerSection ? 3 : 0, mt: 2, borderRadius: 2, ...sx }}
      {...props}
    >
      <Stack spacing={1}>
        {title && (
          <Typography
            component={innerSection ? 'h3' : 'h2'}
            variant={titleVariant}
            {...titleTypographyProps}
          >
            {title}
          </Typography>
        )}
        {description && (
          <Typography
            color="text.secondary"
            variant={descriptionVariant}
            {...descriptionTypographyProps}
          >
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
