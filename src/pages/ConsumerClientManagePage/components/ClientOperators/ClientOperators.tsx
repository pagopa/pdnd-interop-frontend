import { PartyQueries } from '@/api/party/party.hooks'
import { useDialog } from '@/contexts'
import { useJwt } from '@/hooks/useJwt'
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

  const handlePrefetchUserList = () => {
    prefetchUserList(jwt?.organizationId, {
      productRoles: ['admin', 'security'],
      states: ['ACTIVE'],
    })
  }

  const handleOpenAddOperatorDialog = () => {
    openDialog({ type: 'addSecurityOperator', clientId })
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
