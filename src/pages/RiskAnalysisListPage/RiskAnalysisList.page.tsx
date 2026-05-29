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
import type { GetRiskAnalysisAssignmentsParams, Purposes } from '@/api/api.generatedTypes'
import { RiskAnalysisTable, RiskAnalysisTableSkeleton } from './components/RiskAnalysisTable'
import { PurposeQueries } from '@/api/purpose'
import { EServiceQueries } from '@/api/eservice'

const RiskAnalysisListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'riskAnalysisList' })
  const { t: tPurpose } = useTranslation('purpose', { keyPrefix: 'riskAnalysisList.filters' })

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
      label: tPurpose('eserviceField.label'),
      type: 'autocomplete-multiple',
      options: eservicesOptions,
      onTextInputChange: setEServiceAutocompleteInputChange,
    },
    {
      name: 'signingState',
      label: tPurpose('riskAnalysisState.label'),
      type: 'autocomplete-single',
      options: [
        { label: tPurpose('riskAnalysisState.statusField.ASSIGNED'), value: 'ASSIGNED' },
        { label: tPurpose('riskAnalysisState.statusField.SUBMITTED'), value: 'SUBMITTED' },
      ],
    },
  ])

  const { paginationParams, paginationProps, getTotalPageCount, rowPerPageOptions } =
    usePagination()
  const queryParams = { ...paginationParams, ...filtersParams }

  const { data } = useQuery({
    ...PurposeQueries.getRiskAnalysisAssignments(queryParams),
    placeholderData: keepPreviousData,
  })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <Filters {...filtersHandlers} />
      <RiskAnalysisTableWrapper data={data} />
      <Pagination
        {...paginationProps}
        rowPerPageOptions={rowPerPageOptions}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
    </PageContainer>
  )
}

const RiskAnalysisTableWrapper: React.FC<{
  data: Purposes | undefined
}> = ({ data }) => {
  if (!data) return <RiskAnalysisTableSkeleton />
  return (
    <RiskAnalysisTable purposes={data.results ?? []} data-testid="risk-analysis-table-component" />
  )
}

export default RiskAnalysisListPage
