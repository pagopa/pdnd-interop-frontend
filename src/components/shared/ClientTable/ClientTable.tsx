import { ClientQueries } from '@/api/client'
import { usePagination } from '@/hooks/usePagination'
import type { ClientKind } from '@/types/client.types'
import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '../Table'
import { ClientTableRow, ClientTableRowSkeleton } from './ClientTableRow'
import type { ClientGetListQueryParams } from '@/api/client/client.api.types'
import { Pagination } from '../Pagination'
import { useFilters } from '@/hooks/useFilters'
import { Filters } from '../Filters'

interface ClientTableProps {
  clientKind: ClientKind
}

export const ClientTable: React.FC<ClientTableProps> = ({ clientKind }) => {
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { filtersParams, ...handlers } = useFilters([
    { name: 'q', type: 'single', label: 'Cerca per nome' },
  ])

  const params = {
    kind: clientKind,
    ...filtersParams,
    ...paginationParams,
  }

  const { data: clients } = ClientQueries.useGetList(params, {
    keepPreviousData: true,
    suspense: false,
  })

  return (
    <>
      <Filters {...handlers} />
      <Suspense fallback={<ClientTableSkeleton />}>
        <ClientTableWrapper params={params} clientKind={clientKind} />
      </Suspense>
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(clients?.pagination.totalCount)}
      />
    </>
  )
}

const ClientTableWrapper: React.FC<{
  params: ClientGetListQueryParams
  clientKind: ClientKind
}> = ({ params, clientKind }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t } = useTranslation('client')
  const { data: clients } = ClientQueries.useGetList(params)

  const headLabels = [tCommon('clientName'), '']
  const isEmpty = clients && clients.results.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty} noDataLabel={t('noMultiDataLabel')}>
      {!isEmpty &&
        clients?.results.map((client) => (
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
