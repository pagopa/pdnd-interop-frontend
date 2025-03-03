import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@/router'
import { AuthHooks } from '@/api/auth'
import type { ActionItemButton } from '@/types/common.types'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { Filters, Pagination, useFilters, usePagination } from '@pagopa/interop-fe-commons'
import type { GetProducerEServices2Params } from '@/api/api.generatedTypes'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { TemplateTable, TemplateTableSkeleton } from './components'
import { TemplateQueries } from '@/api/template'

const ProviderEServiceTemplatesListPage: React.FC = () => {
  const { isAdmin, isOperatorAPI } = AuthHooks.useJwt()
  const { t } = useTranslation('pages', { keyPrefix: 'providerEServiceTemplatesList' })
  const { t: tCommon } = useTranslation('common')
  const { t: tTemplate } = useTranslation('template', { keyPrefix: 'list.filters' })
  const navigate = useNavigate()

  const topSideActions: Array<ActionItemButton> = [
    {
      action: () => navigate('PROVIDE_ESERVICE_CREATE'), // TODO: to change with PROVIDE_ESERVICE_TEMPLATE_CREATE
      label: tCommon('createNewBtn'),
      variant: 'contained',
      icon: PlusOneIcon,
    },
  ]

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetProducerEServices2Params, 'limit' | 'offset'>
  >([{ name: 'q', label: tTemplate('nameField.label'), type: 'freetext' }])

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const queryParams = { ...paginationParams, ...filtersParams }
  const { data: totalPageCount = 0 } = useQuery({
    ...TemplateQueries.getProviderTemplatesList(queryParams),
    placeholderData: keepPreviousData,
    select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  })

  return (
    <PageContainer
      title={t('title')}
      topSideActions={isAdmin || isOperatorAPI ? topSideActions : undefined}
    >
      <Filters {...filtersHandlers} />
      <TemplateTableWrapper params={queryParams} />
      <Pagination {...paginationProps} totalPages={totalPageCount} />
    </PageContainer>
  )
}

const TemplateTableWrapper: React.FC<{ params: GetProducerEServices2Params }> = ({ params }) => {
  const { data, isFetching } = useQuery(TemplateQueries.getProviderTemplatesList(params))

  if (!data && isFetching) return <TemplateTableSkeleton />
  return <TemplateTable templates={data?.results ?? []} />
}

export default ProviderEServiceTemplatesListPage
