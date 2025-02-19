import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { AuthHooks } from '@/api/auth'
import { TemplateQueries } from '@/api/template'
import type { ActionItemButton } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import { ProviderEServiceCatalogGrid } from './components'
import {
  Filters,
  Pagination,
  useAutocompleteTextInput,
  useFilters,
  usePagination,
} from '@pagopa/interop-fe-commons'
import { EServiceCatalogGridSkeleton } from '../ConsumerEServiceCatalogPage/components'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { GetEServicesCatalogParams } from '@/api/api.generatedTypes'

const ProviderEServiceTemplatesCatalogPage: React.FC = () => {
  const { isAdmin } = AuthHooks.useJwt()
  const { t } = useTranslation('pages', { keyPrefix: 'providerEServiceTemplatesCatalog' })
  const { t: tTemplate } = useTranslation('template', { keyPrefix: 'list.filters' })

  const [templateProducersAutocompleteInput, setTemplateProducersAutocompleteInput] =
    useAutocompleteTextInput()

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 12 })

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetEServicesCatalogParams, 'limit' | 'offset'>
  >([
    {
      name: 'q',
      label: tTemplate('nameField.label'),
      type: 'freetext',
    },
    {
      name: 'producersIds',
      label: tTemplate('templateProviderField.label'),
      type: 'autocomplete-multiple',
      options: [],
      onTextInputChange: setTemplateProducersAutocompleteInput,
    },
  ])
  const queryParams = { ...paginationParams, ...filtersParams }

  const { data } = useQuery({
    ...TemplateQueries.getProviderTemplatesCatalogList(queryParams),
    placeholderData: keepPreviousData,
  })

  const topSideActions: Array<ActionItemButton> = []

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      topSideActions={isAdmin ? topSideActions : undefined}
    >
      <Filters {...filtersHandlers} />
      <ProviderEServiceTemplatesCatalogWrapper params={{ limit: 20, offset: 1 }} />
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
    </PageContainer>
  )
}

const ProviderEServiceTemplatesCatalogWrapper: React.FC<{
  params: { limit: number; offset: number }
}> = ({ params }) => {
  const { data, isFetching } = useQuery(TemplateQueries.getProviderTemplatesCatalogList(params))

  if (!data && isFetching) return <EServiceCatalogGridSkeleton />

  return <ProviderEServiceCatalogGrid eservicesTemplateList={data?.results} />
}

export default ProviderEServiceTemplatesCatalogPage
