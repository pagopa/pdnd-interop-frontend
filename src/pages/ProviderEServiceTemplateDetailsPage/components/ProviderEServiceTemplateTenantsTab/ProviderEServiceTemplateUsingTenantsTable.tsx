import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { MITable, type MITableColumn } from '@pagopa/mui-italia'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { AuthHooks } from '@/api/auth'
import type {
  CompactEServiceTemplateVersion,
  EServiceDescriptorState,
  EServiceTemplateInstance,
  GetEServiceTemplateInstancesParams,
} from '@/api/api.generatedTypes'
import { getTemplateVersionNumber } from '@/components/shared/EserviceTemplate/eserviceTemplate.utils'
import { NoItemResults } from '@/components/shared/NoItemResults/NoItemResults'
import { StatusChip } from '@/components/shared/StatusChip'
import { useFilters } from '@/hooks/useFilters'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import { usePagination } from '@/hooks/usePagination'
import { Link } from '@/router'
import { formatHierarchyWithoutParentRoot, getRootTenantFromHierarchy } from '@/utils/tenant.utils'
import { Stack, Typography } from '@mui/material'

type ProviderEServiceTemplateUsingTenantsTableProps = {
  eserviceTemplateId: string
  eserviceTemplateVersions: CompactEServiceTemplateVersion[]
}

export const ProviderEServiceTemplateUsingTenantsTable: React.FC<
  ProviderEServiceTemplateUsingTenantsTableProps
> = ({ eserviceTemplateId, eserviceTemplateVersions }) => {
  const { jwt } = AuthHooks.useJwt()
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination()

  const { t: tTemplate } = useTranslation('eserviceTemplate', { keyPrefix: 'list.filters' })
  const { t } = useTranslation('eserviceTemplate')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t: tActions } = useTranslation('common', { keyPrefix: 'actions' })

  const { filters, ...filtersHandlers } = useFilters<
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

  const filtersParams = {
    producerName: filters.producerName || undefined,
    states: filters.states?.length ? (filters.states as EServiceDescriptorState[]) : undefined,
  } as Omit<GetEServiceTemplateInstancesParams, 'limit' | 'offset'>

  const queryParams = { ...paginationParams, ...filtersParams }

  const { data, isFetching } = useQuery(
    EServiceTemplateQueries.getProviderEServiceTemplateInstancesList({
      ...queryParams,
      eserviceTemplateId,
    })
  )

  const isLoading = !data && isFetching
  const totalCount = data?.pagination.totalCount ?? 0
  const instances = data?.results ?? []

  const getDetailsRoute = (instance: EServiceTemplateInstance) => {
    if (instance.producerId !== jwt?.organizationId) return 'SUBSCRIBE_CATALOG_VIEW'
    if (instance.latestDescriptor?.state === 'DRAFT') return 'PROVIDE_ESERVICE_SUMMARY'
    return 'PROVIDE_ESERVICE_MANAGE'
  }

  const columns: Array<MITableColumn<EServiceTemplateInstance>> = [
    {
      id: 'tenant',
      header: tCommon('eserviceTemplateUsingTenant'),
      renderCell: (instance) => {
        const rootTenantName = getRootTenantFromHierarchy(instance.producerParentTenants)

        return (
          <Stack spacing={0.5}>
            <span>
              {formatHierarchyWithoutParentRoot(
                { name: instance.producerName, subUnitType: instance.producerSubUnitType },
                instance.producerParentTenants
              )}
            </span>
            {rootTenantName && (
              <Typography variant="caption" color="text.secondary">
                {rootTenantName}
              </Typography>
            )}
          </Stack>
        )
      },
    },
    {
      id: 'label',
      header: tCommon('eserviceTemplateInstanceLabel'),
      renderCell: (instance) => instance.instanceLabel || '-',
    },
    {
      id: 'version',
      header: tCommon('eserviceTemplateInstanceVersion'),
      renderCell: (instance) =>
        `${
          getTemplateVersionNumber(
            instance.latestDescriptor?.templateVersionId as string,
            eserviceTemplateVersions
          ) ?? '-'
        }`,
    },
    {
      id: 'state',
      header: tCommon('eserviceTemplateInstanceState'),
      renderCell: (instance) =>
        instance.latestDescriptor?.state ? (
          <StatusChip
            for="eservice"
            state={instance.latestDescriptor.state as EServiceDescriptorState}
          />
        ) : null,
    },
    {
      id: 'details',
      header: '',
      isAction: true,
      renderCell: (instance) =>
        instance.latestDescriptor ? (
          <Link
            as="button"
            variant="naked"
            size="small"
            to={getDetailsRoute(instance)}
            params={{
              eserviceId: instance.id,
              descriptorId: instance.latestDescriptor.id,
            }}
            aria-label={tActions('inspect')}
          >
            <ChevronRightIcon />
          </Link>
        ) : null,
    },
  ]

  if (!isLoading && instances.length === 0) {
    const areFiltersEmpty =
      filtersParams.producerName === undefined && filtersParams.states === undefined
    return (
      <>
        {!areFiltersEmpty && <FiltersSection filters={filters} {...filtersHandlers} />}
        <NoItemResults>
          {areFiltersEmpty
            ? t('list.usingTenantTable.noDataLabel')
            : t('list.usingTenantTable.noResultsLabel')}
        </NoItemResults>
      </>
    )
  }

  return (
    <>
      <FiltersSection filters={filters} results={totalCount} {...filtersHandlers} />
      <MITable
        columns={columns}
        rows={instances}
        getRowId={(instance) => instance.id}
        isLoading={isLoading}
        pagination={{
          page: paginationProps.page,
          itemsPerPageOptions: paginationProps.itemsPerPageOptions,
          count: getTotalPageCount(totalCount),
          onChange: (_, page) => paginationProps.onPageChange(page),
        }}
        desktopTableProps={{ 'aria-label': t('read.tabs.eserviceTemplateTenants') }}
        mobileTableProps={{ 'aria-label': t('read.tabs.eserviceTemplateTenants') }}
      />
    </>
  )
}
