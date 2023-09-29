import { PartyQueries } from '@/api/party/party.hooks'
import { Button, Stack, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ClientOperatorsTable, ClientOperatorsTableSkeleton } from './ClientOperatorsTable'
import { AuthHooks } from '@/api/auth'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { useDrawerState } from '@/hooks/useDrawerState'
import { AddOperatorsToClientDrawer } from '@/components/shared/AddOperatorsToClientDrawer'
import { ClientMutations, ClientQueries } from '@/api/client'
import type { RelationshipInfo } from '@/api/api.generatedTypes'

interface ClientOperatorsProps {
  clientId: string
}

export const ClientOperators: React.FC<ClientOperatorsProps> = ({ clientId }) => {
  const { t } = useTranslation('user')
  const { t: tCommon } = useTranslation('common')
  const { jwt, isAdmin } = AuthHooks.useJwt()
  const prefetchUserList = PartyQueries.usePrefetchUsersList()

  const { isOpen, closeDrawer, openDrawer } = useDrawerState()

  const { mutateAsync: addOperator } = ClientMutations.useAddOperator()
  const { data: currentOperators = [] } = ClientQueries.useGetOperatorsList(clientId, {
    suspense: false,
  })

  const handleSubmit = async (operators: Array<RelationshipInfo>) => {
    await Promise.all(operators.map(({ id }) => addOperator({ clientId, relationshipId: id })))
    closeDrawer()
  }

  const excludeOperatorsIdsList = currentOperators.map(({ relationshipId }) => relationshipId)

  const canAddOperator = isAdmin

  const handlePrefetchUserList = () => {
    if (!canAddOperator) return
    prefetchUserList({
      productRoles: ['admin', 'security'],
      states: ['ACTIVE'],
      tenantId: jwt?.organizationId as string,
    })
  }

  const handleOpenAddOperatorDialog = () => {
    if (!canAddOperator) return
    openDrawer()
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
              onClick={handleOpenAddOperatorDialog}
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
