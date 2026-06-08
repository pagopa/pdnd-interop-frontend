import React from 'react'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { CompactDescriptor } from '@/api/api.generatedTypes'
import type { RouteKey } from '@/router'
import { Link } from '@/router'
import { StatusChip } from '@/components/shared/StatusChip'
import { ArchivingScheduleBadge } from '@/components/shared/ArchivingScheduleBadge'
import { isDescriptorBeingArchived } from '@/utils/eservice.utils'

export const ROW_HEIGHT = 56

type EserviceVersionRowProps = {
  descriptor: CompactDescriptor
  activeDescriptor?: CompactDescriptor
  eserviceId: string
  routeKey: Extract<RouteKey, 'SUBSCRIBE_CATALOG_VIEW' | 'PROVIDE_ESERVICE_MANAGE'>
  onNavigate: () => void
}

export const EserviceVersionRow: React.FC<EserviceVersionRowProps> = ({
  descriptor,
  activeDescriptor,
  eserviceId,
  routeKey,
  onNavigate,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.versionListModal' })

  const isActiveDescriptor = descriptor.id === activeDescriptor?.id
  const archivableOn = descriptor.archivableOn

  const isEserviceScope =
    archivableOn != null &&
    activeDescriptor?.archivableOn != null &&
    archivableOn === activeDescriptor.archivableOn

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ minHeight: ROW_HEIGHT, py: 1 }}
    >
      <Link
        to={routeKey}
        params={{ eserviceId, descriptorId: descriptor.id }}
        onClick={onNavigate}
        underline="hover"
      >
        {t('versionRowLabel', { version: descriptor.version })}
      </Link>
      <Stack direction="row" alignItems="center" spacing={1}>
        <StatusChip
          for="descriptor"
          state={descriptor.state}
          isActiveDescriptor={isActiveDescriptor}
          size="small"
        />
        {archivableOn && isDescriptorBeingArchived(descriptor.state) && (
          <ArchivingScheduleBadge
            archivableOn={archivableOn}
            scope={isEserviceScope ? 'ESERVICE' : 'DESCRIPTOR'}
          />
        )}
      </Stack>
    </Stack>
  )
}
