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
import type { GetEServiceTemplatesCatalogParams } from '@/api/api.generatedTypes'

const ProviderEServiceTemplatesCatalogPage: React.FC = () => {
  const { isAdmin } = AuthHooks.useJwt()
  const { t } = useTranslation('pages', { keyPrefix: 'providerEServiceTemplatesCatalog' })
  const { t: tTemplate } = useTranslation('template', { keyPrefix: 'list.filters' })

  const [templateProducersAutocompleteInput, setTemplateProducersAutocompleteInput] =
    useAutocompleteTextInput()

  const { data: templateProducersOptions = [] } = useQuery({
    ...TemplateQueries.getProducersTemplateEserviceList({
      offset: 0,
      limit: 50,
      q: templateProducersAutocompleteInput ? templateProducersAutocompleteInput : undefined, //TODO: To remove this
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
      label: tTemplate('nameField.label'),
      type: 'freetext',
    },
    {
      name: 'creatorsIds',
      label: tTemplate('templateProviderField.label'),
      type: 'autocomplete-multiple',
      options: templateProducersOptions,
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
      <ProviderEServiceTemplatesCatalogWrapper params={queryParams} />
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

  return <ProviderEServiceCatalogGrid eservicesTemplateList={data?.results ?? []} />
}

export default ProviderEServiceTemplatesCatalogPage
