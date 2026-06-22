import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Link } from '@/router'
import { Skeleton } from '@mui/material'
import { Box } from '@mui/system'
import { TableRow } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import type { CreatorPurposeTemplate } from '@/api/api.generatedTypes'
import useGetConsumerPurposeTemplateTemplatesActions from '@/hooks/useGetConsumerPurposeTemplatesActions'
import { TenantHooks } from '@/api/tenant'
import { AuthHooks } from '@/api/auth'
import { match } from 'ts-pattern'

export const ConsumerPurposeTemplateTableRow: React.FC<{
  purposeTemplate: CreatorPurposeTemplate
}> = ({ purposeTemplate }) => {
  const { data: tenant } = TenantHooks.useGetActiveUserParty()
  const { actions } = useGetConsumerPurposeTemplateTemplatesActions(tenant.kind!, purposeTemplate)
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'list.filters.targetTenantKindField.values',
  })

  const { isViewer } = AuthHooks.useJwt()

  const isPA = Boolean(purposeTemplate.targetTenantKind === 'PA')
  const isDraft = purposeTemplate.state === 'DRAFT'

  // A viewer cannot reach the draft edit route: route them to the read-only summary instead.
  const linkTo = match({ isDraft, isViewer })
    .with({ isDraft: true, isViewer: false }, () => 'SUBSCRIBE_PURPOSE_TEMPLATE_EDIT' as const)
    .with({ isDraft: true, isViewer: true }, () => 'SUBSCRIBE_PURPOSE_TEMPLATE_SUMMARY' as const)
    .otherwise(() => 'SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS' as const)

  return (
    <TableRow
      cellData={[
        isPA ? t('labelPA') : t('labelNotPA'),
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
        to={linkTo}
        params={{ purposeTemplateId: purposeTemplate.id }}
      >
        {tCommon(`actions.${isDraft && !isViewer ? 'manageDraft' : 'inspect'}`)}
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
