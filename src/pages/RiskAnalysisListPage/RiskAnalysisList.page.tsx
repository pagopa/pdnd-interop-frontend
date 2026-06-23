import { useTranslation } from 'react-i18next'
import { PageContainer } from '@/components/layout/containers'
import {
  useFilters,
  Filters,
  usePagination,
  Pagination,
  useAutocompleteTextInput,
} from '@pagopa/interop-fe-commons'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { GetRiskAnalysisAssignmentsParams, Purpose } from '@/api/api.generatedTypes'
import { RiskAnalysisTable, RiskAnalysisTableSkeleton } from './components/RiskAnalysisTable'
import { PurposeQueries } from '@/api/purpose'
import { EServiceQueries } from '@/api/eservice'
import { Box, Typography } from '@mui/material'

const RiskAnalysisListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'riskAnalysisList' })
  const { t: tPurpose } = useTranslation('purpose', { keyPrefix: 'riskAnalysisList' })

  const [eserviceAutocompleteText, setEServiceAutocompleteInputChange] =
    useAutocompleteTextInput('')

  const { data: eservicesOptions = [] } = useQuery({
    ...EServiceQueries.getCatalogList({ offset: 0, limit: 50, q: eserviceAutocompleteText }),
    placeholderData: keepPreviousData,
    select: ({ results }) =>
      results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetRiskAnalysisAssignmentsParams, 'limit' | 'offset'>
  >([
    {
      name: 'eservicesIds',
      label: tPurpose('filters.eserviceField.label'),
      type: 'autocomplete-multiple',
      options: eservicesOptions,
      onTextInputChange: setEServiceAutocompleteInputChange,
    },
    {
      name: 'signingStates',
      label: tPurpose('filters.riskAnalysisState.label'),
      type: 'autocomplete-single',
      options: [
        { label: tPurpose('filters.riskAnalysisState.statusField.ASSIGNED'), value: 'ASSIGNED' },
        { label: tPurpose('filters.riskAnalysisState.statusField.SUBMITTED'), value: 'SUBMITTED' },
      ],
    },
  ])

  const { paginationParams, paginationProps, getTotalPageCount, rowPerPageOptions } =
    usePagination()
  const queryParams = { ...paginationParams, ...filtersParams }

  const { data, isFetching } = useQuery({
    ...PurposeQueries.getRiskAnalysisAssignments(queryParams),
    placeholderData: keepPreviousData,
  })

  const hasActiveFilters =
    (queryParams.eservicesIds?.length ?? 0) > 0 || Boolean(queryParams.signingStates)

  const isInitialEmptyState = !!data && data.results.length === 0 && !hasActiveFilters

  return (
    <PageContainer
      title={t('title')}
      description={data?.results.length === 0 ? t('emptyDescription') : t('description')}
    >
      {isInitialEmptyState ? (
        <Box
          sx={{
            backgroundColor: 'grey.200',
            p: 2,
            mt: 5,
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              justifyContent: 'center',
              borderRadius: 1,
              display: 'flex',
              py: 2,
            }}
          >
            <Typography variant="body2" textAlign="center">
              {tPurpose('noData.label')}
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Filters {...filtersHandlers} />
          <RiskAnalysisTableWrapper purposes={data?.results ?? []} isFetching={isFetching} />
          <Pagination
            {...paginationProps}
            rowPerPageOptions={rowPerPageOptions}
            totalPages={getTotalPageCount(data?.pagination.totalCount ?? 0)}
          />
        </>
      )}
    </PageContainer>
  )
}

const RiskAnalysisTableWrapper: React.FC<{ purposes: Purpose[]; isFetching: boolean }> = ({
  purposes,
  isFetching,
}) => {
  if (isFetching && !purposes.length) return <RiskAnalysisTableSkeleton />

  return <RiskAnalysisTable purposes={purposes} />
}

export default RiskAnalysisListPage
