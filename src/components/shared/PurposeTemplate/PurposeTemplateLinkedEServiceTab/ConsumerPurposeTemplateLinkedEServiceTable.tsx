import {
  Filters,
  Pagination,
  Table,
  useAutocompleteTextInput,
  useFilters,
  usePagination,
} from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import {
  ConsumerPurposeTemplateLinkedEServiceTableRow,
  ConsumerPurposeTemplateLinkedEServiceTableRowSkeleton,
} from './ConsumerPurposeTemplateLinkedEServiceTableRow'
import type {
  GetPurposeTemplateEServicesParams,
  PurposeTemplateWithCompactCreator,
} from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'

type ConsumerPurposeTemplateLinkedEServiceTableProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}

export const ConsumerPurposeTemplateLinkedEServiceTable: React.FC<
  ConsumerPurposeTemplateLinkedEServiceTableProps
> = ({ purposeTemplate }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'read.linkedEservicesTab' })

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

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetPurposeTemplateEServicesParams, 'limit' | 'offset' | 'purposeTemplateId'>
  >([
    { name: 'eserviceName', label: t('filters.eserviceField.label'), type: 'freetext' },
    {
      name: 'producerIds',
      label: t('filters.providerField.label'),
      type: 'autocomplete-multiple',
      options: producersOptions,
      onTextInputChange: setProducersAutocompleteInput,
    },
  ])

  const queryParams = {
    ...paginationParams,
    ...filtersParams,
  }

  const { data: eserviceDescriptorsPurposeTemplateList, isFetching } = useQuery({
    ...PurposeTemplateQueries.getEservicesLinkedToPurposeTemplatesList({
      ...queryParams,
      purposeTemplateId: purposeTemplate.id,
    }),
    placeholderData: keepPreviousData,
  })

  const headLabels = [tCommon('linkedEserviceName'), tCommon('linkedEserviceProviderName'), '']
  const isEmpty =
    eserviceDescriptorsPurposeTemplateList === undefined ||
    eserviceDescriptorsPurposeTemplateList.results.length === 0

  if (isFetching && eserviceDescriptorsPurposeTemplateList === undefined) {
    return <ConsumerPurposeTemplateLinkedEServiceTableSkeleton />
  }

  return (
    <>
      <Filters {...filtersHandlers} />
      <Table headLabels={headLabels} isEmpty={isEmpty}>
        {eserviceDescriptorsPurposeTemplateList!.results.map(
          (eserviceDescriptorPurposeTemplate) => (
            <ConsumerPurposeTemplateLinkedEServiceTableRow
              key={eserviceDescriptorPurposeTemplate.eservice.id}
              compactEServiceWithCompactDescriptor={eserviceDescriptorPurposeTemplate}
            />
          )
        )}
      </Table>
      <Pagination
        {...paginationProps}
        rowPerPageOptions={{
          onLimitChange: paginationProps.onLimitChange,
          limit: paginationParams.limit,
        }}
        totalPages={getTotalPageCount(
          eserviceDescriptorsPurposeTemplateList!.pagination.totalCount
        )}
      />
    </>
  )
}

export const ConsumerPurposeTemplateLinkedEServiceTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [tCommon('linkedEserviceName'), tCommon('linkedEserviceProviderName'), '']
  return (
    <Table headLabels={headLabels}>
      <ConsumerPurposeTemplateLinkedEServiceTableRowSkeleton />
      <ConsumerPurposeTemplateLinkedEServiceTableRowSkeleton />
      <ConsumerPurposeTemplateLinkedEServiceTableRowSkeleton />
      <ConsumerPurposeTemplateLinkedEServiceTableRowSkeleton />
      <ConsumerPurposeTemplateLinkedEServiceTableRowSkeleton />
    </Table>
  )
}
