import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { EServiceCatalogGrid, EServiceCatalogGridSkeleton } from './components'
import { EServiceQueries } from '@/api/eservice'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import { MIPagination } from '@pagopa/mui-italia'
import { Box } from '@mui/material'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { useFilters } from '@/hooks/useFilters'
import type {
  CatalogFilterPayload,
  EServiceMode,
  EServiceProducerCategory,
  EServiceSortBy,
  RequesterDelegationRole,
} from '@/api/api.generatedTypes'
import { useTranslation } from 'react-i18next'
import { useSorting } from '@/hooks/useSorting'
import { match } from 'ts-pattern'
import { usePagination } from '@/hooks/usePagination'
import { debounce } from 'lodash'
import { trackEvent } from '@/config/tracking'

const producerCategoriesOptions: EServiceProducerCategory[] = [
  'ALTRE_PUBBLICHE_AMMINISTRAZIONI_LOCALI',
  'AZIENDE_OSPEDALIERE_ASL',
  'COMUNI',
  'PROVINCE_CITTA_METROPOLITANE',
  'PUBBLICHE_AMMINISTRAZIONI_CENTRALI',
  'ENTI_NAZIONALI_PREVIDENZA_ASSISTENZA',
  'REGIONI_PROVINCE_AUTONOME',
  'CONSORZI_ASSOCIAZIONI_REGIONALI',
  'SCUOLE',
  'UNIVERSITA_AFAM',
  'ISTITUTI_RICERCA',
  'STAZIONI_APPALTANTI_GESTORI_PUBBLICI_SERVIZI',
]

const requesterDelegationRolesOptions: (RequesterDelegationRole | 'ALL')[] = [
  'ALL',
  'DELEGATE',
  'DELEGATOR',
]

const eserviceModesOptions: (EServiceMode | 'ALL')[] = ['ALL', 'RECEIVE', 'DELIVER']

const sortByOptions: EServiceSortBy[] = [
  'CREATED_AT_ASC',
  'CREATED_AT_DESC',
  'NAME_ASC',
  'NAME_DESC',
]

