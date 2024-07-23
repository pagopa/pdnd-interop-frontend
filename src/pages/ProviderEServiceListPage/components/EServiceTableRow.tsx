import React from 'react'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Box, Skeleton, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from '@/router'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { EServiceQueries } from '@/api/eservice'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { useGetProviderEServiceActions } from '@/hooks/useGetProviderEServiceActions'
import { TableRow } from '@pagopa/interop-fe-commons'
import type { ProducerEService } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'

type EServiceTableRow = {
  eservice: ProducerEService
}

export const EServiceTableRow: React.FC<EServiceTableRow> = ({ eservice }) => {
  const { t } = useTranslation('common')
  const { isAdmin, isOperatorAPI } = AuthHooks.useJwt()

  const prefetchDescriptor = EServiceQueries.usePrefetchDescriptorProvider()
  const prefetchEService = EServiceQueries.usePrefetchSingle()

  const { actions } = useGetProviderEServiceActions(
    eservice.id,
    eservice.activeDescriptor?.state,
    eservice.activeDescriptor?.id,
    eservice.draftDescriptor?.id,
    eservice.mode
  )

  const isEServiceInDraft = !eservice.activeDescriptor
  const isEServiceEditable = (isAdmin || isOperatorAPI) && isEServiceInDraft

  const handlePrefetch = () => {
    if (isEServiceEditable) {
      prefetchEService(eservice.id)
      return
    }
    if (!eservice.activeDescriptor) return
    prefetchDescriptor(eservice.id, eservice.activeDescriptor.id)
  }

  return (
    <TableRow
      cellData={[
        eservice.name,
        eservice?.activeDescriptor?.version || '1',
        <Stack key={eservice?.id} direction="row" spacing={1}>
          {eservice?.activeDescriptor && (
            <StatusChip for="eservice" state={eservice.activeDescriptor.state} />
          )}
          {(isEServiceInDraft || eservice?.draftDescriptor) && (
            <StatusChip for="eservice" state={'DRAFT'} />
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
        to={isEServiceEditable ? 'PROVIDE_ESERVICE_SUMMARY' : 'PROVIDE_ESERVICE_MANAGE'}
        params={{
          eserviceId: eservice.id,
          descriptorId: eservice?.activeDescriptor?.id || eservice?.draftDescriptor?.id || '',
        }}
      >
        {t(`actions.${isEServiceEditable ? 'manageDraft' : 'inspect'}`)}
      </Link>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const EServiceTableRowSkeleton: React.FC = () => {
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
