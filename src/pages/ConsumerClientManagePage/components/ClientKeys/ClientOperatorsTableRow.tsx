import { ClientMutations } from '@/api/client'
import { ActionMenu } from '@/components/shared/ActionMenu'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { TableRow } from '@/components/shared/Table'
import { useJwt } from '@/hooks/useJwt'
import { RouterLink } from '@/router'
import { ActionItem } from '@/types/common.types'
import { SelfCareUser } from '@/types/party.types'
import { Box, Skeleton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'

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

  const actions: Array<ActionItem> = []

  if (isAdmin) {
    actions.push({
      action: removeFromClient.bind(null, { clientId, relationshipId: operator.relationshipId }),
      label: t('actions.removeFromClient'),
    })
  }

  const instectRouteKey =
    clientKind === 'API'
      ? 'SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT'
      : 'SUBSCRIBE_CLIENT_OPERATOR_EDIT'

  return (
    <TableRow
      cellData={[
        { label: `${operator.name} ${operator.familyName}` },
        { custom: <StatusChip for="user" state={operator.state} /> },
      ]}
    >
      <RouterLink
        as="button"
        to={instectRouteKey}
        params={{ clientId, operatorId: operator.relationshipId }}
        variant="outlined"
        size="small"
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
    <TableRow cellData={[{ label: <Skeleton width={120} /> }, { custom: <StatusChipSkeleton /> }]}>
      <Box component="span" sx={{ ml: 2, display: 'inline-block', p: 2 }}>
        <Skeleton variant="rectangular" width={4} />
      </Box>
    </TableRow>
  )
}
