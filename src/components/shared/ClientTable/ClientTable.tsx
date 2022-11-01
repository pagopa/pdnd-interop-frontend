import { ClientQueries } from '@/api/client'
import { useJwt } from '@/hooks/useJwt'
import { ClientKind } from '@/types/client.types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '../Table'
import { ClientTableRow, ClientTableRowSkeleton } from './ClientTableRow'

interface ClientTableProps {
  clientKind: ClientKind
}

export const ClientTable: React.FC<ClientTableProps> = ({ clientKind }) => {
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
