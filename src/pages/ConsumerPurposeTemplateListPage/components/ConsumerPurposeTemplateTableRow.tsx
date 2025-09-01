import type { PurposeTemplate } from '@/api/purposeTemplate/mockedResponses'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Skeleton } from '@mui/material'
import { Box } from '@mui/system'
import { TableRow } from '@pagopa/interop-fe-commons'

export const ConsumerPurposeTemplateTableRow: React.FC<{ purposeTemplate: PurposeTemplate }> = ({
  purposeTemplate,
}) => {
  //const { actions } =  useGetConsumerPurposesActions(purposeTemplate)

  return (
    <TableRow
      cellData={[
        purposeTemplate.targetTenantKind,
        purposeTemplate.purposeTitle,
        <StatusChip key={purposeTemplate.id} for="purposeTemplate" state={purposeTemplate.state} />,
      ]}
    >
      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={[]} />
      </Box>
    </TableRow>
  )
}

export const ConsumerPurposeTemplateTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        <Skeleton key={0} width={180} />,
        <Skeleton key={1} width={180} />,
        <Skeleton key={2} width={180} />,
        <StatusChipSkeleton key={3} />,
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
