import React from 'react'
import { Skeleton } from '@mui/material'
import { Box } from '@mui/system'

type StyledSkeletonProps = {
  length?: number
}

export function StyledSkeleton({ length = 6 }: StyledSkeletonProps) {
  return (
    <Box>
      {Array(length)
        .fill(0)
        .map((_, i) => {
          return <Skeleton key={i} height={200} />
        })}
    </Box>
  )
}
