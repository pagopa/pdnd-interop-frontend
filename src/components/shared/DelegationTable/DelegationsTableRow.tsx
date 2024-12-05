import type { CompactDelegation } from '@/api/api.generatedTypes'
import { DelegationQueries } from '@/api/delegation'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Link } from '@/router'
import { Box, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'
import { useGetDelegationActions } from '@/hooks/useGetDelegationActions'
import type { DelegationType } from '@/types/party.types'

type DelegationsTableRowProps = {
  delegation: CompactDelegation
  delegationType: DelegationType
}

export const DelegationsTableRow: React.FC<DelegationsTableRowProps> = ({
  delegation,
  delegationType,
}) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('party', { keyPrefix: 'delegations.list' })
  const queryClient = useQueryClient()

  const { actions } = useGetDelegationActions(delegation)

  const handlePrefetch = () => {
    queryClient.prefetchQuery(DelegationQueries.getSingle({ delegationId: delegation.id }))
  }

  const delegationKindLabel = match(delegation.kind)
    .with('DELEGATED_PRODUCER', () => t('delegationKind.producer'))
    .with('DELEGATED_CONSUMER', () => t('delegationKind.consumer'))
    .exhaustive()

  const delegateOrDelegatorCellData = match(delegationType)
    .with('DELEGATION_RECEIVED', () => delegation.delegator.name)
    .with('DELEGATION_GRANTED', () => delegation.delegate.name)
    .exhaustive()

  return (
    <TableRow
      cellData={[
        delegation.eserviceName,
        delegationKindLabel,
        delegateOrDelegatorCellData,
        <StatusChip key={delegation.id} for="delegation" state={delegation.state} />,
      ]}
    >
      <Link
        as="button"
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        to="DELEGATIONS" //TODO rimettere "DELEGATION_DETAILS" e decommentare params
        //params={{ delegationId: delegation.id }}
      >
        {tCommon('actions.inspect')}
      </Link>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const DelegationsTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        <Skeleton key={0} width={195} />,
        <Skeleton key={1} width={163} />,
        <Skeleton key={2} width={248} />,
        <StatusChipSkeleton key={3} />,
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
