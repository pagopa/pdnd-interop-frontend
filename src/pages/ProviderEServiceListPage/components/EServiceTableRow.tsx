import React from 'react'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Box, Skeleton, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from '@/router'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { EServiceQueries } from '@/api/eservice'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { useGetProviderEServiceActions } from '@/hooks/useGetProviderEServiceActions'
import { TableRow } from '@pagopa/interop-fe-commons'
import type { EServiceDescriptorState, ProducerEService } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { useQueryClient } from '@tanstack/react-query'
import { ByDelegationChip } from '@/components/shared/ByDelegationChip'

type EServiceTableRow = {
  eservice: ProducerEService
}

export const EServiceTableRow: React.FC<EServiceTableRow> = ({ eservice }) => {
  const { t } = useTranslation('common')
  const { isAdmin, isOperatorAPI, jwt } = AuthHooks.useJwt()

  const queryClient = useQueryClient()

  const isDelegate = Boolean(
    eservice.delegation && eservice.delegation?.delegate.id === jwt?.organizationId
  )
  const isDelegator = Boolean(
    eservice.delegation && eservice.delegation?.delegator.id === jwt?.organizationId
  )

  const { actions } = useGetProviderEServiceActions(
    eservice.id,
    eservice.activeDescriptor?.state,
    eservice.draftDescriptor?.state,
    eservice.activeDescriptor?.id,
    eservice.draftDescriptor?.id,
    eservice.mode,
    eservice.name,
    eservice.isNewTemplateVersionAvailable ?? false,
    eservice.isTemplateInstance,
    eservice.delegation
  )

  const hasActiveDescriptor = eservice.activeDescriptor
  const isEServiceEditable = (isAdmin || isOperatorAPI) && !hasActiveDescriptor

  const isEServiceByDelegation = isDelegate || isDelegator

  const handlePrefetch = () => {
    if (isEServiceEditable) {
      queryClient.prefetchQuery(EServiceQueries.getSingle(eservice.id))
      return
    }
    if (!eservice.activeDescriptor) return
    queryClient.prefetchQuery(
      EServiceQueries.getDescriptorProvider(eservice.id, eservice.activeDescriptor.id)
    )
  }

  return (
    <TableRow
      cellData={[
        isEServiceByDelegation ? (
          <Stack direction="row" spacing={1}>
            <Typography variant="body2">{eservice.name}</Typography>
            <ByDelegationChip tenantRole={isDelegator ? 'DELEGATOR' : 'DELEGATE'} />
          </Stack>
        ) : (
          eservice.name
        ),
        eservice?.activeDescriptor?.version || '1',
        <Stack key={eservice?.id} direction="row" spacing={1}>
          {eservice?.activeDescriptor && (
            <StatusChip for="eservice" state={eservice.activeDescriptor.state} />
          )}
          {(!hasActiveDescriptor || eservice?.draftDescriptor) && (
            <StatusChip
              for="eservice"
              state={eservice.draftDescriptor?.state as EServiceDescriptorState}
              isDraftToCorrect={eservice.draftDescriptor?.requireCorrections}
            />
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
