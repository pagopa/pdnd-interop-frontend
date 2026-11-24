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
import { Stack, Tooltip, Typography, type TypographyProps } from '@mui/material'
import { MITable, type MITableColumn, type MIPaginationProps } from '@pagopa/mui-italia'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatHierarchyWithoutParentRoot, getRootTenantFromHierarchy } from '@/utils/tenant.utils'

type ConsumerAgreementsProps = {
  agreements: Array<AgreementListEntry>
  isLoading?: boolean
  pagination?: MIPaginationProps
}

const TruncatedText: React.FC<
  Pick<TypographyProps, 'variant' | 'color'> & { children: string | undefined }
> = ({ children, variant, color }) => {
  const [isTruncated, setIsTruncated] = React.useState(false)

  // Check if the text is truncated so it can show the tooltip
  const checkOverflow = (event: React.SyntheticEvent<HTMLElement>) => {
    const element = event.currentTarget
    setIsTruncated(element.scrollWidth > element.clientWidth)
  }

  return (
    <Tooltip title={isTruncated ? children : ''} describeChild arrow placement="top">
      <Typography
        variant={variant}
        color={color}
        noWrap
        tabIndex={children ? 0 : undefined}
        onMouseEnter={checkOverflow}
        onFocus={checkOverflow}
        onTouchStart={checkOverflow}
      >
        {children}
      </Typography>
    </Tooltip>
  )
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
          <Stack direction="row" alignItems="center" sx={{ maxWidth: '23.5rem' }}>
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
      renderCell: (agreement) => {
        const providerName = formatHierarchyWithoutParentRoot(
          agreement.eservice.producer,
          agreement.eservice.producer.parentTenants
        )
        const rootName = getRootTenantFromHierarchy(agreement.eservice.producer.parentTenants)

        return (
          <Stack spacing={0.5} sx={{ maxWidth: '13.625rem' }}>
            <TruncatedText variant="body2">{providerName}</TruncatedText>
            <TruncatedText variant="caption" color="text.secondary">
              {rootName}
            </TruncatedText>
          </Stack>
        )
      },
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
