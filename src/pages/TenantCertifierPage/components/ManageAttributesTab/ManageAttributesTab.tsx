import type { GetAttributesParams } from '@/api/api.generatedTypes'
import { AttributeQueries } from '@/api/attribute'
import { TenantHooks } from '@/api/tenant'
import { useDrawerState } from '@/hooks/useDrawerState'
import { Filters, Pagination, useFilters, usePagination } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { Button, Stack } from '@mui/material'
import { CreateAttributeDrawer } from './CreateAttributeDrawer'
import { AttributesTable, AttributesTableSkeleton } from './AttributesTable'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'

export const ManageAttributesTab: React.FC = () => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('party', { keyPrefix: 'tenantCertifier.manageTab' })
  const { isOpen, openDrawer, closeDrawer } = useDrawerState()
  const { isAdmin } = AuthHooks.useJwt()

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetAttributesParams, 'limit' | 'offset'>
  >([{ name: 'q', label: t('filters.nameField.label'), type: 'freetext' }])

  const { data: activeParty } = TenantHooks.useGetActiveUserParty()
  const defaultParams: Pick<GetAttributesParams, 'origin' | 'kinds'> = {
    origin: activeParty?.features[0]?.certifier?.certifierId,
    kinds: ['CERTIFIED'],
  }

  const queryParams = {
    ...paginationParams,
    ...filtersParams,
    ...defaultParams,
  }

  const { data: totalPageCount = 0 } = useQuery({
    ...AttributeQueries.getList(queryParams),
    placeholderData: keepPreviousData,
    select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  })

  return (
    <>
      {isAdmin && (
        <Stack sx={{ mb: 2 }} alignItems="end">
          <Button variant="contained" size="small" onClick={openDrawer} startIcon={<PlusOneIcon />}>
            {tCommon('createNewBtn')}
          </Button>
        </Stack>
      )}
      <Filters {...filtersHandlers} />
      <AttributesTableWrapper params={queryParams} />
      {isAdmin && <CreateAttributeDrawer isOpen={isOpen} onClose={closeDrawer} />}
      <Pagination {...paginationProps} totalPages={totalPageCount} />
    </>
  )
}

const AttributesTableWrapper: React.FC<{ params: GetAttributesParams }> = ({ params }) => {
  const { data, isFetching } = useQuery(AttributeQueries.getList(params))

  if (!data && isFetching) return <AttributesTableSkeleton />
  return <AttributesTable attributes={data?.results ?? []} />
}
