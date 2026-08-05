import type { DelegationWithCompactTenants } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { Chip, Skeleton, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

type ByDelegationChipProps = {
  delegation?: DelegationWithCompactTenants
}

export const ByDelegationChip: React.FC<ByDelegationChipProps> = ({ delegation }) => {
  const { t: tChip } = useTranslation('shared-components', { keyPrefix: 'byDelegationChip' })
  const { t: tTooltip } = useTranslation('shared-components', { keyPrefix: 'delegationTooltip' })
  const { jwt } = AuthHooks.useJwt()

  const tenantRole = delegation
    ? delegation.delegator.id === jwt?.organizationId
      ? 'DELEGATOR'
      : delegation.delegate.id === jwt?.organizationId
        ? 'DELEGATE'
        : undefined
    : undefined

  const tenantRoleLabel = match(tenantRole)
    .with('DELEGATOR', () => tChip('label.delegator'))
    .with('DELEGATE', () => tChip('label.delegate'))
    .with(undefined, () => tChip('label.default'))
    .exhaustive()

  const tooltipLabel = delegation
    ? match(tenantRole)
        .with('DELEGATOR', () =>
          tTooltip('label.delegator', { delegate: delegation.delegate.name })
        )
        .with('DELEGATE', () =>
          tTooltip('label.delegate', { delegator: delegation.delegator.name })
        )
        .with(undefined, () => tTooltip('label.default'))
        .exhaustive()
    : undefined

  const chip = <Chip label={tenantRoleLabel} color={'info'} sx={{ borderRadius: 1, ml: 1 }} />

  return tooltipLabel ? (
    <Tooltip title={tooltipLabel} arrow>
      {chip}
    </Tooltip>
  ) : (
    chip
  )
}

export const ByDelegationChipSkeleton: React.FC = () => {
  return <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={23} width={54} />
}
