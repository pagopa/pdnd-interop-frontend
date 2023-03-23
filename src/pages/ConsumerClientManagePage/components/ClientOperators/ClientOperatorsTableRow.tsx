import { ClientMutations, ClientQueries } from '@/api/client'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { useJwt } from '@/hooks/useJwt'
import { RouterLink } from '@/router'
import type { ActionItem } from '@/types/common.types'
import type { SelfCareUser } from '@/types/party.types'
import { Box, Skeleton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import { TableRow } from '@pagopa/interop-fe-commons'

interface ClientOperatorsTableRowProps {
  operator: SelfCareUser
  clientId: string
}

export const ClientOperatorsTableRow: React.FC<ClientOperatorsTableRowProps> = ({
  operator,
  clientId,
}) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('user')
  const { isAdmin } = useJwt()
  const clientKind = useClientKind()
  const { mutate: removeFromClient } = ClientMutations.useRemoveOperator()
  const prefetchOperator = ClientQueries.usePrefetchSingleOperator()

  const actions: Array<ActionItem> = []

  if (isAdmin) {
    actions.push({
      action: removeFromClient.bind(null, { clientId, relationshipId: operator.relationshipId }),
      label: t('actions.removeFromClient'),
    })
  }

  const handlePrefetchOperator = () => {
    prefetchOperator(operator.relationshipId)
  }

  const inspectRouteKey =
    clientKind === 'API'
      ? 'SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT'
      : 'SUBSCRIBE_CLIENT_OPERATOR_EDIT'

  return (
    <TableRow
      cellData={[
        `${operator.name} ${operator.familyName}`,
        <StatusChip key={operator.id} for="user" state={operator.state} />,
      ]}
    >
      <RouterLink
        as="button"
        to={inspectRouteKey}
        params={{ clientId, operatorId: operator.relationshipId }}
        variant="outlined"
        size="small"
        onPointerEnter={handlePrefetchOperator}
        onFocusVisible={handlePrefetchOperator}
      >
        {tCommon('actions.inspect')}
      </RouterLink>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const ClientOperatorsTableRowSkeleton: React.FC = () => {
  return (
    <TableRow cellData={[<Skeleton key={0} width={120} />, <StatusChipSkeleton key={1} />]}>
      <ButtonSkeleton size="small" width={103} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
