import React from 'react'
import {
  ClientAddPublicKeyButton,
  ClientAddPublicKeyButtonSkeleton,
} from './ClientAddPublicKeyButton'
import { ClientPublicKeysTable, ClientPublicKeysTableSkeleton } from './ClientPublicKeysTable'
import { Filters, useFilters, Pagination, usePagination } from '@pagopa/interop-fe-commons'
import { ClientQueries } from '@/api/client'
import type { GetClientKeysParams } from '@/api/api.generatedTypes'
import { useTranslation } from 'react-i18next'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

interface ClientPublicKeysProps {
  clientId: string
}

export const ClientPublicKeys: React.FC<ClientPublicKeysProps> = ({ clientId }) => {
  const { t } = useTranslation('client', { keyPrefix: 'edit.filters' })

  const { data: userOptions = [] } = useQuery({
    ...ClientQueries.getOperatorsList(clientId),
    select: (data) =>
      data.map((o) => ({
        label: `${o.name} ${o.familyName}`,
        value: o.userId,
      })),
  })

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetClientKeysParams, 'clientId' | 'limit' | 'offset'>
  >([
    {
      name: 'userIds',
      label: t('operatorField.label'),
      type: 'autocomplete-multiple',
      options: userOptions,
    },
  ])

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })

  const queryParams = {
    ...filtersParams,
    ...paginationParams,
    clientId: clientId,
  }

  const { data: totalPageCount = 0 } = useQuery({
    ...ClientQueries.getKeyList(queryParams),
    placeholderData: keepPreviousData,
    select: ({ pagination }) => getTotalPageCount(pagination?.totalCount),
  })

  return (
    <>
      <React.Suspense fallback={<ClientAddPublicKeyButtonSkeleton />}>
        <ClientAddPublicKeyButton clientId={clientId} />
      </React.Suspense>
      <Filters {...filtersHandlers} />
      <React.Suspense fallback={<ClientPublicKeysTableSkeleton />}>
        <ClientPublicKeysWrapper params={queryParams} />
        <Pagination {...paginationProps} totalPages={totalPageCount} />
      </React.Suspense>
    </>
  )
}

const ClientPublicKeysWrapper: React.FC<{ params: GetClientKeysParams }> = ({ params }) => {
  const { data, isFetching } = useQuery(ClientQueries.getKeyList(params))

  if (!data && isFetching) return <ClientPublicKeysTableSkeleton />
  return <ClientPublicKeysTable clientId={params.clientId} keys={data?.keys || []} />
}
