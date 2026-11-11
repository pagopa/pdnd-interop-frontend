import { NewPageContainer } from '@/components/layout/containers/NewPageContainer'
import { useParams } from '@/router'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  EServiceCatalogGrid,
  EServiceCatalogGridSkeleton,
} from '../ConsumerEServiceCatalogPage/components'
import { useQuery } from '@tanstack/react-query'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import { Box } from '@mui/material'
import { MIPagination } from '@pagopa/mui-italia'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { EServiceQueries } from '@/api/eservice'
import { keepPreviousData } from '@tanstack/react-query'
import { useFilters } from '@/hooks/useFilters'
import type {
  CatalogFilterPayload,
  CompactEServiceTemplateVersion,
  EServiceSortBy,
} from '@/api/api.generatedTypes'
import { useSorting } from '@/hooks/useSorting'
import { usePagination } from '@/hooks/usePagination'
import { debounce } from 'lodash'
import { trackEvent } from '@/config/tracking'
import TemplateBanner from './components/TemplateBanner'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'

const sortByOptions: EServiceSortBy[] = [
  'CREATED_AT_DESC',
  'CREATED_AT_ASC',
  'NAME_ASC',
  'NAME_DESC',
]

const ConsumerTemplateInstacesGroupPage: React.FC = () => {
  const { t: tEservice } = useTranslation('eservice', { keyPrefix: 'list' })
  const { templateInstancesGroupId } = useParams<'SUBSCRIBE_TEMPLATE_INSTANCES_GROUP'>()

  const { data: template, isLoading: isTemplateLoading } = useQuery(
    EServiceTemplateQueries.getSingleByEServiceTemplateId(templateInstancesGroupId)
  )

  const templateLatestVersion = template?.versions.reduce<
    CompactEServiceTemplateVersion | undefined
  >(
    (latest, version) =>
      latest === undefined || version.version > latest.version ? version : latest,
    undefined
  )

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
    Pick<CatalogFilterPayload, 'keyword' | 'producersIds'>
  >([
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
  ])

  const sorting = useSorting(
    sortByOptions.map((sortBy) => ({ value: sortBy, label: tEservice(`sorting.${sortBy}`) })),
    sortByOptions[0]
  )

  const { sortBy } = sorting

  const payload = useMemo(() => {
    const mappedFilters: Partial<CatalogFilterPayload> = {}
    Object.entries(filters).forEach(([key, value]) => {
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

  const query: CatalogFilterPayload = {
    ...paginationParams,
    ...payload,
    templateId: templateInstancesGroupId,
    sortBy: sortBy as EServiceSortBy,
  }

  const { data, isLoading } = useQuery({
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
    <NewPageContainer
      isLoading={isTemplateLoading || isLoading}
      title={template?.name}
      description={template?.description}
      avatarIcon={<FolderOutlinedIcon />}
    >
      {template && templateLatestVersion && (
        <TemplateBanner
          templateProducerName={template.creator.name}
          templateName={template.name}
          templateId={templateInstancesGroupId}
          templateVersionId={templateLatestVersion.id}
        />
      )}
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
    </NewPageContainer>
  )
}

const EServiceCatalogWrapper: React.FC<{ params: { limit: number; offset: number } }> = ({
  params,
}) => {
  const { data, isLoading } = useQuery(EServiceQueries.queryCatalogList(params))

  if (!data && isLoading) return <EServiceCatalogGridSkeleton />
  return <EServiceCatalogGrid catalog={data?.results} />
}

export default ConsumerTemplateInstacesGroupPage
