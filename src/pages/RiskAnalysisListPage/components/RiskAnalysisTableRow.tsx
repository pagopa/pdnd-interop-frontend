import { ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Link } from '@/router'
import { Skeleton, Stack, Typography } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import type { Purpose } from '@/api/api.generatedTypes'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useTranslation } from 'react-i18next'
import isToday from 'date-fns/isToday'
import { match, P } from 'ts-pattern'
import { useActiveTab } from '@/hooks/useActiveTab'
import { RiskAnalysisListPageTab } from '../RiskAnalysisList.page'
import { NotificationBadgeDot } from '@/components/shared/NotificationBadgeDot/NotificationBadgeDot'

export const RiskAnalysisTableRow: React.FC<{
  purpose: Purpose
}> = ({ purpose }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisList' })
  const { activeTab } = useActiveTab(RiskAnalysisListPageTab.TODO)

  const sentDate = purpose.reviewerWorkflow?.sentToReviewerAt
    ? new Date(purpose.reviewerWorkflow.sentToReviewerAt)
    : null

  const formattedDate = sentDate
    ? sentDate.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : ''

  const cellData = [
    <Stack direction="row" alignItems="center" key="date">
      {purpose.hasUnreadNotifications && <NotificationBadgeDot />}
      <Typography variant="body2" fontWeight={600}>
        {sentDate && isToday(sentDate) ? t('today.label') : formattedDate}
      </Typography>
    </Stack>,
    purpose.eservice.name,
    purpose.eservice.producer.name,
    activeTab === RiskAnalysisListPageTab.TODO
      ? String(purpose.reviewerWorkflow?.reviewerIds?.length ?? '-')
      : 'reviewer_name_placeholder' /* @TODO - add the reviewer name (the one who signed or rejected the RA) */,
    purpose.reviewerWorkflow?.signingState
      ? match(purpose.reviewerWorkflow.signingState)
          .with(P.union('ASSIGNED', 'SUBMITTED', 'SIGNED', 'REJECTED'), (state) => (
            <StatusChip for="riskAnalysisList" state={state} />
          ))
          .with('DRAFT', () => '')
          .exhaustive()
      : '',
  ]

  const redirectPath = match(purpose.reviewerWorkflow?.signingState)
    .with('ASSIGNED', () => 'SUBSCRIBE_RISK_ANALYSIS_INFO_COMPILE' as const)
    .with('SUBMITTED', () => 'SUBSCRIBE_RISK_ANALYSIS_APPROVAL' as const)
    .with('SIGNED', () => null) /* Will be developed in PIN-10694 */
    .with('REJECTED', () => null) /* Will be developed in PIN-10694 */
    .otherwise(() => null)

  return (
    <TableRow cellData={cellData}>
      {redirectPath && (
        <Link
          as="button"
          variant="naked"
          size="small"
          to={redirectPath}
          params={{
            purposeId: purpose.id,
          }}
        >
          <ChevronRightIcon />
        </Link>
      )}
    </TableRow>
  )
}

export const RiskAnalysisTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        <Skeleton key={0} width={180} />,
        <Skeleton key={1} width={180} />,
        <Skeleton key={2} width={180} />,
        <Skeleton key={3} width={180} />,
        <StatusChipSkeleton key={4} />,
      ]}
    >
      <ActionMenuSkeleton />
    </TableRow>
  )
}
