import type { Purpose } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { PurposeQueries } from '@/api/purpose'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import useGetConsumerPurposesActions from '@/hooks/useGetConsumerPurposesActions'
import { Link } from '@/router'
import { Box, Skeleton, Tooltip } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import { useQueryClient } from '@tanstack/react-query'
import { ByDelegationChip } from '@/components/shared/ByDelegationChip'

export const ConsumerPurposesTableRow: React.FC<{ purpose: Purpose }> = ({ purpose }) => {
  const { t } = useTranslation('purpose')
  const { t: tCommon } = useTranslation('common')
  const queryClient = useQueryClient()
  const { isAdmin, jwt } = AuthHooks.useJwt()

  const { actions } = useGetConsumerPurposesActions(purpose)

  const isPurposeEditable = purpose?.currentVersion?.state === 'DRAFT' && isAdmin
  const hasWaitingForApprovalVersion = !!(
    purpose.currentVersion && purpose.waitingForApprovalVersion
  )

  const handlePrefetch = () => {
    queryClient.prefetchQuery(PurposeQueries.getSingle(purpose.id))
  }

  const isDelegator = Boolean(
    purpose.delegation && purpose.delegation?.delegator.id === jwt?.organizationId
  )
  const isDelegate = Boolean(
    purpose.delegation && purpose.delegation?.delegate.id === jwt?.organizationId
  )

  const isDelegated = isDelegate || isDelegator

  const eserviceCellData = (
    <>
      {purpose.eservice.name}
      {isDelegated && <ByDelegationChip tenantRole={isDelegator ? 'DELEGATOR' : 'DELEGATE'} />}
    </>
  )

  return (
    <TableRow
      cellData={[
        purpose.title,
        eserviceCellData,
        purpose.eservice.producer.name,
        <StatusChip key={purpose.id} for="purpose" purpose={purpose} />,
      ]}
    >
      <Tooltip
        open={hasWaitingForApprovalVersion ? undefined : false}
        title={t('list.waitingForApprovalVersionTooltip')}
      >
        <span tabIndex={hasWaitingForApprovalVersion ? 0 : undefined}>
          <Link
            as="button"
            onPointerEnter={handlePrefetch}
            onFocusVisible={handlePrefetch}
            variant="outlined"
            size="small"
            to={isPurposeEditable ? 'SUBSCRIBE_PURPOSE_SUMMARY' : 'SUBSCRIBE_PURPOSE_DETAILS'}
            endIcon={hasWaitingForApprovalVersion ? <PendingActionsIcon /> : undefined}
            params={{ purposeId: purpose.id }}
          >
            {tCommon(`actions.${isPurposeEditable ? 'edit' : 'inspect'}`)}
          </Link>
        </span>
      </Tooltip>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const ConsumerPurposesTableRowSkeleton: React.FC = () => {
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
