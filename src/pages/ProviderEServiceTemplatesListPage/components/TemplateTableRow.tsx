import React from 'react'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Box, Skeleton, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from '@/router'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
//import { TemplateQueries } from '@/api/template'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
//import { useGetProviderTemplateActions } from '@/hooks/useGetProviderTemplateActions'
import { TableRow } from '@pagopa/interop-fe-commons'
import { AuthHooks } from '@/api/auth'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TemplateQueries } from '@/api/template'
import { ProducerEServiceTemplate } from '@/api/api.generatedTypes'
import { useGetProviderEServiceTemplateActions } from '@/hooks/useGetProviderEServiceTemplateActions'

type TemplateTableRow = {
  template: ProducerEServiceTemplate
}

export const TemplateTableRow: React.FC<TemplateTableRow> = ({ template }) => {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { isAdmin, isOperatorAPI, jwt } = AuthHooks.useJwt()

  const queryClient = useQueryClient()

  const versionEserviceTemplate = template.activeVersion?.id ?? template.draftVersion?.id

  const { data: eserviceTemplate } = useQuery(
    TemplateQueries.getSingle(template.id, versionEserviceTemplate as string)
  )

  const { actions } = useGetProviderEServiceTemplateActions(
    eserviceTemplate?.eserviceTemplate.id as string, //TODO
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

  const isTemplateDraft = template.activeVersion?.state === 'DRAFT' ? true : false

  return (
    <TableRow
      cellData={[
        template.name,
        template.activeVersion?.version.toString() || '1', //TODO
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
        to={isTemplateDraft ? 'NOT_FOUND' : 'NOT_FOUND'} //TODO SUMMARY TEMPLATE : DETTAGLIO TEMPLATE CON I RELATIVI PARAMS
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
