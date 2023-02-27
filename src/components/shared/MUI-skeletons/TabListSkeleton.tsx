import { Skeleton } from '@mui/material'
import React from 'react'

export const TabListSkeleton: React.FC = () => {
  return <Skeleton sx={{ mb: 2 }} variant="rectangular" height={48} />
}
