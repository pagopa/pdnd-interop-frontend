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
import type {
  GetRiskAnalysisAssignmentsParams,
  RiskAnalysisSigningState,
} from '@/api/api.generatedTypes'
import { RiskAnalysisTable, RiskAnalysisTableSkeleton } from './components/RiskAnalysisTable'
import { PurposeQueries } from '@/api/purpose'
import { EServiceQueries } from '@/api/eservice'
import { Tab, Typography } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import { NoItemResults } from '@/components/shared/NoItemResults/NoItemResults'
import { Box } from '@mui/material'

export const RiskAnalysisListPageTab = {
  TODO: 'todo',
  DONE: 'done',
}

const RiskAnalysisListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'riskAnalysisList' })
  const { t: tPurpose } = useTranslation('purpose', { keyPrefix: 'riskAnalysisList' })
  const { activeTab, updateActiveTab } = useActiveTab(RiskAnalysisListPageTab.TODO)

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
      options:
        activeTab === RiskAnalysisListPageTab.TODO
          ? [
              {
                label: tPurpose('filters.riskAnalysisState.statusField.ASSIGNED'),
                value: 'ASSIGNED',
              },
              {
                label: tPurpose('filters.riskAnalysisState.statusField.SUBMITTED'),
                value: 'SUBMITTED',
              },
            ]
          : [
              {
                label: tPurpose('filters.riskAnalysisState.statusField.SIGNED'),
                value: 'SIGNED',
              },
              {
                label: tPurpose('filters.riskAnalysisState.statusField.REJECTED'),
                value: 'REJECTED',
              },
            ],
    },
  ])

  const { paginationParams, paginationProps, getTotalPageCount, rowPerPageOptions } =
    usePagination()

  const defaultSigningStates: RiskAnalysisSigningState[] =
    activeTab === RiskAnalysisListPageTab.TODO ? ['ASSIGNED', 'SUBMITTED'] : ['SIGNED', 'REJECTED']

  const queryParams = {
    ...paginationParams,
    ...filtersParams,
    signingStates: filtersParams.signingStates ?? defaultSigningStates,
  }

  const { data: allRiskAnalysisAssignments } = useQuery({
    ...PurposeQueries.getRiskAnalysisAssignments({
      offset: 0,
      limit: 1,
    }),
    placeholderData: keepPreviousData,
  })

  const { data: totalPageCount = 0 } = useQuery({
    ...PurposeQueries.getRiskAnalysisAssignments(queryParams),
    placeholderData: keepPreviousData,
    select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  })

  const hasActiveFilters =
    (filtersParams.eservicesIds?.length ?? 0) > 0 || Boolean(filtersParams.signingStates)

  const isInitialEmptyState =
    !!allRiskAnalysisAssignments &&
    allRiskAnalysisAssignments.results.length === 0 &&
    !hasActiveFilters

  const emptyTabLabel =
    activeTab === RiskAnalysisListPageTab.TODO ? tPurpose('emptyTodo') : tPurpose('emptyDone')

  return (
    <PageContainer title={t('title')} description={t('description')}>
      {isInitialEmptyState ? (
        <Box mt={5}>
          <NoItemResults padding={2}>
            <Typography variant="body2" textAlign="center">
              {tPurpose('noData.label')}
            </Typography>
          </NoItemResults>
        </Box>
      ) : (
        <>
          <TabContext value={activeTab}>
            <TabList
              sx={{ mt: 4 }}
              onChange={updateActiveTab}
              aria-label={tPurpose('tabs.ariaLabel')}
              variant="fullWidth"
            >
              <Tab label={tPurpose('tabs.todo')} value={RiskAnalysisListPageTab.TODO} />
              <Tab label={tPurpose('tabs.done')} value={RiskAnalysisListPageTab.DONE} />
            </TabList>
            <TabPanel value={activeTab}>
              <Filters key={activeTab} {...filtersHandlers} />
              <RiskAnalysisTableWrapper
                params={queryParams}
                hasActiveFilters={hasActiveFilters}
                emptyLabel={emptyTabLabel}
              />
              <Pagination
                {...paginationProps}
                rowPerPageOptions={rowPerPageOptions}
                totalPages={totalPageCount}
              />
            </TabPanel>
          </TabContext>
        </>
      )}
    </PageContainer>
  )
}

const RiskAnalysisTableWrapper: React.FC<{
  params: GetRiskAnalysisAssignmentsParams
  hasActiveFilters: boolean
  emptyLabel: string
}> = ({ params, hasActiveFilters, emptyLabel }) => {
  const { data, isFetching } = useQuery(PurposeQueries.getRiskAnalysisAssignments(params))

  if (!data && isFetching) return <RiskAnalysisTableSkeleton />

  if (data?.results.length === 0 && !hasActiveFilters) {
    return (
      <NoItemResults padding={2}>
        <Typography variant="body2" textAlign="center">
          {emptyLabel}
        </Typography>
      </NoItemResults>
    )
  }

  return <RiskAnalysisTable purposes={data?.results ?? []} />
}

export default RiskAnalysisListPage
