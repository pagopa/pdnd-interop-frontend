import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import useGetConsumerPurposeTemplatesActions from '@/hooks/useGetConsumerPurposeTemplatesActions'
import { Link } from '@/router'
import { Skeleton } from '@mui/material'
import { Box } from '@mui/system'
import { TableRow } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import type { CreatorPurposeTemplate } from '@/api/api.generatedTypes'

export const ConsumerPurposeTemplateTableRow: React.FC<{
  purposeTemplate: CreatorPurposeTemplate
}> = ({ purposeTemplate }) => {
  const { actions } = useGetConsumerPurposeTemplatesActions(
    purposeTemplate.targetTenantKind,
    purposeTemplate
  )
  const { t: tCommon } = useTranslation('common')

  return (
    <TableRow
      cellData={[
        purposeTemplate.targetTenantKind,
        purposeTemplate.purposeTitle,
        <StatusChip key={purposeTemplate.id} for="purposeTemplate" state={purposeTemplate.state} />,
      ]}
    >
      <Link
        as="button"
        onPointerEnter={() => {}}
        onFocusVisible={() => {}}
        variant="outlined"
        size="small"
        to="NOT_FOUND" //{purposeTemplate.state === 'DRAFT' ? 'SUBCRIBE_PURPOSE_TEMPLATE_EDIT' : 'SUBCRIBE_PURPOSE_TEMPLATE_DETAILS'}
        // TODO: TO COMMENT OUT WHEN THE PAGE WILL BE READY
        //params={{ delegationId: delegation.id }}
      >
        {tCommon(`actions.${purposeTemplate.state === 'DRAFT' ? 'manageDraft' : 'inspect'}`)}
      </Link>
      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
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
