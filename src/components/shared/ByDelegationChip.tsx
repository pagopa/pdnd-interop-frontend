import { Chip, Skeleton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ByDelegationChip: React.FC = () => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'byDelegationChip' })

  return <Chip label={t('label')} color={'default'} sx={{ borderRadius: 1 }} />
}

export const ByDelegationChipSkeleton: React.FC = () => {
  return <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={23} width={54} />
}
