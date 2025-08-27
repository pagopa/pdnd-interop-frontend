import React from 'react'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Box, Skeleton, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from '@/router'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { TableRow } from '@pagopa/interop-fe-commons'
import { useQueryClient } from '@tanstack/react-query'
import { TemplateQueries } from '@/api/template'
import type { ProducerEServiceTemplate } from '@/api/api.generatedTypes'
import { useGetProviderEServiceTemplateActions } from '@/hooks/useGetProviderEServiceTemplateActions'

type TemplateTableRow = {
  template: ProducerEServiceTemplate
}

export const TemplateTableRow: React.FC<TemplateTableRow> = ({ template }) => {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })

  const queryClient = useQueryClient()

  const versionIdEserviceTemplate = template.activeVersion?.id ?? template.draftVersion?.id
  const versionEserviceTemplate =
    template.activeVersion?.version ?? template.draftVersion?.version ?? 1

  const { actions } = useGetProviderEServiceTemplateActions(
    template.id,
    template.activeVersion?.id,
    template.draftVersion?.id,
    template.activeVersion?.state,
    template.draftVersion?.state,
    template.mode
  )

  const handlePrefetch = () => {
    queryClient.prefetchQuery(
      TemplateQueries.getSingle(template.id, versionIdEserviceTemplate as string)
    )
  }

  const hasNotActiveVersionTemplate = !template.activeVersion

  const versionId = hasNotActiveVersionTemplate
    ? template.draftVersion?.id
    : template.activeVersion?.id

  return (
    <TableRow
      cellData={[
        template.name,
        versionEserviceTemplate.toString(),
        <Stack key={template.id} direction="row" spacing={1}>
          {template.activeVersion && (
            <StatusChip for="eserviceTemplate" state={template.activeVersion.state} />
          )}
          {template.draftVersion && (
            <StatusChip for="eserviceTemplate" state={template.draftVersion.state} />
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
          eServiceTemplateId: template.id ?? '',
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

export const TemplateTableRowSkeleton: React.FC = () => {
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
