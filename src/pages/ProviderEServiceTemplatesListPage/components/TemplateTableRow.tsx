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
import { useQueryClient } from '@tanstack/react-query'
import { TemplateQueries } from '@/api/template'
import { ProducerEServiceTemplate } from '@/api/api.generatedTypes'

type TemplateTableRow = {
  template: ProducerEServiceTemplate
}

export const TemplateTableRow: React.FC<TemplateTableRow> = ({ template }) => {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { isAdmin, isOperatorAPI, jwt } = AuthHooks.useJwt()

  const queryClient = useQueryClient()

  //const { actions } = []

  const handlePrefetch = () => {
    queryClient.prefetchQuery(TemplateQueries.getSingle(template.id))
  }

  const isTemplateDraft = template.activeVersion?.state === 'DRAFT'

  return (
    <TableRow
      cellData={[
        template.name,
        template.activeVersion?.version || '1',
        <Stack key={template.id} direction="row" spacing={1}>
          {template.activeVersion && (
            <StatusChip for="template" state={template.activeVersion.state} />
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
        <ActionMenu actions={['']} />
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
