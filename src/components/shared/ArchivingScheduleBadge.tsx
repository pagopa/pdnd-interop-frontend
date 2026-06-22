import React from 'react'
import { Tooltip } from '@mui/material'
import ArchiveIcon from '@mui/icons-material/Archive'
import { useTranslation } from 'react-i18next'
import type { ArchivingScope } from '@/api/api.generatedTypes'
import { formatDateStringNumeric } from '@/utils/format.utils'

type ArchivingScheduleBadgeProps = {
  archivableOn: string
  scope: ArchivingScope
}

export const ArchivingScheduleBadge: React.FC<ArchivingScheduleBadgeProps> = ({
  archivableOn,
  scope,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.scheduledArchivalTooltip' })
  return (
    <Tooltip
      arrow
      title={t(scope === 'ESERVICE' ? 'eservice' : 'descriptor', {
        date: formatDateStringNumeric(archivableOn),
      })}
    >
      <ArchiveIcon color="primary" fontSize="small" />
    </Tooltip>
  )
}
