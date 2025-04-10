import { Filters, Pagination, Table, useFilters, usePagination } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { TemplateQueries } from '@/api/template'
import {
  ProviderEServiceTemplateUsingTenantsTableRow,
  ProviderEServiceTemplateUsingTenantsTableRowSkeleton,
} from './ProviderEServiceTemplateUsingTenantsTableRow'
import type {
  CompactEServiceTemplateVersion,
  GetEServiceTemplateInstancesParams,
} from '@/api/api.generatedTypes'
import { Alert } from '@mui/material'

type ProviderEServiceTemplateUsingTenantsTableProps = {
  eserviceTemplateId: string
  templateVersions: CompactEServiceTemplateVersion[]
}

export const ProviderEServiceTemplateUsingTenantsTable: React.FC<
  ProviderEServiceTemplateUsingTenantsTableProps
> = ({ eserviceTemplateId, templateVersions }) => {
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })

  const { t: tTemplate } = useTranslation('template', { keyPrefix: 'list.filters' })

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetEServiceTemplateInstancesParams, 'limit' | 'offset'>
  >([
    { name: 'producerName', label: tTemplate('tenantField'), type: 'freetext' },
    {
      name: 'states',
      label: tTemplate('statusField.label'),
      type: 'autocomplete-multiple',
      options: [
        { label: tTemplate('statusField.optionLabels.ACTIVE'), value: 'PUBLISHED' },
        { label: tTemplate('statusField.optionLabels.DEPRECATED'), value: 'DEPRECATED' },
        { label: tTemplate('statusField.optionLabels.SUSPENDED'), value: 'SUSPENDED' },
        { label: tTemplate('statusField.optionLabels.ARCHIVED'), value: 'ARCHIVED' },
      ],
    },
  ])

  const queryParams = { ...paginationParams, ...filtersParams }

  const { data: templateInstancesCount } = useQuery({
    ...TemplateQueries.getProviderTemplateInstancesList({
      ...queryParams,
      eserviceTemplateId: eserviceTemplateId,
    }),
    select: (data) => data.pagination.totalCount,
  })

  const isDataEmpty = Boolean(!templateInstancesCount || templateInstancesCount === 0)
  const areFiltersEmpty = Boolean(
    filtersParams.producerName === undefined && filtersParams.states === undefined
  )

  return (
    <>
      {(!isDataEmpty || !areFiltersEmpty) && <Filters {...filtersHandlers} />}
      <React.Suspense fallback={<ProviderEServiceTemplateUsingTenantsTableSkeleton />}>
        <ProviderEServiceTemplateUsingTenantsTableWrapper
          params={queryParams}
          eserviceTemplateId={eserviceTemplateId}
          templateVersions={templateVersions}
          noTableData={isDataEmpty && areFiltersEmpty}
        />
      </React.Suspense>
      <Pagination {...paginationProps} totalPages={getTotalPageCount(templateInstancesCount)} />
    </>
  )
}

const ProviderEServiceTemplateUsingTenantsTableWrapper: React.FC<{
  params: GetEServiceTemplateInstancesParams
  eserviceTemplateId: string
  templateVersions: CompactEServiceTemplateVersion[]
  noTableData: boolean
}> = ({ params, eserviceTemplateId, templateVersions, noTableData }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t } = useTranslation('template', { keyPrefix: 'list.usingTenantTable' })

  const { data: templateInstances } = useSuspenseQuery(
    TemplateQueries.getProviderTemplateInstancesList({
      ...params,
      eserviceTemplateId: eserviceTemplateId,
    })
  )

  const headLabels = [
    tCommon('eserviceTemplateUsingTenant'),
    tCommon('eserviceTemplateInstanceLabel'),
    tCommon('eserviceTemplateInstanceVersion'),
    tCommon('eserviceTemplateInstanceState'),
  ]
  const isEmpty = templateInstances.results.length === 0

  return (
    <>
      {isEmpty ? (
        <Alert severity="info"> {noTableData ? t('noDataLabel') : t('noResultsLabel')} </Alert>
      ) : (
        <Table
          headLabels={headLabels}
          isEmpty={isEmpty}
          noDataLabel={noTableData ? t('noDataLabel') : t('noResultsLabel')}
        >
          {templateInstances?.results.map((instance) => (
            <ProviderEServiceTemplateUsingTenantsTableRow
              key={instance.id}
              instance={instance}
              templateVersions={templateVersions}
            />
          ))}
        </Table>
      )}
    </>
  )
}

export const ProviderEServiceTemplateUsingTenantsTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common')

  const headLabels = [tCommon('table.headData.eserviceTemplateUsingTenant'), '']
  return (
    <Table headLabels={headLabels}>
      <ProviderEServiceTemplateUsingTenantsTableRowSkeleton />
      <ProviderEServiceTemplateUsingTenantsTableRowSkeleton />
      <ProviderEServiceTemplateUsingTenantsTableRowSkeleton />
      <ProviderEServiceTemplateUsingTenantsTableRowSkeleton />
      <ProviderEServiceTemplateUsingTenantsTableRowSkeleton />
    </Table>
  )
}
