import { Box, Stack, Typography, TypographyProps, BoxProps, Paper, PaperProps } from '@mui/material'
import React from 'react'

type SectionContainerProps = {
  children: React.ReactNode
}

function SectionContainer({ children, sx, ...props }: PaperProps & SectionContainerProps) {
  return (
    <Paper sx={{ bgcolor: 'white', p: 3, mt: 2, ...sx }} {...props}>
      <Stack>{children}</Stack>
    </Paper>
  )
}

SectionContainer.Title = function SectionContainerTitle({
  children,
  ...props
}: SectionContainerProps & TypographyProps) {
  return (
    <Typography variant="overline" {...props}>
      {children}
    </Typography>
  )
}

SectionContainer.Subtitle = function SectionContainerSubtitle({
  children,
  sx = {},
  ...props
}: SectionContainerProps & TypographyProps) {
  return (
    <Typography color="text.secondary" variant="caption" sx={{ mt: '2px', ...sx }} {...props}>
      {children}
    </Typography>
  )
}

SectionContainer.Content = function SectionContainerContent({
  children,
  sx,
  ...props
}: SectionContainerProps & BoxProps) {
  return (
    <Box sx={{ mt: 2, ...sx }} {...props}>
      {children}
    </Box>
  )
}

export { SectionContainer }
