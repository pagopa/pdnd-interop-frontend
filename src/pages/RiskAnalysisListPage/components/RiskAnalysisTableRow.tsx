import { ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { StatusChip } from '@/components/shared/StatusChip'
import { Link } from '@/router'
import { Skeleton, Typography } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import type { Purpose } from '@/api/api.generatedTypes'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useTranslation } from 'react-i18next'
import isToday from 'date-fns/isToday'

export const RiskAnalysisTableRow: React.FC<{
  purpose: Purpose
}> = ({ purpose }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisList' })

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

  return (
    <TableRow
      cellData={[
        sentDate && isToday(sentDate) ? (
          <Typography variant="body2" fontWeight={600}>
            {t('today.label')}
          </Typography>
        ) : (
          <Typography variant="body2" fontWeight={600}>
            {formattedDate}
          </Typography>
        ),
        purpose.eservice.name,
        purpose.eservice.producer.name,
        purpose.reviewerWorkflow?.signingState ? (
          <StatusChip
            for="riskAnalysisList"
            state={purpose.reviewerWorkflow.signingState as 'ASSIGNED' | 'SUBMITTED'}
          />
        ) : (
          ''
        ),
      ]}
    >
      <Link
        as="button"
        variant="naked"
        size="small"
        to={
          purpose.reviewerWorkflow?.signingState === 'ASSIGNED'
            ? 'SUBSCRIBE_RISK_ANALYSIS_INFO_COMPILE'
            : 'SUBSCRIBE_RISK_ANALYSIS_APPROVAL'
        }
        params={{
          purposeId: purpose.id,
        }}
      >
        <ChevronRightIcon />
      </Link>
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
      ]}
    >
      <ActionMenuSkeleton />
    </TableRow>
  )
}
