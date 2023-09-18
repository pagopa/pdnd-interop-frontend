import React from 'react'
import { AgreementQueries } from '@/api/agreement'
import type { AgreementListEntry } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { Link } from '@/router'
import { Box, Skeleton, Tooltip } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import UpdateIcon from '@mui/icons-material/Update'

export const ConsumerAgreementsTableRow: React.FC<{ agreement: AgreementListEntry }> = ({
  agreement,
}) => {
  const { t } = useTranslation('agreement', { keyPrefix: 'list' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { isAdmin } = AuthHooks.useJwt()

  const prefetchAgreement = AgreementQueries.usePrefetchSingle()

  const { actions } = useGetAgreementsActions(agreement)

  const eservice = agreement.eservice
  const descriptor = agreement.descriptor

  // The `canBeUpgraded` property that comes from the BE does not take into account the
  // agreement state, we may need to ask the BE to add this check.
  // This will be solved with PIN-3973.
  const canBeUpgraded = ['ACTIVE', 'SUSPENDED'].includes(agreement.state) && agreement.canBeUpgraded
  const isAgreementEditable = isAdmin && agreement.state === 'DRAFT'

  const handlePrefetch = () => {
    prefetchAgreement(agreement.id)
  }

  return (
    <TableRow
      cellData={[
        t('eserviceName', { name: eservice.name, version: descriptor.version }),
        agreement.eservice.producer.name,
        <StatusChip key={agreement.id} for="agreement" agreement={agreement} />,
      ]}
    >
      <Tooltip open={canBeUpgraded ? undefined : false} title={t('upgradableAgreementTooltip')}>
        <Link
          as="button"
          onPointerEnter={handlePrefetch}
          onFocusVisible={handlePrefetch}
          variant="outlined"
          size="small"
          to={isAgreementEditable ? 'SUBSCRIBE_AGREEMENT_EDIT' : 'SUBSCRIBE_AGREEMENT_READ'}
          params={{ agreementId: agreement.id }}
          endIcon={canBeUpgraded ? <UpdateIcon /> : undefined}
        >
          {tCommon(isAgreementEditable ? 'edit' : 'inspect')}
        </Link>
      </Tooltip>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const ConsumerAgreementsTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        <Skeleton key={0} width={220} />,
        <Skeleton key={1} width={220} />,
        <StatusChipSkeleton key={2} />,
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
