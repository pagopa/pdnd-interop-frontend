import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { useTranslation } from 'react-i18next'
import { EServiceTemplateCatalogGrid } from './components'
import {
  Filters,
  Pagination,
  useAutocompleteTextInput,
  useFilters,
  usePagination,
} from '@pagopa/interop-fe-commons'
import { EServiceCatalogGridSkeleton } from '../ConsumerEServiceCatalogPage/components'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { GetEServiceTemplatesCatalogParams } from '@/api/api.generatedTypes'

const ProviderEServiceTemplatesCatalogPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerEServiceTemplatesCatalog' })
  const { t: tEServiceTemplate } = useTranslation('eserviceTemplate', { keyPrefix: 'list.filters' })

  const [
    eserviceTemplateProducersAutocompleteInput,
    setEServiceTemplateProducersAutocompleteInput,
  ] = useAutocompleteTextInput()

  const { data: templateProducersOptions = [] } = useQuery({
    ...EServiceTemplateQueries.getProducersEServiceTemplateList({
      offset: 0,
      limit: 50,
      q: eserviceTemplateProducersAutocompleteInput
        ? eserviceTemplateProducersAutocompleteInput
        : undefined,
    }),
    placeholderData: keepPreviousData,
    select: (data) =>
      data.results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 12 })

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetEServiceTemplatesCatalogParams, 'limit' | 'offset'>
  >([
    {
      name: 'q',
      label: tEServiceTemplate('nameField.label'),
      type: 'freetext',
    },
    {
      name: 'creatorsIds',
      label: tEServiceTemplate('eserviceTemplateProviderField.label'),
      type: 'autocomplete-multiple',
      options: templateProducersOptions,
      onTextInputChange: setEServiceTemplateProducersAutocompleteInput,
    },
  ])
  const queryParams = { ...paginationParams, ...filtersParams }

  const { data } = useQuery({
    ...EServiceTemplateQueries.getProviderEServiceTemplatesCatalogList(queryParams),
    placeholderData: keepPreviousData,
  })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <Filters {...filtersHandlers} />
      <ProviderEServiceTemplatesCatalogWrapper params={queryParams} />
      <Pagination
        {...paginationProps}
        rowPerPageOptions={{
          onLimitChange: paginationProps.onLimitChange,
          limit: paginationParams.limit,
        }}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
    </PageContainer>
  )
}

const ProviderEServiceTemplatesCatalogWrapper: React.FC<{
  params: { limit: number; offset: number }
}> = ({ params }) => {
  const { data, isFetching } = useQuery(
    EServiceTemplateQueries.getProviderEServiceTemplatesCatalogList(params)
  )

  if (!data && isFetching) return <EServiceCatalogGridSkeleton />

  return <EServiceTemplateCatalogGrid eservicesTemplateList={data?.results ?? []} />
}

export default ProviderEServiceTemplatesCatalogPage
