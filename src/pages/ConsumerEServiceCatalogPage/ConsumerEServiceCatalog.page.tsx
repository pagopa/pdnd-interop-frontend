import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { EServiceCatalogGrid, EServiceCatalogGridSkeleton } from './components'
import { EServiceQueries } from '@/api/eservice'
import { Pagination, useAutocompleteTextInput, usePagination } from '@pagopa/interop-fe-commons'
import type { CatalogFilterPayload, EServiceDescriptorState } from '@/api/api.generatedTypes'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { trackEvent } from '@/config/tracking'
import { debounce } from 'lodash'
import { ProductUpdatesBanner } from '@/components/shared/banners/ProductUpdatesBanner'
import { Filters } from '@/components/shared/Filters/Filters'
import { useFilters } from '@/hooks/useFilters'

const ConsumerEServiceCatalogPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerEServiceCatalog' })
  const { t: tEservice } = useTranslation('eservice', { keyPrefix: 'list.filters' })

  const [producersAutocompleteInput, setProducersAutocompleteInput] = useAutocompleteTextInput()

  const { data: producersOptions = [] } = useQuery({
    ...EServiceQueries.getProducers({ offset: 0, limit: 50, q: producersAutocompleteInput }),
    placeholderData: keepPreviousData,
    select: (data) =>
      data.results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 12 })
  const { filters, ...handlers } = useFilters<
    Omit<CatalogFilterPayload, 'limit' | 'offset' | 'sortBy'>
  >(
    [
      {
        name: 'keyword',
        label: tEservice('nameField.label'),
        type: 'freetext',
      },
      {
        name: 'producersIds',
        label: tEservice('providerField.label'),
        type: 'autocomplete-multiple',
        options: producersOptions,
        onTextInputChange: setProducersAutocompleteInput,
      },
    ],
    [
      {
        title: tEservice('side.rapidSelection.title'),
        fields: [
          {
            name: 'onlyActiveEservices',
            label: tEservice('side.rapidSelection.onlyActiveEServicesField.label'),
            description: tEservice('side.rapidSelection.onlyActiveEServicesField.description'),
            type: 'boolean',
          },
          {
            name: 'availableForRequester',
            label: tEservice('side.rapidSelection.availableForRequesterField.label'),
            description: tEservice('side.rapidSelection.availableForRequesterField.description'),
            type: 'boolean',
          },
          {
            name: 'subscribedByRequester',
            label: tEservice('side.rapidSelection.subscribedByrequesterField.label'),
            description: tEservice('side.rapidSelection.subscribedByrequesterField.description'),
            type: 'boolean',
          },
          {
            name: 'producerCategories',
            label: tEservice('side.rapidSelection.producerCategoriesField.label'),
            type: 'select-multiple',
            options: [],
          },
        ],
      },
      {
        title: tEservice('side.template.title'),
        fields: [
          {
            name: 'onlyTemplateInstances',
            label: tEservice('side.template.onlyTemplateInstancesField.label'),
            type: 'boolean',
          },
          {
            name: 'hasLinkedPurposeTemplates',
            label: tEservice('side.template.hasLinkedPurposeTemplatesField.label'),
            type: 'boolean',
          },
        ],
      },
      {
        title: tEservice('side.techSpec.title'),
        fields: [
          {
            name: 'asyncExchange',
            label: tEservice('side.techSpec.asyncExchangeField.label'),
            type: 'select-single',
            options: [],
          },
          {
            name: 'mode',
            label: tEservice('side.techSpec.modeField.label'),
            type: 'select-single',
            options: [],
          },
        ],
      },
      {
        title: tEservice('side.delegationAndSignalHub.title'),
        fields: [
          {
            name: 'requesterDelegationRoles',
            label: tEservice('side.delegationAndSignalHub.requesterDelegationRolesField.label'),
            type: 'select-multiple',
            options: [],
          },
          {
            name: 'onlySignalHubEnabled',
            label: tEservice('side.delegationAndSignalHub.onlySignalHubEnabledField.label'),
            type: 'boolean',
          },
        ],
      },
    ]
  )

  // Only e-service published or suspended can be shown in the catalog
  const states: Array<EServiceDescriptorState> = ['PUBLISHED', 'SUSPENDED']
  const queryParams = { ...paginationParams, ...filters, states }

  const { data } = useQuery({
    ...EServiceQueries.getCatalogList(queryParams),
    placeholderData: keepPreviousData,
  })

  React.useEffect(() => {
    const debouncedTrackEvent = debounce(() => {
      if (filters.keyword || filters.producersIds) {
        trackEvent('INTEROP_CATALOG_SEARCH_KEYWORD', {
          q: filters.keyword,
          producersId: filters.producersIds,
        })
      }
    }, 4000)

    debouncedTrackEvent()
    return () => debouncedTrackEvent.cancel()
  }, [filters.keyword, filters.producersIds])

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <ProductUpdatesBanner />
      <Filters {...handlers} filters={filters} />
      <EServiceCatalogWrapper params={queryParams} />
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
    </PageContainer>
  )
}

const EServiceCatalogWrapper: React.FC<{ params: { limit: number; offset: number } }> = ({
  params,
}) => {
  const { data, isFetching } = useQuery(EServiceQueries.getCatalogList(params))

  if (!data && isFetching) return <EServiceCatalogGridSkeleton />
  return <EServiceCatalogGrid eservices={data?.results} />
}

export default ConsumerEServiceCatalogPage
