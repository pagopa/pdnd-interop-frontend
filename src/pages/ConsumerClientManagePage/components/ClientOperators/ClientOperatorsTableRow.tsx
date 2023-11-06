import { ClientQueries } from '@/api/client'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { Link } from '@/router'
import { Box, Skeleton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import { TableRow } from '@pagopa/interop-fe-commons'
import type { Operator } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { useGetClientOperatorsActions } from '@/hooks/useGetClientOperatorsActions'

interface ClientOperatorsTableRowProps {
  operator: Operator
  clientId: string
}

export const ClientOperatorsTableRow: React.FC<ClientOperatorsTableRowProps> = ({
  operator,
  clientId,
}) => {
  const { isAdmin } = AuthHooks.useJwt()
  const { t: tCommon } = useTranslation('common')
  const clientKind = useClientKind()
  const prefetchOperator = ClientQueries.usePrefetchSingleOperator()

  const { actions } = useGetClientOperatorsActions(operator.relationshipId, clientId)

  const handlePrefetchOperator = () => {
    prefetchOperator(operator.relationshipId)
  }

  const inspectRouteKey =
    clientKind === 'API'
      ? 'SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT'
      : 'SUBSCRIBE_CLIENT_OPERATOR_EDIT'

  return (
    <TableRow cellData={[`${operator.name} ${operator.familyName}`]}>
      <Link
        as="button"
        to={inspectRouteKey}
        params={{ clientId, operatorId: operator.relationshipId }}
        variant="outlined"
        size="small"
        onPointerEnter={handlePrefetchOperator}
        onFocusVisible={handlePrefetchOperator}
      >
        {tCommon('actions.inspect')}
      </Link>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={isAdmin ? actions : []} />
      </Box>
    </TableRow>
  )
}

export const ClientOperatorsTableRowSkeleton: React.FC = () => {
  return (
    <TableRow cellData={[<Skeleton key={0} width={120} />]}>
      <ButtonSkeleton size="small" width={103} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
