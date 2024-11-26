import { Chip, Skeleton } from '@mui/material'
import React from 'react'

export const ByDelegationChip: React.FC = () => {
  return <Chip label={'TODO in delega'} color={'default'} sx={{ borderRadius: 1 }} />
}

export const ByDelegationChipSkeleton: React.FC = () => {
  return <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={23} width={54} />
}
