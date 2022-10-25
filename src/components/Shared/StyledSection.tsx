import { Box, Stack, Typography, TypographyProps, BoxProps, PaperProps } from '@mui/material'
import React from 'react'
import { StyledPaper } from '../StyledPaper'

type StyledSectionProps = {
  children: React.ReactNode
}

function StyledSection({ children, ...props }: StyledSectionProps & PaperProps) {
  return (
    <StyledPaper {...props}>
      <Stack>{children}</Stack>
    </StyledPaper>
  )
}

StyledSection.Title = function StyledSectionTitle({
  children,
  ...props
}: StyledSectionProps & TypographyProps) {
  return (
    <Typography variant="overline" {...props}>
      {children}
    </Typography>
  )
}

StyledSection.Subtitle = function StyledSectionSubtitle({
  children,
  sx = {},
  ...props
}: StyledSectionProps & TypographyProps) {
  return (
    <Typography color="text.secondary" variant="caption" sx={{ mt: '2px', ...sx }} {...props}>
      {children}
    </Typography>
  )
}

StyledSection.Content = function StyledSectionContent({
  children,
  sx,
  ...props
}: StyledSectionProps & BoxProps) {
  return (
    <Box sx={{ mt: 2, ...sx }} {...props}>
      {children}
    </Box>
  )
}

export default StyledSection