const AllEServicesTab: React.FC = () => {
  const { t: tEservice } = useTranslation('eservice', { keyPrefix: 'list' })
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

  const { filters, ...handlers } = useFilters<
    Omit<CatalogFilterPayload, 'limit' | 'offset' | 'sortBy'>
  >(
    [
      {
        name: 'keyword',
        label: tEservice('filters.keywordField.label'),
        type: 'freetext',
      },
      {
        name: 'producersIds',
        label: tEservice('filters.providerField.label'),
        type: 'autocomplete-multiple',
        options: producersOptions,
        onTextInputChange: setProducersAutocompleteInput,
      },
    ],
    [
      {
        title: tEservice('filters.side.rapidSelection.title'),
        fields: [
          {
            name: 'onlyActiveEservices',
            label: tEservice('filters.side.rapidSelection.onlyActiveEServicesField.label'),
            description: tEservice(
              'filters.side.rapidSelection.onlyActiveEServicesField.description'
            ),
            type: 'boolean',
          },
          {
            name: 'availableForRequester',
            label: tEservice('filters.side.rapidSelection.availableForRequesterField.label'),
            description: tEservice(
              'filters.side.rapidSelection.availableForRequesterField.description'
            ),
            type: 'boolean',
          },
          {
            name: 'subscribedByRequester',
            label: tEservice('filters.side.rapidSelection.subscribedByrequesterField.label'),
            description: tEservice(
              'filters.side.rapidSelection.subscribedByrequesterField.description'
            ),
            type: 'boolean',
          },
          {
            name: 'producerCategories',
            label: tEservice('filters.side.rapidSelection.producerCategoriesField.label'),
            type: 'autocomplete-multiple',
            options: producerCategoriesOptions.map((category) => ({
              label: tEservice(
                `filters.side.rapidSelection.producerCategoriesField.options.${category}`
              ),
              value: category,
            })),
          },
        ],
      },
      {
        title: tEservice('filters.side.template.title'),
        fields: [
          {
            name: 'onlyTemplateInstances',
            label: tEservice('filters.side.template.onlyTemplateInstancesField.label'),
            type: 'boolean',
          },
          {
            name: 'hasLinkedPurposeTemplates',
            label: tEservice('filters.side.template.hasLinkedPurposeTemplatesField.label'),
            type: 'boolean',
          },
        ],
      },
      {
        title: tEservice('filters.side.techSpec.title'),
        fields: [
          {
            name: 'asyncExchange',
            label: tEservice('filters.side.techSpec.asyncExchangeField.label'),
            type: 'autocomplete-single',
            options: [
              {
                label: tEservice('filters.side.techSpec.asyncExchangeField.options.ALL'),
                value: 'ALL',
              },
              {
                label: tEservice('filters.side.techSpec.asyncExchangeField.options.SYNC'),
                value: 'SYNC',
              },
              {
                label: tEservice('filters.side.techSpec.asyncExchangeField.options.ASYNC'),
                value: 'ASYNC',
              },
            ],
          },
          {
            name: 'mode',
            label: tEservice('filters.side.techSpec.modeField.label'),
            type: 'autocomplete-single',
            options: eserviceModesOptions.map((mode) => ({
              label: tEservice(`filters.side.techSpec.modeField.options.${mode}`),
              value: mode,
            })),
          },
        ],
      },
      {
        title: tEservice('filters.side.delegationAndSignalHub.title'),
        fields: [
          {
            name: 'requesterDelegationRoles',
            label: tEservice(
              'filters.side.delegationAndSignalHub.requesterDelegationRolesField.label'
            ),
            type: 'autocomplete-single',
            options: requesterDelegationRolesOptions.map((role) => ({
              label: tEservice(
                `filters.side.delegationAndSignalHub.requesterDelegationRolesField.options.${role}`
              ),
              value: role,
            })),
          },
          {
            name: 'onlySignalHubEnabled',
            label: tEservice('filters.side.delegationAndSignalHub.onlySignalHubEnabledField.label'),
            description: tEservice(
              'filters.side.delegationAndSignalHub.onlySignalHubEnabledField.description'
            ),
            type: 'boolean',
          },
        ],
      },
    ]
  )

  const sorting = useSorting(
    sortByOptions.map((sortBy) => ({ value: sortBy, label: tEservice(`sorting.${sortBy}`) })),
    sortByOptions[1]
  )

  const { sortBy } = sorting
  const payload = useMemo(() => {
    const mappedFilters: Partial<CatalogFilterPayload> = {}
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'asyncExchange') {
        match(value)
          .with('ALL', () => {
            mappedFilters[key] = undefined
          })
          .with('SYNC', () => {
            mappedFilters[key] = false
          })
          .with('ASYNC', () => {
            mappedFilters[key] = true
          })
          .otherwise(() => {
            mappedFilters[key] = undefined
          })
        return
      }

      if (key === 'mode' && value === 'ALL') {
        mappedFilters[key] = undefined
        return
      }

      if (key === 'requesterDelegationRoles') {
        match(value)
          .with('ALL', () => {
            mappedFilters[key] = ['DELEGATE', 'DELEGATOR']
          })
          .with('DELEGATE', () => {
            mappedFilters[key] = ['DELEGATE']
          })
          .with('DELEGATOR', () => {
            mappedFilters[key] = ['DELEGATOR']
          })
          .otherwise(() => {
            mappedFilters[key] = undefined
          })
        return
      }

      if (
        value === null ||
        value === false ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        mappedFilters[key as keyof CatalogFilterPayload] = undefined
        return
      }

      mappedFilters[key as keyof CatalogFilterPayload] = value as never
    })

    return mappedFilters
  }, [filters])

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({
    limit: 9,
    limitOptions: [9, 12, 15, 18, 21],
  })

  // Only e-service published or suspended can be shown in the catalog
  // const states: Array<EServiceDescriptorState> = ['PUBLISHED', 'SUSPENDED']
  const query = { ...paginationParams, ...payload, sortBy: sortBy as EServiceSortBy }

  const { data } = useQuery({
    ...EServiceQueries.queryCatalogList(query),
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
    <>
      <FiltersSection
        filters={filters}
        {...handlers}
        sorting={sorting}
        results={data?.pagination.totalCount}
      />
      <EServiceCatalogWrapper params={query} />
      {data && data.pagination.totalCount !== 0 && (
        <Box mt={3}>
          <MIPagination
            page={paginationProps.page}
            itemsPerPageOptions={paginationProps.itemsPerPageOptions}
            count={getTotalPageCount(data?.pagination.totalCount)}
            onChange={(_, page) => paginationProps.onPageChange(page)}
          />
        </Box>
      )}
    </>
  )
}

const EServiceCatalogWrapper: React.FC<{ params: CatalogFilterPayload }> = ({ params }) => {
  const { data, isFetching } = useQuery(EServiceQueries.queryCatalogList(params))

  if (!data && isFetching) return <EServiceCatalogGridSkeleton />
  return <EServiceCatalogGrid eservices={data?.results} />
}

export default AllEServicesTab
