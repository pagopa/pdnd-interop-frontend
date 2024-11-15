import type { GetDelegationsParams } from '@/api/api.generatedTypes'
import { Pagination, usePagination } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { Button, Stack } from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'
import { DelegationQueries } from '@/api/delegation'
import { useNavigate } from '@/router'
import { DelegationsTable } from '@/components/shared/DelegationTable/DelegationsTable'

export const DelegationsGrantedTab: React.FC = () => {
  const { t: tCommon } = useTranslation('common')
  const { isAdmin } = AuthHooks.useJwt()
  const userId = AuthHooks.useJwt().jwt?.uid

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })

  const defaultParams: Pick<GetDelegationsParams, 'delegatorIds'> = {
    delegatorIds: [userId as string],
  }

  const queryParams = {
    ...paginationParams,
    ...defaultParams,
  }

  const { data: totalPageCount = 0 } = useQuery({
    ...DelegationQueries.getProducerDelegationsList(queryParams),
    placeholderData: keepPreviousData,
    select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  })

  const navigate = useNavigate()

  return (
    <>
      {isAdmin && (
        <Stack sx={{ mb: 2 }} alignItems="end">
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate('CREATE_DELEGATION')}
            startIcon={<PlusOneIcon />}
          >
            {tCommon('createNewBtn')}
          </Button>
        </Stack>
      )}
      <DelegationsTable delegationType="DELEGATION_GRANTED" params={queryParams} />
      <Pagination {...paginationProps} totalPages={totalPageCount} />
    </>
  )
}
