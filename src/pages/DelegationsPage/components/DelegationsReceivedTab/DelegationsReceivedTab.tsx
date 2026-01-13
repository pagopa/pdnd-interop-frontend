import type { GetDelegationsParams } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { Pagination, usePagination } from '@pagopa/interop-fe-commons'
import React from 'react'
import {
  DelegationsTable,
  DelegationsTableSkeleton,
} from '../../../../components/shared/DelegationTable/DelegationsTable'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { DelegationQueries } from '@/api/delegation'

export const DelegationsReceivedTab: React.FC = () => {
  const { jwt } = AuthHooks.useJwt()
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination()

  const params: GetDelegationsParams = {
    ...paginationParams,
    delegateIds: [jwt?.organizationId as string],
  }

  const { data: totalPageCount = 0 } = useQuery({
    ...DelegationQueries.getList(params),
    placeholderData: keepPreviousData,
    enabled: Boolean(jwt?.organizationId),
    select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  })

  return (
    <>
      <React.Suspense
        fallback={<DelegationsTableSkeleton delegationType={'DELEGATION_RECEIVED'} />}
      >
        <DelegationsTable params={params} delegationType={'DELEGATION_RECEIVED'} />
      </React.Suspense>
      <Pagination
        {...paginationProps}
        rowPerPageOptions={{
          onLimitChange: paginationProps.onLimitChange,
          limit: paginationParams.limit,
        }}
        totalPages={totalPageCount}
      />
    </>
  )
}
