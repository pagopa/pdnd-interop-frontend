import { Box, Stack } from '@mui/material'
import React from 'react'
import { StyledPaper } from '../StyledPaper'
import { LoadingWithMessage } from './LoadingWithMessage'
import { StyledIntro } from './StyledIntro'

type PageBottomActionsCardProps = {
  title: string
  description?: string
  isLoading?: boolean
  loadingMessage?: string
  children: JSX.Element | JSX.Element[]
}

export function PageBottomActionsCard({
  title,
  description,
  isLoading,
  loadingMessage,
  children,
}: PageBottomActionsCardProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <StyledPaper>
        <StyledIntro component="h2">
          {{
            title,
            description,
          }}
        </StyledIntro>
        {!isLoading ? (
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            {children}
          </Stack>
        ) : (
          <LoadingWithMessage label={loadingMessage} transparentBackground />
        )}
      </StyledPaper>
    </Box>
  )
}

export default PageBottomActionsCard
