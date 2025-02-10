import { Chip, Skeleton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

type ByDelegationChipProps = {
  tenantRole?: 'DELEGATOR' | 'DELEGATE'
}

export const ByDelegationChip: React.FC<ByDelegationChipProps> = ({ tenantRole }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'byDelegationChip' })

  const tenantRoleLabel = match(tenantRole)
    .with('DELEGATOR', () => t('label.delegator'))
    .with('DELEGATE', () => t('label.delegate'))
    .with(undefined, () => t('label.default'))
    .exhaustive()

  return <Chip label={tenantRoleLabel} color={'default'} sx={{ borderRadius: 1 }} />
}

export const ByDelegationChipSkeleton: React.FC = () => {
  return <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={23} width={54} />
}
