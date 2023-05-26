import { AgreementQueries } from '@/api/agreement'
import type { AgreementListEntry } from '@/api/api.generatedTypes'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { useJwt } from '@/hooks/useJwt'
import { Link } from '@/router'
import { Box, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ProviderAgreementsTableRow: React.FC<{ agreement: AgreementListEntry }> = ({
  agreement,
}) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('agreement', { keyPrefix: 'list' })
  const { isAdmin } = useJwt()

  const isAgreementEditable = agreement.state === 'DRAFT' && isAdmin
  const prefetchAgreement = AgreementQueries.usePrefetchSingle()

  const { actions } = useGetAgreementsActions(agreement)

  const eservice = agreement.eservice
  const descriptor = agreement.descriptor

  const handlePrefetch = () => {
    prefetchAgreement(agreement.id)
  }

  return (
    <TableRow
      cellData={[
        t('eserviceName', { name: eservice.name, version: descriptor.version }),
        agreement.consumer.name,
        <StatusChip key={agreement.id} for="agreement" agreement={agreement} />,
      ]}
    >
      <Link
        as="button"
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        to="PROVIDE_AGREEMENT_READ"
        params={{ agreementId: agreement.id }}
      >
        {tCommon(isAgreementEditable ? 'edit' : 'inspect')}
      </Link>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const ProviderAgreementsTableRowSkeleton: React.FC = () => {
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
