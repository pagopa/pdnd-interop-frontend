import { PageContainer } from '@/components/layout/containers/PageContainer'
import ProviderSaturationRateTable from './components/ProviderSaturationRateTable'
import { InformationContainer, theme, usePagination } from '@pagopa/interop-fe-commons'
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
import { NoItemResults } from '@/components/shared/NoItemResults/NoItemResults'
import { ErrorIcon } from '@/icons/ErrorIcon'
import { Typography } from '@mui/material'
import { MIButton } from '@pagopa/mui-italia'
import UploadFileIcon from '@mui/icons-material/UploadFile'

const sortByOptions: string[] = ['PERCENTAGE_AT_ASC', 'PERCENTAGE_AT_DESC', 'NAME_ASC', 'NAME_DESC']

const ProviderSaturationRatePage: React.FC = () => {
  const { t } = useTranslation('dashboard', { keyPrefix: 'providerSaturationRatePage' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

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
    PERCENTAGE_AT_ASC: t('sorting.percentageAtAsc'),
    PERCENTAGE_AT_DESC: t('sorting.percentageAtDesc'),
    NAME_ASC: t('sorting.nameAsc'),
    NAME_DESC: t('sorting.nameDesc'),
  }

  const sorting = useSorting(
    sortByOptions.map((sortBy) => ({
      value: sortBy,
      label: sortByLabels[sortBy] ?? sortBy,
    })),
    sortByOptions[0]
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
  const { t: tShared } = useTranslation('shared-components', { keyPrefix: 'table' })
  //const { data } = useQuery(DashboardQueries.getProducerDashboardSaturation(params))
  const items = saturationItems ?? providerSaturationRateMockItems // TODO: replace with actual data from the API when available

  const isEmpty = items.length === 0 // TODO: replace with actual check when API is available

  if (isEmpty)
    return (
      <NoItemResults padding={1} borderRadius={0}>
        <Stack role="status" aria-live="polite" alignItems="center" sx={{ p: 1 }} spacing={1}>
          <ErrorIcon />
          <Stack alignItems="center">
            <Typography
              variant="body2"
              sx={{
                fontWeight: theme.typography.fontWeightMedium,
                color: theme.colors.neutral.grey[650],
              }}
            >
              {tShared('noResultsTitle')}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.colors.neutral.grey[650] }}>
              {tShared('noResultsDescription')}
            </Typography>
          </Stack>
        </Stack>
      </NoItemResults>
    )

  return <ProviderSaturationRateTable saturationItems={items} pagination={pagination} />
}

export default ProviderSaturationRatePage
