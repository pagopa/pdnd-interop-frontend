import { Box, Stack, Typography, TypographyProps, BoxProps } from '@mui/material'
import React from 'react'
import { StyledPaper } from '../StyledPaper'

type StyledSectionProps = {
  children: React.ReactNode
}

function StyledSection({ children }: StyledSectionProps) {
  return (
    <StyledPaper>
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
  ...props
}: StyledSectionProps & TypographyProps) {
  return (
    <Typography color="text.secondary" variant="caption" {...props}>
      {children}
    </Typography>
  )
}

StyledSection.Content = function StyledSectionContent({
  children,
  ...props
}: StyledSectionProps & BoxProps) {
  return <Box {...props}>{children}</Box>
}

export default StyledSection
