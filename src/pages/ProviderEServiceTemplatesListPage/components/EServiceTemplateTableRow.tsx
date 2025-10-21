import React from 'react'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Box, Skeleton, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from '@/router'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { TableRow } from '@pagopa/interop-fe-commons'
import { useQueryClient } from '@tanstack/react-query'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import type { ProducerEServiceTemplate } from '@/api/api.generatedTypes'
import { useGetProviderEServiceTemplateActions } from '@/hooks/useGetProviderEServiceTemplateActions'
import { NotificationBadgeDot } from '@/components/shared/NotificationBadgeDot/NotificationBadgeDot'

type EServiceTemplateTableRow = {
  eserviceTemplate: ProducerEServiceTemplate
}

export const EServiceTemplateTableRow: React.FC<EServiceTemplateTableRow> = ({
  eserviceTemplate,
}) => {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })

  const queryClient = useQueryClient()

  const versionIdEserviceTemplate =
    eserviceTemplate.activeVersion?.id ?? eserviceTemplate.draftVersion?.id
  const versionEserviceTemplate =
    eserviceTemplate.activeVersion?.version ?? eserviceTemplate.draftVersion?.version ?? 1

  const { actions } = useGetProviderEServiceTemplateActions(
    eserviceTemplate.id,
    eserviceTemplate.activeVersion?.id,
    eserviceTemplate.draftVersion?.id,
    eserviceTemplate.activeVersion?.state,
    eserviceTemplate.draftVersion?.state,
    eserviceTemplate.mode
  )

  const handlePrefetch = () => {
    queryClient.prefetchQuery(
      EServiceTemplateQueries.getSingle(eserviceTemplate.id, versionIdEserviceTemplate as string)
    )
  }

  const hasNotActiveVersionTemplate = !eserviceTemplate.activeVersion

  const versionId = hasNotActiveVersionTemplate
    ? eserviceTemplate.draftVersion?.id
    : eserviceTemplate.activeVersion?.id

  const eserviceTemplateCellData = (
    <Stack direction="row" alignItems="center">
      {eserviceTemplate.hasUnreadNotifications && <NotificationBadgeDot />}
      {eserviceTemplate.name}
    </Stack>
  )

  return (
    <TableRow
      cellData={[
        eserviceTemplateCellData,
        versionEserviceTemplate.toString(),
        <Stack key={eserviceTemplate.id} direction="row" spacing={1}>
          {eserviceTemplate.activeVersion && (
            <StatusChip for="eserviceTemplate" state={eserviceTemplate.activeVersion.state} />
          )}
          {eserviceTemplate.draftVersion && (
            <StatusChip for="eserviceTemplate" state={eserviceTemplate.draftVersion.state} />
          )}
        </Stack>,
      ]}
    >
      <Link
        as="button"
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        to={
          hasNotActiveVersionTemplate
            ? 'PROVIDE_ESERVICE_TEMPLATE_SUMMARY'
            : 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
        }
        params={{
          eServiceTemplateId: eserviceTemplate.id ?? '',
          eServiceTemplateVersionId: versionId ?? '',
        }}
      >
        {hasNotActiveVersionTemplate ? t('manageDraft') : t('inspect')}
      </Link>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const EServiceTemplateTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        <Skeleton key={0} width={220} />,
        <Skeleton key={1} width={20} />,
        <StatusChipSkeleton key={2} />,
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
