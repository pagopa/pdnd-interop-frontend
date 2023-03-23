import { ClientQueries } from '@/api/client'
import type { ClientKind } from '@/types/client.types'
import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '../Table'
import { ClientTableRow, ClientTableRowSkeleton } from './ClientTableRow'
import type { ClientGetListQueryParams } from '@/api/client/client.api.types'
import { Filters, Pagination, useFilters, usePagination } from '@pagopa/interop-fe-commons'

interface ClientTableProps {
  clientKind: ClientKind
}

export const ClientTable: React.FC<ClientTableProps> = ({ clientKind }) => {
  const { t } = useTranslation('client', { keyPrefix: 'list.filters' })
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { filtersParams, ...handlers } = useFilters([
    { name: 'q', type: 'freetext', label: t('nameField.label') },
  ])

  const params = {
    kind: clientKind,
    ...filtersParams,
    ...paginationParams,
  }

  const { data: clients } = ClientQueries.useGetList(params, {
    keepPreviousData: true,
    suspense: false,
    skipThrowOn404Error: true,
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
  const { data: clients } = ClientQueries.useGetList(params, { skipThrowOn404Error: true })

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
