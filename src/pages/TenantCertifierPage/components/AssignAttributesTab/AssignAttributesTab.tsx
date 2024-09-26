import { AttributeQueries } from '@/api/attribute'
import { useDrawerState } from '@/hooks/useDrawerState'
import { Button, Stack } from '@mui/material'
import { Pagination, usePagination } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import QueueIcon from '@mui/icons-material/Queue'
import type { GetRequesterCertifiedAttributesParams } from '@/api/api.generatedTypes'
import { AssignAttributeDrawer } from './AssignAttributeDrawer'
import { AttributesTable, AttributesTableSkeleton } from './AttributesTable'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'

export const AssignAttributesTab: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'tenantCertifier.assignTab' })

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })

  const queryParams: GetRequesterCertifiedAttributesParams = {
    ...paginationParams,
  }

  const { data } = useQuery({
    ...AttributeQueries.getRequesterCertifiedAttributesList(queryParams),
    placeholderData: keepPreviousData,
  })

  const { isAdmin } = AuthHooks.useJwt()

  return (
    <>
      <Stack sx={{ mb: 2 }} alignItems="end">
        <Button variant="contained" size="small" onClick={openDrawer} startIcon={<QueueIcon />}>
          {t('assignAttributeBtn')}
        </Button>
      </Stack>
      <AttributesTableWrapper params={queryParams} />
      <AssignAttributeDrawer isOpen={isOpen && isAdmin} onClose={closeDrawer} />
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
    </>
  )
}

const AttributesTableWrapper: React.FC<{ params: GetRequesterCertifiedAttributesParams }> = ({
  params,
}) => {
  const { data, isFetching } = useQuery(
    AttributeQueries.getRequesterCertifiedAttributesList(params)
  )

  if (!data && isFetching) return <AttributesTableSkeleton />
  return <AttributesTable attributes={data?.results ?? []} />
}
