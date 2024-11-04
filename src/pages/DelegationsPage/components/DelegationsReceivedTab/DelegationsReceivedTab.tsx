import type { GetProducerDelegationsParams } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { Pagination, usePagination } from '@pagopa/interop-fe-commons'
import React from 'react'
import {
  DelegationsTable,
  DelegationsTableSkeleton,
} from '../../../../components/shared/DelegationTable/DelegationsTable'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { DelegationQueries } from '@/api/delegation'
import type { DelegationType } from '@/types/party.types'

export const DelegationsReceivedTab: React.FC = () => {
  const { jwt } = AuthHooks.useJwt()
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })

  const params: GetProducerDelegationsParams = {
    ...paginationParams,
    kind: 'DELEGATED_PRODUCER',
    delegatedIds: [jwt?.organizationId as string],
  }

  const { data: totalPageCount = 0 } = useQuery({
    ...DelegationQueries.getProducerDelegationsList(params),
    placeholderData: keepPreviousData,
    enabled: Boolean(jwt?.organizationId),
    select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  })

  return (
    <>
      <React.Suspense
        fallback={
          <DelegationsTableSkeleton delegationType={'DELEGATION_RECEIVED' as DelegationType} />
        }
      >
        <DelegationsTable
          params={params}
          delegationType={'DELEGATION_RECEIVED' as DelegationType}
        />
      </React.Suspense>
      <Pagination {...paginationProps} totalPages={totalPageCount} />
    </>
  )
}
