import { ClientQueries } from '@/api/client'
import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { ClientTableRow, ClientTableRowSkeleton } from './ClientTableRow'
import { Filters, Pagination, Table, useFilters, usePagination } from '@pagopa/interop-fe-commons'
import type { ClientKind, GetClientsParams } from '@/api/api.generatedTypes'
import { keepPreviousData, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { FEATURE_FLAG_ADMIN_CLIENT } from '@/config/env'

type ClientTableProps = {
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

  const { data: clients } = useQuery({
    ...ClientQueries.getList(params),
    placeholderData: keepPreviousData,
  })

  return (
    <>
      <Filters {...handlers} />
      <Suspense fallback={<ClientTableSkeleton clientKind={clientKind} />}>
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
  params: GetClientsParams
  clientKind: ClientKind
}> = ({ params, clientKind }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t } = useTranslation('client')
  const { data: clients } = useSuspenseQuery(ClientQueries.getList(params))

  const headLabels =
    FEATURE_FLAG_ADMIN_CLIENT && clientKind === 'API'
      ? [tCommon('clientName'), tCommon('clientAdminName'), '']
      : [tCommon('clientName'), '']
  const isEmpty = clients.results.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty} noDataLabel={t('noMultiDataLabel')}>
      {!isEmpty &&
        clients?.results.map((client) => (
          <ClientTableRow key={client.id} client={client} clientKind={clientKind} />
        ))}
    </Table>
  )
}

export const ClientTableSkeleton: React.FC<{
  clientKind: ClientKind
}> = ({ clientKind }) => {
  const { t } = useTranslation('common', { keyPrefix: 'table.headData' })
  const headLabels =
    FEATURE_FLAG_ADMIN_CLIENT && clientKind === 'API'
      ? [t('clientName'), t('clientAdminName'), '']
      : [t('clientName'), '']

  return (
    <Table headLabels={headLabels}>
      <ClientTableRowSkeleton clientKind={clientKind} />
      <ClientTableRowSkeleton clientKind={clientKind} />
      <ClientTableRowSkeleton clientKind={clientKind} />
      <ClientTableRowSkeleton clientKind={clientKind} />
      <ClientTableRowSkeleton clientKind={clientKind} />
    </Table>
  )
}
