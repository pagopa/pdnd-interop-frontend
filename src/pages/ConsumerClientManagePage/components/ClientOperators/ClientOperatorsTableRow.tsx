import { ClientQueries } from '@/api/client'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { Link } from '@/router'
import type { ActionItemButton } from '@/types/common.types'
import { Box, Skeleton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import { TableRow } from '@pagopa/interop-fe-commons'
import type { Operator } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { useDialog } from '@/stores'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

interface ClientOperatorsTableRowProps {
  operator: Operator
  clientId: string
}

export const ClientOperatorsTableRow: React.FC<ClientOperatorsTableRowProps> = ({
  operator,
  clientId,
}) => {
  const { isAdmin, jwt } = AuthHooks.useJwt()
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('user')
  const clientKind = useClientKind()
  const { openDialog } = useDialog()
  const prefetchOperator = ClientQueries.usePrefetchSingleOperator()

  const handleOpenDeleteDialog = () => {
    if (!jwt?.selfcareId) return

    openDialog({
      type: 'deleteOperator',
      selfcareId: jwt.selfcareId,
      userId: operator.relationshipId,
    })
  }

  const handleOpenRemoveOperatorFromClientDialog = () => {
    openDialog({
      type: 'removeOperatorFromClient',
      clientId: clientId,
      relationshipId: operator.relationshipId,
    })
  }

  const actions: Array<ActionItemButton> = [
    {
      action: handleOpenRemoveOperatorFromClientDialog,
      label: t('actions.removeFromClient.label'),
      color: 'error',
      icon: RemoveCircleOutlineIcon,
      disabled: !isAdmin,
      tooltip: !isAdmin ? t('actions.removeFromClient.tooltip') : undefined,
    },
    {
      action: handleOpenDeleteDialog,
      label: t('actions.delete.label'),
      color: 'error',
      icon: DeleteOutlineIcon,
      disabled: !isAdmin,
      tooltip: !isAdmin ? t('actions.delete.tooltip') : undefined,
    },
  ]

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
        <ActionMenu actions={actions} />
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
