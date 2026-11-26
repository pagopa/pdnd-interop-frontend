import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Stack, Tooltip, Typography } from '@mui/material'
import { MITable, type MITableColumn, type MIPaginationProps } from '@pagopa/mui-italia'
import type { Purpose } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { PurposeQueries } from '@/api/purpose'
import { ByDelegationChip } from '@/components/shared/ByDelegationChip'
import { InfoTooltip } from '@/components/shared/InfoTooltip'
import { NoItemResults } from '@/components/shared/NoItemResults/NoItemResults'
import { NotificationBadgeDot } from '@/components/shared/NotificationBadgeDot/NotificationBadgeDot'
import { StatusChip } from '@/components/shared/StatusChip'
import { PREFETCH_STALE_TIME } from '@/config/constants'
import { Link } from '@/router'
import { formatHierarchyWithoutParentRoot, getRootTenantFromHierarchy } from '@/utils/tenant.utils'

type ConsumerPurposesTableProps = {
  purposes: Array<Purpose>
  isLoading: boolean
  totalCount: number
  pagination: MIPaginationProps
}

export const ConsumerPurposesTable: React.FC<ConsumerPurposesTableProps> = ({
  purposes,
  isLoading,
  totalCount,
  pagination,
}) => {
  const { t } = useTranslation('purpose')
  const { t: tCommon } = useTranslation('common')
  const { t: tHead } = useTranslation('common', { keyPrefix: 'table.headData' })
  const queryClient = useQueryClient()
  const { isAdmin, jwt } = AuthHooks.useJwt()

  const getRiskAnalysisTooltipLabel = (purpose: Purpose) => {
    // The validation outcome of the risk analysis is relevant only for purposes
    // whose current version is still a DRAFT: once the purpose is published the
    // RA is implicitly approved and the icon would be redundant.
    if (purpose.currentVersion?.state !== 'DRAFT') return undefined
    return match(purpose.reviewerWorkflow?.signingState)
      .with('SIGNED', () => t('list.riskAnalysisApproved'))
      .with('REJECTED', () => t('list.riskAnalysisRejected'))
      .otherwise(() => undefined)
  }

  const columns: Array<MITableColumn<Purpose>> = [
    {
      id: 'purpose',
      header: tHead('purposeName'),
      renderCell: (purpose) => (
        <Stack direction="row" alignItems="center">
          {purpose.hasUnreadNotifications && <NotificationBadgeDot />}
          {purpose.title}
        </Stack>
      ),
    },
    {
      id: 'eservice',
      header: tHead('eserviceName'),
      renderCell: (purpose) => {
        const isDelegated = Boolean(
          purpose.delegation &&
          (purpose.delegation.delegator.id === jwt?.organizationId ||
            purpose.delegation.delegate.id === jwt?.organizationId)
        )

        return (
          <Stack direction="row" alignItems="center">
            {purpose.eservice.name}
            {isDelegated && <ByDelegationChip delegation={purpose.delegation} />}
          </Stack>
        )
      },
    },
    {
      id: 'producer',
      header: tHead('providerName'),
      renderCell: ({ eservice: { producer } }) => {
        const rootTenantName = getRootTenantFromHierarchy(producer.parentTenants)

        return (
          <Stack spacing={0.5}>
            <span>
              {formatHierarchyWithoutParentRoot(
                { name: producer.name, subUnitType: producer.subUnitType },
                producer.parentTenants
              )}
            </span>
            {rootTenantName && (
              <Typography variant="caption" color="text.secondary">
                {rootTenantName}
              </Typography>
            )}
          </Stack>
        )
      },
    },
    {
      id: 'status',
      header: tHead('purposeStatus'),
      renderCell: (purpose) => {
        const riskAnalysisTooltipLabel = getRiskAnalysisTooltipLabel(purpose)

        return (
          <Stack direction="row" alignItems="center">
            <StatusChip for="purpose" purpose={purpose} />
            {riskAnalysisTooltipLabel && <InfoTooltip label={riskAnalysisTooltipLabel} />}
          </Stack>
        )
      },
    },
    {
      id: 'details',
      header: '',
      isAction: true,
      renderCell: (purpose) => {
        const isPurposeEditable = purpose.currentVersion?.state === 'DRAFT' && isAdmin
        const hasWaitingForApprovalVersion = Boolean(
          purpose.currentVersion && purpose.waitingForApprovalVersion
        )
        const actionLabel = tCommon(`actions.${isPurposeEditable ? 'edit' : 'inspect'}`)
        const waitingForApprovalLabel = t('list.waitingForApprovalVersionTooltip')

        const handlePrefetch = () => {
          queryClient.prefetchQuery({
            ...PurposeQueries.getSingle(purpose.id),
            staleTime: PREFETCH_STALE_TIME,
          })
        }

        return (
          <Tooltip
            open={hasWaitingForApprovalVersion ? undefined : false}
            title={waitingForApprovalLabel}
          >
            <Link
              as="button"
              variant="naked"
              size="small"
              onPointerEnter={handlePrefetch}
              onFocusVisible={handlePrefetch}
              to={isPurposeEditable ? 'SUBSCRIBE_PURPOSE_SUMMARY' : 'SUBSCRIBE_PURPOSE_DETAILS'}
              params={{ purposeId: purpose.id }}
              // The tooltip text is part of the name so screen reader users are informed
              // when the purpose has a version waiting for approval.
              aria-label={
                hasWaitingForApprovalVersion
                  ? `${actionLabel}. ${waitingForApprovalLabel}`
                  : actionLabel
              }
            >
              <ChevronRightIcon />
            </Link>
          </Tooltip>
        )
      },
    },
  ]

  if (!isLoading && totalCount === 0) {
    return <NoItemResults>{t('list.noResultsLabel')}</NoItemResults>
  }

  return (
    <MITable
      columns={columns}
      rows={purposes}
      getRowId={(purpose) => purpose.id}
      isLoading={isLoading}
      pagination={pagination}
      desktopTableProps={{ 'aria-label': t('list.tableLabel') }}
      mobileTableProps={{ 'aria-label': t('list.tableLabel') }}
    />
  )
}
