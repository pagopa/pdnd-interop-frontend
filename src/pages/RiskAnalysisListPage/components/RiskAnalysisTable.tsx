import { Table } from '@pagopa/interop-fe-commons'

import { useTranslation } from 'react-i18next'
import type { Purpose } from '@/api/api.generatedTypes'
import { RiskAnalysisTableRow, RiskAnalysisTableRowSkeleton } from './RiskAnalysisTableRow'
import { useActiveTab } from '@/hooks/useActiveTab'
import { RiskAnalysisListPageTab } from '../RiskAnalysisList.page'
import type { TFunction } from 'i18next'

type RiskAnalysisTableProps = {
  purposes: Array<Purpose>
}

const getHeadLabels = (activeTab: string, tCommon: TFunction<'common', 'table.headData'>) =>
  activeTab === RiskAnalysisListPageTab.TODO
    ? [
        tCommon('assignmentDate'),
        tCommon('eserviceName'),
        tCommon('providerName'),
        tCommon('reviewersCount'),
        tCommon('status'),
        '',
      ]
    : [
        tCommon('approvalDate'),
        tCommon('eserviceName'),
        tCommon('providerName'),
        tCommon('reviewer'),
        tCommon('status'),
        '',
      ]

export const RiskAnalysisTable: React.FC<RiskAnalysisTableProps> = ({ purposes }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t: tPurpose } = useTranslation('purpose', { keyPrefix: 'riskAnalysisList' })
  const { activeTab } = useActiveTab(RiskAnalysisListPageTab.TODO)

  const headLabels = getHeadLabels(activeTab, tCommon)

  const isEmpty = !purposes || purposes.length === 0

  return (
    <Table isEmpty={isEmpty} headLabels={headLabels} noDataLabel={tPurpose('noResults.label')}>
      {purposes.map((purpose: Purpose) => (
        <RiskAnalysisTableRow key={purpose.id} purpose={purpose} />
      ))}
    </Table>
  )
}

export const RiskAnalysisTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { activeTab } = useActiveTab(RiskAnalysisListPageTab.TODO)

  const headLabels = getHeadLabels(activeTab, tCommon)

  return (
    <Table headLabels={headLabels}>
      <RiskAnalysisTableRowSkeleton />
      <RiskAnalysisTableRowSkeleton />
      <RiskAnalysisTableRowSkeleton />
      <RiskAnalysisTableRowSkeleton />
      <RiskAnalysisTableRowSkeleton />
    </Table>
  )
}
