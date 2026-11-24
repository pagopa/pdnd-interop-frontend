import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Stack, Typography } from '@mui/material'
import { MITable, type MITableColumn } from '@pagopa/mui-italia'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { AuthHooks } from '@/api/auth'
import type {
  CompactEServiceTemplateVersion,
  EServiceDescriptorState,
  EServiceTemplateInstance,
} from '@/api/api.generatedTypes'
import { ByDelegationChip } from '@/components/shared/ByDelegationChip'
import { getTemplateVersionNumber } from '@/components/shared/EserviceTemplate/eserviceTemplate.utils'
import { NoItemResults } from '@/components/shared/NoItemResults/NoItemResults'
import { StatusChip } from '@/components/shared/StatusChip'
import { usePagination } from '@/hooks/usePagination'
import { Link } from '@/router'
import { formatHierarchyWithoutParentRoot, getRootTenantFromHierarchy } from '@/utils/tenant.utils'

type ConsumerEServiceTemplateInstancesTableProps = {
  eserviceTemplateId: string
  eserviceTemplateVersions: CompactEServiceTemplateVersion[]
}

export const ConsumerEServiceTemplateInstancesTable: React.FC<
  ConsumerEServiceTemplateInstancesTableProps
> = ({ eserviceTemplateId, eserviceTemplateVersions }) => {
  const { jwt } = AuthHooks.useJwt()
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination()

  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t: tActions } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('eserviceTemplate')

  const { data, isFetching } = useQuery(
    EServiceTemplateQueries.getMyEServiceTemplateInstancesList({
      ...paginationParams,
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
        const isOwn = instance.producerId === jwt?.organizationId
        return (
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <span>
                {formatHierarchyWithoutParentRoot(
                  { name: instance.producerName, subUnitType: instance.producerSubUnitType },
                  instance.producerParentTenants
                )}
              </span>
              {!isOwn && <ByDelegationChip />}
            </Stack>
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
    return <NoItemResults>{t('list.myInstancesTable.noDataLabel')}</NoItemResults>
  }

  return (
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
      desktopTableProps={{ 'aria-label': t('read.tabs.eserviceTemplateInstances') }}
      mobileTableProps={{ 'aria-label': t('read.tabs.eserviceTemplateInstances') }}
    />
  )
}
