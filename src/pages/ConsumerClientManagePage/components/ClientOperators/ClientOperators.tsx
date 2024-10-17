import { Button, Stack, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ClientOperatorsTable, ClientOperatorsTableSkeleton } from './ClientOperatorsTable'
import { AuthHooks } from '@/api/auth'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { useDrawerState } from '@/hooks/useDrawerState'
import { ClientMutations, ClientQueries } from '@/api/client'
import type { Users } from '@/api/api.generatedTypes'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TenantQueries } from '@/api/tenant'
import { AddOperatorsToClientDrawer } from '@/components/shared/AddOperatorsToClientDrawer'

interface ClientOperatorsProps {
  clientId: string
}

export const ClientOperators: React.FC<ClientOperatorsProps> = ({ clientId }) => {
  const { t } = useTranslation('user')
  const { t: tCommon } = useTranslation('common')
  const { jwt, isAdmin } = AuthHooks.useJwt()
  const queryClient = useQueryClient()

  const { isOpen, closeDrawer, openDrawer } = useDrawerState()

  const { mutateAsync: addOperators } = ClientMutations.useAddOperators()

  const { data: currentOperators = [] } = useQuery(ClientQueries.getOperatorsList(clientId))

  const handleSubmit = async (operators: Users) => {
    addOperators({ clientId, userIds: operators.map(({ userId }) => userId) })
    closeDrawer()
  }

  const excludeOperatorsIdsList = currentOperators.map(({ userId }) => userId)

  const canAddOperator = isAdmin

  const handlePrefetchUserList = () => {
    if (!canAddOperator) return
    queryClient.prefetchQuery(
      TenantQueries.getPartyUsersList({
        roles: ['admin', 'security'],
        tenantId: jwt?.organizationId as string,
      })
    )
  }

  return (
    <>
      <Stack sx={{ mb: 2 }} alignItems="end">
        <Tooltip
          open={!canAddOperator ? undefined : false}
          title={t('actionReservedToAdminTooltip')}
        >
          <span>
            <Button
              disabled={!canAddOperator}
              variant="contained"
              size="small"
              onClick={openDrawer}
              onPointerEnter={handlePrefetchUserList}
              onFocusVisible={handlePrefetchUserList}
              startIcon={<PlusOneIcon />}
            >
              {tCommon('addBtn')}
            </Button>
          </span>
        </Tooltip>
      </Stack>
      <React.Suspense fallback={<ClientOperatorsTableSkeleton />}>
        <ClientOperatorsTable clientId={clientId} />
      </React.Suspense>
      {canAddOperator && (
        <AddOperatorsToClientDrawer
          onSubmit={handleSubmit}
          excludeOperatorsIdsList={excludeOperatorsIdsList}
          isOpen={isOpen}
          onClose={closeDrawer}
        />
      )}
    </>
  )
}
