import { ClientQueries } from '@/api/client'
import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { KeychainsTableRow, KeychainsTableRowSkeleton } from './KeychainsTableRow'
import { Filters, Pagination, Table, useFilters, usePagination } from '@pagopa/interop-fe-commons'
import type { ClientKind, GetClientsParams } from '@/api/api.generatedTypes'

interface KeychainsTableProps {
  clientKind: ClientKind
}

export const KeychainsTable: React.FC<KeychainsTableProps> = ({ clientKind }) => {
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
  params: GetClientsParams
  clientKind: ClientKind
}> = ({ params, clientKind }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t } = useTranslation('client')
  const { data: clients } = ClientQueries.useGetList(params)

  const headLabels = [tCommon('keychains'), '']
  const isEmpty = clients && clients.results.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty} noDataLabel={t('noMultiDataLabel')}>
      {!isEmpty &&
        clients?.results.map((client) => (
          <KeychainsTableRow key={client.id} client={client} clientKind={clientKind} />
        ))}
    </Table>
  )
}

export const ClientTableSkeleton: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'table.headData' })
  const headLabels = [t('keychains'), '']
  return (
    <Table headLabels={headLabels}>
      <KeychainsTableRowSkeleton />
      <KeychainsTableRowSkeleton />
      <KeychainsTableRowSkeleton />
      <KeychainsTableRowSkeleton />
      <KeychainsTableRowSkeleton />
    </Table>
  )
}
