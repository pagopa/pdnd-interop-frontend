import React from 'react'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Box, Skeleton, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from '@/router'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { TableRow } from '@pagopa/interop-fe-commons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TemplateQueries } from '@/api/template'
import type { ProducerEServiceTemplate } from '@/api/api.generatedTypes'
import { useGetProviderEServiceTemplateActions } from '@/hooks/useGetProviderEServiceTemplateActions'

type TemplateTableRow = {
  template: ProducerEServiceTemplate
}

export const TemplateTableRow: React.FC<TemplateTableRow> = ({ template }) => {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })

  const queryClient = useQueryClient()

  const versionEserviceTemplate = template.activeVersion?.id ?? template.draftVersion?.id

  const { data: eserviceTemplate } = useQuery(
    TemplateQueries.getSingle(template.id, versionEserviceTemplate as string)
  )

  const { actions } = useGetProviderEServiceTemplateActions(
    eserviceTemplate?.eserviceTemplate.id as string,
    eserviceTemplate?.id as string,
    eserviceTemplate?.eserviceTemplate.mode,
    template.activeVersion?.state,
    template.draftVersion?.state
  )

  const handlePrefetch = () => {
    queryClient.prefetchQuery(
      TemplateQueries.getSingle(template.id, versionEserviceTemplate as string)
    )
  }

  const isTemplateDraft = eserviceTemplate?.state === 'DRAFT'

  return (
    <TableRow
      cellData={[
        template.name,
        eserviceTemplate?.version.toString() || '1',
        <Stack key={template.id} direction="row" spacing={1}>
          {template.activeVersion && (
            <StatusChip for="template" state={template.activeVersion.state} />
          )}
          {template.draftVersion && (
            <StatusChip for="template" state={template.draftVersion.state} />
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
        to={'NOT_FOUND'} // TODO: To change with below
        // to={
        //   isTemplateDraft
        //     ? 'PROVIDE_ESERVICE_TEMPLATE_SUMMARY'
        //     : 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
        // }
        // params={{
        //   eServiceTemplateId: eserviceTemplate?.id ?? '',
        //   eServiceTemplateVersionId: eserviceTemplate?.eserviceTemplate.id ?? '',
        // }}
      >
        {isTemplateDraft ? t('manageDraft') : t('inspect')}
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
