import { PageContainer } from '@/components/layout/containers/PageContainer'
import ProviderSaturationRateTable from './components/ProviderSaturationRateTable'
import { InformationContainer, usePagination } from '@pagopa/interop-fe-commons'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type {
  GetProducerDashboardSaturationParams,
  ProducerDashboardSaturationItem,
} from '@/api/api.generatedTypes'
import { useTranslation } from 'react-i18next'
import { useFilters } from '@/hooks/useFilters'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import type { MIPaginationProps } from '@pagopa/mui-italia'
import { useSorting } from '@/hooks/useSorting'
import { Stack } from '@mui/system'
import { DashboardQueries } from '@/api/dashboard'
import { providerSaturationRateMockItems } from './providerSaturationRate.mock'

const sortByOptions: string[] = ['PERCENTAGE_AT_ASC', 'PERCENTAGE_AT_DESC', 'NAME_ASC', 'NAME_DESC']

const ProviderSaturationRatePage: React.FC = () => {
  const { t } = useTranslation('dashboard', { keyPrefix: 'providerSaturationRatePage' })

  const { paginationParams, paginationProps, getTotalPageCount, rowPerPageOptions } =
    usePagination()

  const { filters, ...filtersHandlers } = useFilters<
    Omit<GetProducerDashboardSaturationParams, 'limit' | 'offset'>
  >([
    {
      name: 'q',
      label: t('filters.label'),
      type: 'freetext',
    },
  ])

  const sortByLabels: Record<string, string> = {
    PERCENTAGE_AT_DESC: t('sorting.percentageAtDesc'),
    PERCENTAGE_AT_ASC: t('sorting.percentageAtAsc'),
    NAME_ASC: t('sorting.nameAsc'),
    NAME_DESC: t('sorting.nameDesc'),
  }

  const sorting = useSorting(
    sortByOptions.map((sortBy) => ({
      value: sortBy,
      label: sortByLabels[sortBy] ?? sortBy,
    })),
    sortByOptions[1]
  )

  const queryParams = { ...paginationParams, q: filters.q || undefined }

  // const { data: totalPageCount = 0 } = useQuery({
  //   ...DashboardQueries.getProducerDashboardSaturation(queryParams),
  //   placeholderData: keepPreviousData,
  //   select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  // })

  const tablePagination: MIPaginationProps = {
    page: paginationProps.pageNum,
    onChange: (_, page) => paginationProps.onPageChange(page),
    count: 0, // TODO: replace with actual total page count when API is available
    itemsPerPageOptions: rowPerPageOptions,
  }

  //const { data } = useQuery(DashboardQueries.getProducerDashboardSaturation(queryParams))
  const saturationItems = providerSaturationRateMockItems // TODO: replace with actual data from the API when available

  return (
    <PageContainer title={t('title')} description={t('description')} dashboardFlow>
      <Stack spacing={2} sx={{ pt: 3, pb: 6 }}>
        <InformationContainer
          label={t('eserviceOverThreshold')}
          //content={data?.summary.overThreshold?.toString() ?? '-'}
          content={'19'} // TODO: remove when API is available
        />
        <InformationContainer
          label={t('eserviceNearThreshold')}
          //content={providerSaturationRateMockItems.summary.nearThreshold?.toString() ?? '-'}
          content={'10'} // TODO: remove when API is available
        />
        <InformationContainer
          label={t('totalEservices')}
          //content={providerSaturationRateMockItems.summary.total?.toString() ?? '-'}
          content={'29'} // TODO: remove when API is available
        />
      </Stack>
      <FiltersSection
        filters={filters}
        {...filtersHandlers}
        sorting={sorting}
        submitButtonVariant="outlined"
      />
      <ProviderSaturationRateTableWrapper
        saturationItems={saturationItems}
        pagination={tablePagination}
      />
    </PageContainer>
  )
}

const ProviderSaturationRateTableWrapper: React.FC<{
  saturationItems?: Array<ProducerDashboardSaturationItem>
  pagination: MIPaginationProps
}> = ({ pagination, saturationItems }) => {
  //const { data } = useQuery(DashboardQueries.getProducerDashboardSaturation(params))
  const items = saturationItems ?? providerSaturationRateMockItems // TODO: replace with actual data from the API when available

  return <ProviderSaturationRateTable saturationItems={items} pagination={pagination} />
}

export default ProviderSaturationRatePage
