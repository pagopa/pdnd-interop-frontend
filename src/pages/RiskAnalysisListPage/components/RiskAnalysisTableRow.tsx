import { ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { StatusChip } from '@/components/shared/StatusChip'
import { Link } from '@/router'
import { Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import type { Purpose } from '@/api/api.generatedTypes'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

export const RiskAnalysisTableRow: React.FC<{
  purpose: Purpose
}> = ({ purpose }) => {
  const { t: tCommon } = useTranslation('common')

  return (
    <TableRow
      cellData={[
        Date.now().toString(),
        purpose.eservice.name,
        purpose.eservice.producer.name,
        <StatusChip key={purpose.id} for="riskAnalysis" state={purpose.state} />,
      ]}
    >
      <Link
        as="button"
        variant="naked"
        size="small"
        to={'SUBSCRIBE_RISK_ANALYSIS_LIST'}
        /* params={{
          eserviceId: instance.id,
          descriptorId: instance.latestDescriptor.id,
        }} */
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
        <Skeleton key={2} width={180} />,
      ]}
    >
      <ActionMenuSkeleton />
    </TableRow>
  )
}
