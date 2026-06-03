import { Table } from '@pagopa/interop-fe-commons'

import { useTranslation } from 'react-i18next'
import type { Purpose } from '@/api/api.generatedTypes'
import { RiskAnalysisTableRow, RiskAnalysisTableRowSkeleton } from './RiskAnalysisTableRow'

type RiskAnalysisTableProps = {
  purposes: Array<Purpose>
}

export const RiskAnalysisTable: React.FC<RiskAnalysisTableProps> = ({ purposes }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t: tPurpose } = useTranslation('purpose', { keyPrefix: 'riskAnalysisList' })

  const headLabels = [
    tCommon('assignmentDate'),
    tCommon('eserviceName'),
    tCommon('providerName'),
    tCommon('status'),
    '',
  ]

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

  const headLabels = [
    tCommon('assignmentDate'),
    tCommon('eserviceName'),
    tCommon('providerName'),
    tCommon('status'),
    '',
  ]

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
