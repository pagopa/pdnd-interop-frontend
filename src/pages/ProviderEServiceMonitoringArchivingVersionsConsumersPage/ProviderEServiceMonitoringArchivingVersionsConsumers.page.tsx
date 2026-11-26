import { PageContainer } from '@/components/layout/containers/PageContainer'
import type { DateNameSortBy } from '@/api/api.generatedTypes'
import { useTranslation } from 'react-i18next'
import { useFilters } from '@/hooks/useFilters'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import type { MIPaginationProps } from '@pagopa/mui-italia'
import { useSorting } from '@/hooks/useSorting'
import { usePagination } from '@/hooks/usePagination'
import { MIButton } from '@pagopa/mui-italia'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ProducerQueries } from '@/api/producer'
import { EServiceQueries } from '@/api/eservice'
import { useNavigate, useParams } from '@/router'
import { Stack, Skeleton } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useDrawerState } from '@/hooks/useDrawerState'
import { EServiceVersionSelectorDrawer } from '@/components/shared/EServiceVersionSelectorDrawer'
import { ProviderEServiceMonitoringArchivingVersionsConsumersTable } from './components/ProviderEServiceMonitoringArchivingVersionsConsumersTable'

const sortByOptions: DateNameSortBy[] = ['DATE_DESC', 'DATE_ASC', 'NAME_ASC', 'NAME_DESC']

const DEFAULT_SORT_BY: DateNameSortBy = 'DATE_DESC'

const ProviderEServiceMonitoringArchivingVersionsConsumersPage: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.monitoring.archiving.archivingVersionConsumersPage',
  })
  const { t: tSaturation } = useTranslation('dashboard', {
    keyPrefix: 'providerSaturationRatePage',
  })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const { t: tPages } = useTranslation('pages', {
    keyPrefix: 'providerDashboardConsumerList',
  })

  const { eserviceId, descriptorId } =
    useParams<'PROVIDE_ESERVICE_MONITORING_ARCHIVING_VERSIONS_CONSUMERS'>()
  const navigate = useNavigate()

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination()
  const { isOpen, openDrawer, closeDrawer } = useDrawerState()
  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  const { filters, ...filtersHandlers } = useFilters<{ q: string }>([
    {
      name: 'q',
      label: tPages('searchPlaceholder'),
      type: 'freetext',
    },
  ])

  const sortByLabels: Record<DateNameSortBy, string> = {
    DATE_DESC: tSaturation('sorting.dateDesc'),
    DATE_ASC: tSaturation('sorting.dateAsc'),
    NAME_ASC: tSaturation('sorting.nameAsc'),
    NAME_DESC: tSaturation('sorting.nameDesc'),
  }

  const sorting = useSorting(
    sortByOptions.map((sortBy) => ({
      value: sortBy,
      label: sortByLabels[sortBy],
    })),
    DEFAULT_SORT_BY
  )

  const { data, isPending, isFetching } = useQuery({
    ...ProducerQueries.getProducerEServiceMonitoringArchivingAgreements({
      eserviceId,
      descriptorId,
      ...paginationParams,
      q: filters.q || undefined,
      sortBy: sorting.sortBy as DateNameSortBy,
    }),
    placeholderData: keepPreviousData,
    throwOnError: false,
  })

  const tablePagination: MIPaginationProps | undefined =
    data && data.pagination.totalCount > 0
      ? {
          page: paginationProps.page,
          onChange: (_, page) => paginationProps.onPageChange(page),
          count: getTotalPageCount(data.pagination.totalCount),
          itemsPerPageOptions: paginationProps.itemsPerPageOptions,
        }
      : undefined

  const hasSingleVersion = !data?.otherVersions.length
  const eserviceInformationContainerContent = hasSingleVersion ? (
    `${data?.eservice.name}, V${data?.version}`
  ) : (
    <Stack direction="row" alignItems="center">
      {`${data?.eservice.name}, V${data?.version}`}
      <MIButton onClick={openDrawer} variant="text" sx={{ mx: 2 }}>
        {t('goToAnotherVersion')}
      </MIButton>
    </Stack>
  )

  console.log('isOpen', isOpen)

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      dashboardFlow
      titleAction={
        <MIButton disabled variant="outlined" startIcon={<UploadFileIcon />}>
          {/* TODO: Implement export functionality when available */}
          {tCommon('export')}
        </MIButton>
      }
    >
      {(isFetching || data) && (
        <Stack component="dl" spacing={3} sx={{ mt: 3, mb: 6 }}>
          <InformationContainer
            label={t('eserviceVersion')}
            content={
              isFetching ? (
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '200px' }} />
              ) : (
                eserviceInformationContainerContent
              )
            }
          />
          <InformationContainer
            label={t('archivingDate')}
            content={
              isFetching ? (
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '200px' }} />
              ) : (
                (data?.archivableOn ?? '-')
              )
            }
          />
        </Stack>
      )}
      <FiltersSection
        filters={filters}
        {...filtersHandlers}
        sorting={{
          ...sorting,
          onSortingChange: (value) => {
            sorting.onSortingChange(value)
            paginationProps.onPageChange(1)
          },
        }}
        showResults={true}
        submitButtonVariant="outlined"
      />
      <ProviderEServiceMonitoringArchivingVersionsConsumersTable
        data={data}
        isPending={isPending}
        isFetching={isFetching}
        paginationProps={tablePagination}
      />
      {descriptor && (
        <EServiceVersionSelectorDrawer
          isOpen={isOpen}
          onClose={closeDrawer}
          descriptor={descriptor}
          onVersionChange={(nextDescriptorId) =>
            navigate('PROVIDE_ESERVICE_MONITORING_ARCHIVING_VERSIONS_CONSUMERS', {
              params: { eserviceId, descriptorId: nextDescriptorId },
            })
          }
        />
      )}
    </PageContainer>
  )
}

export default ProviderEServiceMonitoringArchivingVersionsConsumersPage
