import type { Purpose, RiskAnalysisSigningState } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { PurposeQueries } from '@/api/purpose'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { InfoTooltip } from '@/components/shared/InfoTooltip'
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
import { Stack } from '@mui/material'
import { NotificationBadgeDot } from '@/components/shared/NotificationBadgeDot/NotificationBadgeDot'
import { match } from 'ts-pattern'

// TODO PIN-10135: remove this augmentation once the BE exposes
// `riskAnalysisSigningState` on the `Purpose` model in the OpenAPI spec.
type PurposeWithRiskAnalysisSigningState = Purpose & {
  riskAnalysisSigningState?: RiskAnalysisSigningState
}

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

  const riskAnalysisSigningState = (purpose as PurposeWithRiskAnalysisSigningState)
    .riskAnalysisSigningState

  // The validation outcome of the risk analysis is relevant only for purposes
  // whose current version is still a DRAFT: once the purpose is published the
  // RA is implicitly approved and the icon would be redundant.
  const isDraft = purpose.currentVersion?.state === 'DRAFT'

  const riskAnalysisTooltipLabel = isDraft
    ? match(riskAnalysisSigningState)
        .with('SIGNED', () => t('list.riskAnalysisApproved'))
        .with('REJECTED', () => t('list.riskAnalysisRejected'))
        .otherwise(() => undefined)
    : undefined

  const statusCell = (
    <Stack key={purpose.id} direction="row" alignItems="center">
      <StatusChip for="purpose" purpose={purpose} />
      {riskAnalysisTooltipLabel && <InfoTooltip label={riskAnalysisTooltipLabel} />}
    </Stack>
  )

  const purposeTitle = (
    <Stack direction="row" alignItems="center" key={0}>
      {purpose.hasUnreadNotifications && <NotificationBadgeDot />}
      {purpose.title}
    </Stack>
  )

  const eserviceCellData = (
    <>
      {purpose.eservice.name}
      {isDelegated && <ByDelegationChip tenantRole={isDelegator ? 'DELEGATOR' : 'DELEGATE'} />}
    </>
  )

  // Include the tooltip text in the aria-label when the purpose has a
  //  waiting for approval version so screen reader users are informed about that option.
  const computedAriaLabel = hasWaitingForApprovalVersion
    ? `${tCommon(`actions.${isPurposeEditable ? 'edit' : 'inspect'}`)}. ${t(
        'list.waitingForApprovalVersionTooltip'
      )}`
    : tCommon(`actions.${isPurposeEditable ? 'edit' : 'inspect'}`)

  return (
    <TableRow
      cellData={[purposeTitle, eserviceCellData, purpose.eservice.producer.name, statusCell]}
    >
      <Tooltip
        open={hasWaitingForApprovalVersion ? undefined : false}
        title={t('list.waitingForApprovalVersionTooltip')}
      >
        <Link
          as="button"
          onPointerEnter={handlePrefetch}
          onFocusVisible={handlePrefetch}
          variant="outlined"
          size="small"
          to={isPurposeEditable ? 'SUBSCRIBE_PURPOSE_SUMMARY' : 'SUBSCRIBE_PURPOSE_DETAILS'}
          endIcon={hasWaitingForApprovalVersion ? <PendingActionsIcon /> : undefined}
          params={{ purposeId: purpose.id }}
          aria-label={computedAriaLabel}
        >
          {tCommon(`actions.${isPurposeEditable ? 'edit' : 'inspect'}`)}
        </Link>
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
