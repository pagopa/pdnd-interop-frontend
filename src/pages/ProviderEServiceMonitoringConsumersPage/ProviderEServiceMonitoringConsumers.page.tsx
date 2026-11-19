import { PageContainer } from '@/components/layout/containers/PageContainer'
import type { SaturationSortBy } from '@/api/api.generatedTypes'
import { useTranslation } from 'react-i18next'
import { useFilters } from '@/hooks/useFilters'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import type { MIPaginationProps } from '@pagopa/mui-italia'
import { useSorting } from '@/hooks/useSorting'
import { usePagination } from '@/hooks/usePagination'
import { MIButton } from '@pagopa/mui-italia'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'
import { ProducerQueries } from '@/api/producer'
import { EServiceMutations, EServiceQueries } from '@/api/eservice'
import { ProviderEServiceMonitoringConsumersTable } from '../ProviderEServiceDetailsPage/components/ProviderEServiceMonitoringTab/ProviderEServiceMonitoringConsumersTable'
import { useParams } from '@/router'
import { Stack, Skeleton } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useDrawerState } from '@/hooks/useDrawerState'
import { EServiceVersionSelectorDrawer } from '@/components/shared/EServiceVersionSelectorDrawer'
import { UpdateDailyCallsDrawer } from '@/components/shared/UpdateDailyCallsDrawer'

const sortByOptions: SaturationSortBy[] = [
  'PERCENTAGE_ASC',
  'PERCENTAGE_DESC',
  'NAME_ASC',
  'NAME_DESC',
]

const DEFAULT_SORT_BY: SaturationSortBy = 'PERCENTAGE_ASC'

const ProviderEServiceMonitoringConsumersPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.monitoring.consumers' })
  const { t: tSaturation } = useTranslation('dashboard', {
    keyPrefix: 'providerSaturationRatePage',
  })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t: tDailyCallsDrawer } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateDailyCallsDrawer',
  })
  const { t: tPages } = useTranslation('pages', {
    keyPrefix: 'providerDashboardConsumerList',
  })

  const { isViewer } = AuthHooks.useJwt()
  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MONITORING_CONSUMERS'>()
  const { isOpen, openDrawer, closeDrawer } = useDrawerState()
  const {
    isOpen: isUpdateDailyCallsDrawerOpen,
    openDrawer: openUpdateDailyCallsDrawer,
    closeDrawer: closeUpdateDailyCallsDrawer,
  } = useDrawerState()

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination()

  const { filters, ...filtersHandlers } = useFilters<{ q: string }>([
    {
      name: 'q',
      label: tPages('searchPlaceholder'),
      type: 'freetext',
    },
  ])

  const sortByLabels: Record<SaturationSortBy, string> = {
    PERCENTAGE_ASC: tSaturation('sorting.percentageAtAsc'),
    PERCENTAGE_DESC: tSaturation('sorting.percentageAtDesc'),
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

  const { data, isPending, isFetching, isError, refetch } = useQuery({
    ...ProducerQueries.getEServiceMonitoringSaturation({
      eserviceId,
      descriptorId,
      ...paginationParams,
      q: filters.q || undefined,
      sortBy: sorting.sortBy as SaturationSortBy,
    }),
    placeholderData: keepPreviousData,
    // Handled inline below with an explicit retry instead of the route-level error boundary.
    throwOnError: false,
  })

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  const { mutate: updateVersion } = EServiceMutations.useUpdateVersion({
    isThresholdOnlyUpdate: true,
  })
  const { mutate: updateInstanceVersion } = EServiceMutations.useUpdateInstanceVersion({
    isThresholdOnlyUpdate: true,
  })

  const handleUpdateDailyCalls = (
    id: string,
    dailyCallsPerConsumer: number,
    dailyCallsTotal: number
  ) => {
    if (!descriptor) return

    const onSuccess = closeUpdateDailyCallsDrawer
    if (descriptor.templateRef) {
      updateInstanceVersion(
        {
          eserviceId: id,
          descriptorId: descriptor.id,
          dailyCallsPerConsumer,
          dailyCallsTotal,
        },
        { onSuccess }
      )
      return
    }

    updateVersion(
      {
        eserviceId: id,
        descriptorId: descriptor.id,
        voucherLifespan: descriptor.voucherLifespan,
        dailyCallsPerConsumer,
        dailyCallsTotal,
      },
      { onSuccess }
    )
  }

  const tablePagination: MIPaginationProps | undefined =
    data && data.pagination.totalCount > 0
      ? {
          page: paginationProps.page,
          onChange: (_, page) => paginationProps.onPageChange(page),
          count: getTotalPageCount(data.pagination.totalCount),
          itemsPerPageOptions: paginationProps.itemsPerPageOptions,
        }
      : undefined

  const hasSingleVersion = data && data.version === '1'
  const eserviceInformationContainerContent = hasSingleVersion ? (
    `${data?.eservice.name}, V${data?.version}`
  ) : (
    <Stack direction="row" alignItems="center">
      {`${data?.eservice.name}, V${data?.version}`}
      <MIButton onClick={openDrawer} variant="text" sx={{ mx: 2 }}>
        {t('monitoringConsumersPage.goToAnotherVersion')}
      </MIButton>
    </Stack>
  )

  const dailyCallsPerConsumerInformationContainerContent = (
    <Stack direction="row" alignItems="center">
      {data?.dailyCallsPerConsumer.toString()}
      {!isViewer && (
        <MIButton onClick={openUpdateDailyCallsDrawer} variant="text" sx={{ mx: 2 }}>
          {t('monitoringConsumersPage.editThreshold')}
        </MIButton>
      )}
    </Stack>
  )

  const dailyCallsTotalInformationContainerContent = (
    <Stack direction="row" alignItems="center">
      {data?.dailyCallsTotal.toString()}
      {!isViewer && (
        <MIButton onClick={openUpdateDailyCallsDrawer} variant="text" sx={{ mx: 2 }}>
          {t('monitoringConsumersPage.editThreshold')}
        </MIButton>
      )}
    </Stack>
  )

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      dashboardFlow
      titleAction={
        <MIButton onClick={() => {}} variant="outlined" startIcon={<UploadFileIcon />}>
          {tCommon('export')}
        </MIButton>
      }
    >
      <Stack component="dl" spacing={3} sx={{ mt: 3, mb: 6 }}>
        <InformationContainer
          label={t('monitoringConsumersPage.eservice')}
          content={
            isFetching ? (
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '200px' }} />
            ) : (
              eserviceInformationContainerContent
            )
          }
        />
        <InformationContainer
          label={t('monitoringConsumersPage.dailyCallsPerConsumer')}
          content={
            isFetching ? (
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '200px' }} />
            ) : (
              dailyCallsPerConsumerInformationContainerContent
            )
          }
        />
        <InformationContainer
          label={t('monitoringConsumersPage.customizedQuotaConsumersOnConsumers')}
          content={
            isFetching ? (
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '200px' }} />
            ) : (
              `${data?.customizedQuotaConsumers.toString()}/${data?.activeConsumers}` || '-'
            )
          }
        />
        <InformationContainer
          label={t('monitoringConsumersPage.dailyCallsTotal')}
          content={
            isFetching ? (
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '200px' }} />
            ) : (
              dailyCallsTotalInformationContainerContent
            )
          }
        />
      </Stack>
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
      <ProviderEServiceMonitoringConsumersTable
        eserviceId={eserviceId}
        descriptorId={descriptorId}
        consumersData={data}
        pagination={tablePagination}
        isLoading={isPending}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
      />
      {descriptor && (
        <EServiceVersionSelectorDrawer
          isOpen={isOpen}
          onClose={closeDrawer}
          descriptor={descriptor}
          targetRoute="PROVIDE_ESERVICE_MONITORING_CONSUMERS"
        />
      )}
      {descriptor && (
        <UpdateDailyCallsDrawer
          isOpen={isUpdateDailyCallsDrawerOpen}
          onClose={closeUpdateDailyCallsDrawer}
          id={eserviceId}
          dailyCallsPerConsumer={descriptor.dailyCallsPerConsumer}
          dailyCallsTotal={descriptor.dailyCallsTotal}
          maxCustomThreshold={
            descriptor.attributes.certified
              .flat()
              .reduce(
                (max, attribute) =>
                  attribute.dailyCallsPerConsumer !== undefined
                    ? Math.max(max, attribute.dailyCallsPerConsumer)
                    : max,
                0
              ) || undefined
          }
          versionId={descriptorId}
          subtitle={tDailyCallsDrawer('subtitle')}
          dailyCallsPerConsumerLabel={tDailyCallsDrawer('dailyCallsPerConsumerField.label')}
          dailyCallsTotalLabel={tDailyCallsDrawer('dailyCallsTotalField.label')}
          onSubmit={handleUpdateDailyCalls}
        />
      )}
    </PageContainer>
  )
}

export default ProviderEServiceMonitoringConsumersPage
