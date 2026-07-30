import type { DelegationWithCompactTenants } from '@/api/api.generatedTypes'
import { Chip, Skeleton, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

type ByDelegationChipProps = {
  tenantRole?: 'DELEGATOR' | 'DELEGATE'
  delegation?: DelegationWithCompactTenants
}

export const ByDelegationChip: React.FC<ByDelegationChipProps> = ({ tenantRole, delegation }) => {
  const { t: tChip } = useTranslation('shared-components', { keyPrefix: 'byDelegationChip' })
  const { t: tTooltip } = useTranslation('shared-components', { keyPrefix: 'delegationTooltip' })

  const tenantRoleLabel = match(tenantRole)
    .with('DELEGATOR', () => tChip('label.delegator'))
    .with('DELEGATE', () => tChip('label.delegate'))
    .with(undefined, () => tChip('label.default'))
    .exhaustive()

  const tooltipLabel = match(tenantRole)
    .with('DELEGATOR', () =>
      tTooltip('label.delegator', { delegate: delegation?.delegate.name ?? '' })
    )
    .with('DELEGATE', () =>
      tTooltip('label.delegate', { delegator: delegation?.delegator.name ?? '' })
    )
    .with(undefined, () => tTooltip('label.default'))
    .exhaustive()

  return (
    <Tooltip title={tooltipLabel} arrow>
      <Chip label={tenantRoleLabel} color={'info'} sx={{ borderRadius: 1, ml: 1 }} />
    </Tooltip>
  )
}

export const ByDelegationChipSkeleton: React.FC = () => {
  return <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={23} width={54} />
}
