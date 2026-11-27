import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Stack, Tooltip, Typography } from '@mui/material'
import { MITable, type MITableColumn, type MIPaginationProps } from '@pagopa/mui-italia'
import type { Purpose } from '@/api/api.generatedTypes'
import { PurposeQueries } from '@/api/purpose'
import { NoItemResults } from '@/components/shared/NoItemResults/NoItemResults'
import { NotificationBadgeDot } from '@/components/shared/NotificationBadgeDot/NotificationBadgeDot'
import { StatusChip } from '@/components/shared/StatusChip'
import { PREFETCH_STALE_TIME } from '@/config/constants'
import { Link } from '@/router'
import { formatHierarchyWithoutParentRoot, getRootTenantFromHierarchy } from '@/utils/tenant.utils'
import { ErrorIconNext } from '@/icons/ErrorIconNext/ErrorIconNext'

type ProviderPurposesTableProps = {
  purposes: Array<Purpose>
  isLoading: boolean
  totalCount: number
  pagination: MIPaginationProps
}

export const ProviderPurposesTable: React.FC<ProviderPurposesTableProps> = ({
  purposes,
  isLoading,
  totalCount,
  pagination,
}) => {
  const { t: tHead } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('purpose', { keyPrefix: 'list' })
  const queryClient = useQueryClient()

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
      id: 'consumer',
      header: tHead('subscriberName'),
      renderCell: ({ consumer }) => {
        const rootTenantName = getRootTenantFromHierarchy(consumer.parentTenants)

        return (
          <Stack spacing={0.5}>
            <span>
              {formatHierarchyWithoutParentRoot(
                { name: consumer.name, subUnitType: consumer.subUnitType },
                consumer.parentTenants
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
        const hasWaitingForApprovalVersion =
          purpose.currentVersion && purpose.waitingForApprovalVersion
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <StatusChip for="purpose" purpose={purpose} />
            {hasWaitingForApprovalVersion && (
              <Tooltip arrow title={t('newVersionAvailableTooltip')}>
                <ErrorIconNext />
              </Tooltip>
            )}
          </Stack>
        )
      },
    },
    {
      id: 'details',
      header: '',
      isAction: true,
      renderCell: (purpose) => {
        const handlePrefetch = () => {
          queryClient.prefetchQuery({
            ...PurposeQueries.getSingle(purpose.id),
            staleTime: PREFETCH_STALE_TIME,
          })
        }

        return (
          <Link
            as="button"
            variant="naked"
            size="small"
            onPointerEnter={handlePrefetch}
            onFocusVisible={handlePrefetch}
            to="PROVIDE_PURPOSE_DETAILS"
            params={{ purposeId: purpose.id }}
            aria-label={tCommon('actions.inspect')}
          >
            <ChevronRightIcon />
          </Link>
        )
      },
    },
  ]

  if (!isLoading && totalCount === 0) {
    return <NoItemResults>{t('noResultsLabel')}</NoItemResults>
  }

  return (
    <MITable
      columns={columns}
      rows={purposes}
      getRowId={(purpose) => purpose.id}
      isLoading={isLoading}
      pagination={pagination}
      desktopTableProps={{ 'aria-label': t('providerTableLabel') }}
      mobileTableProps={{ 'aria-label': t('providerTableLabel') }}
    />
  )
}
