import React from 'react'
import { Stack, Tooltip } from '@mui/material'
import ArchiveIcon from '@mui/icons-material/Archive'
import { useTranslation } from 'react-i18next'
import type { EServiceDescriptorState } from '@/api/api.generatedTypes'
import type { CompactDescriptorWithArchivingSchedule } from '@/types/eservice.types'
import type { RouteKey } from '@/router'
import { Link } from '@/router'
import { StatusChip } from '@/components/shared/StatusChip'
import { formatDateString } from '@/utils/format.utils'

export const ROW_HEIGHT = 56

const mapToChipState = (
  state: CompactDescriptorWithArchivingSchedule['state'],
  isLatest: boolean
): EServiceDescriptorState => {
  if (state === 'ARCHIVING') return isLatest ? 'PUBLISHED' : 'DEPRECATED'
  if (state === 'ARCHIVING_SUSPENDED') return 'SUSPENDED'
  return state
}

type EserviceVersionRowProps = {
  descriptor: CompactDescriptorWithArchivingSchedule
  isLatest: boolean
  eserviceId: string
  routeKey: Extract<RouteKey, 'SUBSCRIBE_CATALOG_VIEW' | 'PROVIDE_ESERVICE_MANAGE'>
  onNavigate: () => void
}

export const EserviceVersionRow: React.FC<EserviceVersionRowProps> = ({
  descriptor,
  isLatest,
  eserviceId,
  routeKey,
  onNavigate,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.versionListModal' })

  const chipState = mapToChipState(descriptor.state, isLatest)
  const archivingSchedule =
    descriptor.state === 'ARCHIVING' || descriptor.state === 'ARCHIVING_SUSPENDED'
      ? descriptor.archivingSchedule
      : undefined
  const tooltipKey =
    archivingSchedule?.scope === 'EService'
      ? 'scheduledArchivalTooltipEservice'
      : 'scheduledArchivalTooltipDescriptor'

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
        <StatusChip for="eservice" state={chipState} size="small" />
        {archivingSchedule && (
          <Tooltip
            title={t(tooltipKey, {
              date: formatDateString(archivingSchedule.archivableOn),
            })}
            arrow
          >
            <ArchiveIcon color="primary" fontSize="small" />
          </Tooltip>
        )}
      </Stack>
    </Stack>
  )
}
