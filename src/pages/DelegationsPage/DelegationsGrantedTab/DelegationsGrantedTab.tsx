import type { GetDelegationsParams } from '@/api/api.generatedTypes'
import { Pagination, usePagination } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { Stack } from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'
import { DelegationQueries } from '@/api/delegation'
import { Link } from '@/router'
import {
  DelegationsTable,
  DelegationsTableSkeleton,
} from '@/components/shared/DelegationTable/DelegationsTable'

export const DelegationsGrantedTab: React.FC = () => {
  const { t: tCommon } = useTranslation('common')
  const { isAdmin, jwt } = AuthHooks.useJwt()
  const currentUserOrganizationId = jwt?.organizationId

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })

  const defaultParams: Pick<GetDelegationsParams, 'delegatorIds'> = {
    delegatorIds: [currentUserOrganizationId as string],
  }

  const queryParams = {
    ...paginationParams,
    ...defaultParams,
  }

  const { data: totalPageCount = 0 } = useQuery({
    ...DelegationQueries.getList(queryParams),
    placeholderData: keepPreviousData,
    select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  })

  return (
    <>
      {isAdmin && (
        <Stack sx={{ mb: 2 }} alignItems="end">
          <Link
            as="button"
            variant="contained"
            size="small"
            to="CREATE_DELEGATION"
            startIcon={<PlusOneIcon />}
          >
            {tCommon('createNewBtn')}
          </Link>
        </Stack>
      )}
      <React.Suspense fallback={<DelegationsTableSkeleton delegationType="DELEGATION_GRANTED" />}>
        <DelegationsTable delegationType="DELEGATION_GRANTED" params={queryParams} />
      </React.Suspense>
      <Pagination {...paginationProps} totalPages={totalPageCount} />
    </>
  )
}
