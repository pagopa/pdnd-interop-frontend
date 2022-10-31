import { ClientQueries } from '@/api/client'
import useGetClientActions from '@/hooks/useGetClientActions'
import { useJwt } from '@/hooks/useJwt'
import { useNavigateRouter } from '@/router'
import { Client, ClientKind } from '@/types/client.types'
import { Box, Button, Skeleton, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ActionMenu from './ActionMenu'
import { Table, TableRow } from './Table'

type ClientTableRow = {
  client: Client
  clientKind: ClientKind
}

const ClientTableRow: React.FC<ClientTableRow> = ({ client, clientKind }) => {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { navigate } = useNavigateRouter()
  const prefetch = ClientQueries.usePrefetchSingle()

  const { actions } = useGetClientActions(client)

  const handlePrefetch = () => {
    prefetch(client.id)
  }

  const handleInspect = () => {
    const path =
      clientKind === 'CONSUMER' ? 'SUBSCRIBE_CLIENT_EDIT' : 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT'

    navigate(path, { params: { clientId: client.id } })
  }

  return (
    <TableRow cellData={[{ label: client.name }]}>
      <Button
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        onClick={handleInspect}
      >
        {t('inspect')}
      </Button>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

const ClientTableRowSkeleton: React.FC = () => {
  return (
    <TableRow cellData={[{ label: <Skeleton width={440} /> }]}>
      <Stack direction="row" sx={{ display: 'inline-flex' }}>
        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" width={100} height={35} />
        <Box
          sx={{
            ml: 4,
            mr: 2,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Skeleton variant="rectangular" width={4} />
        </Box>
      </Stack>
    </TableRow>
  )
}

interface ClientTableProps {
  clientKind: ClientKind
}

const ClientTable: React.FC<ClientTableProps> = ({ clientKind }) => {
  const { t } = useTranslation('client')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { jwt } = useJwt()
  const { data: clients } = ClientQueries.useGetAll({
    kind: clientKind,
    consumerId: jwt?.organizationId,
  })

  const headLabels = [tCommon('clientName'), '']
  const isEmpty = clients && clients.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty} noDataLabel={t('noMultiDataLabel')}>
      {!isEmpty &&
        clients?.map((client) => (
          <ClientTableRow key={client.id} client={client} clientKind={clientKind} />
        ))}
    </Table>
  )
}

export const ClientTableSkeleton: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'table.headData' })
  const headLabels = [t('clientName'), '']
  return (
    <Table headLabels={headLabels}>
      <ClientTableRowSkeleton />
      <ClientTableRowSkeleton />
      <ClientTableRowSkeleton />
      <ClientTableRowSkeleton />
      <ClientTableRowSkeleton />
    </Table>
  )
}

export default ClientTable
