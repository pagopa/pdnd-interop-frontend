import { type DelegationWithCompactTenants } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { AltRoute } from '@mui/icons-material'
import { Stack, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type DelegationTooltipProps = {
  delegation: DelegationWithCompactTenants
}

export const DelegationTooltip: React.FC<DelegationTooltipProps> = ({ delegation }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'delegationTooltip' })
  const { jwt } = AuthHooks.useJwt()

  const isDelegator = Boolean(delegation.delegator.id === jwt?.organizationId)
  const delegator = delegation.delegator.name
  const delegate = delegation.delegate.name

  const label = isDelegator
    ? t('label.delegator', { delegate })
    : t('label.delegate', { delegator })

  return (
    <Tooltip title={label}>
      <Stack component={'span'} tabIndex={0} aria-label={label}>
        <AltRoute
          color="primary"
          sx={{
            rotate: '90deg',
            height: 18,
            width: 18,
          }}
        />
      </Stack>
    </Tooltip>
  )
}
