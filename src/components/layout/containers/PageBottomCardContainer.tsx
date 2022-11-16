import React from 'react'
import { Box, SkeletonProps, Stack, Typography } from '@mui/material'
import { SectionContainer, SectionContainerSkeleton } from './SectionContainer'

type PageBottomActionsCardProps = {
  title: string
  description?: string
  children: React.ReactNode
}

export const PageBottomActionsCardContainer: React.FC<PageBottomActionsCardProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <SectionContainer sx={{ mt: 4 }}>
      <Box>
        <Typography component="h2" variant="h5">
          {title}
        </Typography>
        {description && <Typography color="text.secondary">{description}</Typography>}
      </Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3 }}>
        {children}
      </Stack>
    </SectionContainer>
  )
}

export const PageBottomActionsCardContainerSkeleton: React.FC<SkeletonProps> = (props) => {
  return <SectionContainerSkeleton {...props} />
}
