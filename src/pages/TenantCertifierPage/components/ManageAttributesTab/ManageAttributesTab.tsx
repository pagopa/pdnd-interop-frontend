import type { GetAttributesParams } from '@/api/api.generatedTypes'
import { AttributeQueries } from '@/api/attribute'
import { PartyQueries } from '@/api/tenant'
import { useDrawerState } from '@/hooks/useDrawerState'
import { Filters, Pagination, useFilters, usePagination } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { Button, Stack } from '@mui/material'
import { CreateAttributeDrawer } from './CreateAttributeDrawer'
import { AttributesTable, AttributesTableSkeleton } from './AttributesTable'

export const ManageAttributesTab: React.FC = () => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('party', { keyPrefix: 'tenantCertifier.manageTab' })
  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetAttributesParams, 'limit' | 'offset'>
  >([{ name: 'q', label: t('filters.nameField.label'), type: 'freetext' }])

  const { data: activeParty } = PartyQueries.useGetActiveUserParty()
  const defaultParams: Pick<GetAttributesParams, 'origin' | 'kinds'> = {
    origin: activeParty?.features[0]?.certifier?.certifierId,
    kinds: ['CERTIFIED'],
  }

  const queryParams = {
    ...paginationParams,
    ...filtersParams,
    ...defaultParams,
  }

  const { data } = AttributeQueries.useGetList(queryParams, {
    suspense: false,
    keepPreviousData: true,
  })

  return (
    <>
      <Stack sx={{ mb: 2 }} alignItems="end">
        <Button variant="contained" size="small" onClick={openDrawer} startIcon={<PlusOneIcon />}>
          {tCommon('createNewBtn')}
        </Button>
      </Stack>
      <Filters {...filtersHandlers} />
      <AttributesTableWrapper params={queryParams} />
      <CreateAttributeDrawer isOpen={isOpen} onClose={closeDrawer} />
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
