import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@/router'
import { AuthHooks } from '@/api/auth'
import type { ActionItemButton } from '@/types/common.types'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { Filters, Pagination, useFilters, usePagination } from '@pagopa/interop-fe-commons'
import { GetProducerEServicesParams } from '@/api/api.generatedTypes' //TODO change with the correct import
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { EServiceQueries } from '@/api/eservice'
import { EServiceTable, EServiceTableSkeleton } from '../ProviderEServiceListPage/components'
import { TemplateTable } from './components'

const ProviderTemplatesListPage: React.FC = () => {
  const { isAdmin } = AuthHooks.useJwt()
  const { t } = useTranslation('pages', { keyPrefix: 'providerTemplatesList' })
  const { t: tCommon } = useTranslation('common')
  const { t: tTemplate } = useTranslation('template', { keyPrefix: 'list.filters' })
  const navigate = useNavigate()

  const topSideActions: Array<ActionItemButton> = [
    {
      action: () => [], //navigate('PROVIDE_TEMPLATE_CREATE'), //TODO CREATE TEMPLATE
      label: tCommon('createNewBtn'),
      variant: 'contained',
      icon: PlusOneIcon,
    },
  ]

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetProducerEServicesParams, 'limit' | 'offset'> //TODO GetProducerTemplatesParams (?)
  >([{ name: 'q', label: tTemplate('nameField.label'), type: 'freetext' }])

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const queryParams = { ...paginationParams, ...filtersParams }
  const { data: totalPageCount = 0 } = useQuery({
    //TODO sostituire eservicequeries
    ...EServiceQueries.getProviderList(queryParams),
    placeholderData: keepPreviousData,
    select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  })

  return (
    <PageContainer title={t('title')} topSideActions={isAdmin ? topSideActions : undefined}>
      <Filters {...filtersHandlers} />
      <TemplateTableWrapper params={queryParams} />
      <Pagination {...paginationProps} totalPages={totalPageCount} />
    </PageContainer>
  )
}

const TemplateTableWrapper: React.FC<{ params: GetProducerEServicesParams }> = ({ params }) => {
  //TODO sostituire params
  const { data, isFetching } = useQuery(EServiceQueries.getProviderList(params))

  if (!data && isFetching) return <EServiceTableSkeleton />
  return <TemplateTable templates={data?.results ?? []} />
}

export default ProviderTemplatesListPage
