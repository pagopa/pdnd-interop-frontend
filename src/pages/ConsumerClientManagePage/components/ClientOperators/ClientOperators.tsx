import { ClientMutations, ClientQueries } from '@/api/client'
import { PartyQueries } from '@/api/party/party.hooks'
import { useDialog } from '@/stores'
import { useJwt } from '@/hooks/useJwt'
import type { SelfCareUser } from '@/types/party.types'
import { Button, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ClientOperatorsTable, ClientOperatorsTableSkeleton } from './ClientOperatorsTable'

interface ClientOperatorsProps {
  clientId: string
}

export const ClientOperators: React.FC<ClientOperatorsProps> = ({ clientId }) => {
  const { openDialog } = useDialog()
  const { t } = useTranslation('common')
  const { jwt } = useJwt()
  const prefetchUserList = PartyQueries.usePrefetchUsersList()
  const { mutateAsync: addOperator } = ClientMutations.useAddOperator()

  const handlePrefetchUserList = () => {
    prefetchUserList(jwt?.organizationId, {
      productRoles: ['admin', 'security'],
      states: ['ACTIVE'],
    })
  }

  const handleAddOperators = (operators: Array<SelfCareUser>) => {
    Promise.all(operators.map(({ id }) => addOperator({ clientId, relationshipId: id })))
  }

  const { data: currentOperators = [] } = ClientQueries.useGetOperatorsList(clientId, undefined, {
    suspense: false,
  })

  const handleOpenAddOperatorDialog = () => {
    openDialog({
      type: 'addSecurityOperator',
      onSubmit: handleAddOperators,
      excludeOperatorsIdsList: currentOperators.map(({ relationshipId }) => relationshipId),
    })
  }

  return (
    <>
      <Stack sx={{ mb: 2 }} alignItems="end">
        <Button
          variant="contained"
          size="small"
          onClick={handleOpenAddOperatorDialog}
          onPointerEnter={handlePrefetchUserList}
          onFocusVisible={handlePrefetchUserList}
        >
          {t('addBtn')}
        </Button>
      </Stack>
      <React.Suspense fallback={<ClientOperatorsTableSkeleton />}>
        <ClientOperatorsTable clientId={clientId} />
      </React.Suspense>
    </>
  )
}
