import { AttributeQueries } from '@/api/attribute'
import { useDrawerState } from '@/hooks/useDrawerState'
import { Button, Stack } from '@mui/material'
import { Pagination, usePagination } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import QueueIcon from '@mui/icons-material/Queue'
import type { GetAttributesParams } from '@/api/api.generatedTypes'
import { AssignAttributeDrawer } from './AssignAttributeDrawer'
import { AttributesTable, AttributesTableSkeleton } from './AttributesTable'

export const AssignAttributesTab: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'tenantCertifier.assignTab' })

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })

  const queryParams: GetAttributesParams = {
    ...paginationParams,
    kinds: ['CERTIFIED'],
  }

  // TODO mettere chiamata corretta. è una chiamata diversa che deve essere implementata
  const { data } = AttributeQueries.useGetList(queryParams, {
    suspense: false,
    keepPreviousData: true,
  })

  return (
    <>
      <Stack sx={{ mb: 2 }} alignItems="end">
        <Button variant="contained" size="small" onClick={openDrawer} startIcon={<QueueIcon />}>
          {t('assignAttributeBtn')}
        </Button>
      </Stack>
      <AttributesTableWrapper params={queryParams} />
      <AssignAttributeDrawer isOpen={isOpen} onClose={closeDrawer} />
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
    </>
  )
}

const AttributesTableWrapper: React.FC<{ params: GetAttributesParams }> = ({ params }) => {
  const { data, isFetching } = AttributeQueries.useGetList(params, {
    suspense: false,
  })

  if (!data && isFetching) return <AttributesTableSkeleton />
  return <AttributesTable attributes={data?.results ?? []} />
}
