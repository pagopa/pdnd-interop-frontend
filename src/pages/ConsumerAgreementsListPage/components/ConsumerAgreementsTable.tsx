import type { AgreementListEntry } from '@/api/api.generatedTypes'
import { AgreementQueries } from '@/api/agreement'
import { AuthHooks } from '@/api/auth'
import { ByDelegationChip } from '@/components/shared/ByDelegationChip'
import { NoItemResults } from '@/components/shared/NoItemResults/NoItemResults'
import { NotificationBadgeDot } from '@/components/shared/NotificationBadgeDot/NotificationBadgeDot'
import { StatusChip } from '@/components/shared/StatusChip'
import { PREFETCH_STALE_TIME } from '@/config/constants'
import { Link } from '@/router'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Stack, Tooltip } from '@mui/material'
import { MITable, type MITableColumn, type MIPaginationProps } from '@pagopa/mui-italia'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ConsumerAgreementsProps = {
  agreements: Array<AgreementListEntry>
  isLoading?: boolean
  pagination?: MIPaginationProps
}

export const ConsumerAgreementsTable: React.FC<ConsumerAgreementsProps> = ({
  agreements,
  isLoading = false,
  pagination,
}) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t: tActions } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('agreement', { keyPrefix: 'list' })
  const { t: tTable } = useTranslation('shared-components', { keyPrefix: 'table' })
  const { jwt, isAdmin } = AuthHooks.useJwt()
  const queryClient = useQueryClient()

  const columns: Array<MITableColumn<AgreementListEntry>> = [
    {
      id: 'eservice',
      header: tCommon('eserviceName'),
      renderCell: (agreement) => {
        const isDelegated =
          agreement.delegation &&
          (agreement.delegation.delegator.id === jwt?.organizationId ||
            agreement.delegation.delegate.id === jwt?.organizationId)

        return (
          <Stack direction="row" alignItems="center">
            {agreement.hasUnreadNotifications && <NotificationBadgeDot />}
            {t('eserviceName', {
              name: agreement.eservice.name,
              version: agreement.descriptor.version,
            })}
            {isDelegated && <ByDelegationChip delegation={agreement.delegation} />}
          </Stack>
        )
      },
    },
    {
      id: 'provider',
      header: tCommon('providerName'),
      renderCell: (agreement) => agreement.eservice.producer.name,
    },
    {
      id: 'status',
      header: tCommon('agreementStatus'),
      renderCell: (agreement) => <StatusChip for="agreement" agreement={agreement} />,
    },
    {
      id: 'details',
      header: '',
      isAction: true,
      renderCell: (agreement) => {
        const isAgreementEditable = isAdmin && agreement.state === 'DRAFT'
        const label = agreement.canBeUpgraded
          ? `${tActions(isAgreementEditable ? 'edit' : 'inspect')}. ${t('upgradableAgreementTooltip')}`
          : tActions(isAgreementEditable ? 'edit' : 'inspect')
        const handlePrefetch = () => {
          queryClient.prefetchQuery({
            ...AgreementQueries.getSingle(agreement.id),
            staleTime: PREFETCH_STALE_TIME,
          })
        }

        return (
          <Tooltip title={agreement.canBeUpgraded ? t('upgradableAgreementTooltip') : undefined}>
            <Link
              as="button"
              variant="naked"
              size="small"
              to={isAgreementEditable ? 'SUBSCRIBE_AGREEMENT_EDIT' : 'SUBSCRIBE_AGREEMENT_READ'}
              params={{ agreementId: agreement.id }}
              onPointerEnter={handlePrefetch}
              onFocusVisible={handlePrefetch}
              aria-label={label}
            >
              <ChevronRightIcon />
            </Link>
          </Tooltip>
        )
      },
    },
  ]

  if (!isLoading && agreements.length === 0) {
    return <NoItemResults>{tTable('noDataLabel')}</NoItemResults>
  }

  return (
    <MITable
      columns={columns}
      rows={agreements}
      getRowId={(agreement) => agreement.id}
      isLoading={isLoading}
      pagination={pagination}
      desktopTableProps={{ 'aria-labelledby': 'page-title' }}
      mobileTableProps={{ 'aria-labelledby': 'page-title' }}
    />
  )
}

// Check if all is correct from the removed TableRow
