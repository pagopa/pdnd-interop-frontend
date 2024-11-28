import { AgreementQueries } from '@/api/agreement'
import type { AgreementListEntry } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { Link } from '@/router'
import { Box, Chip, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ProviderAgreementsTableRow: React.FC<{ agreement: AgreementListEntry }> = ({
  agreement,
}) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('agreement', { keyPrefix: 'list' })
  const { isAdmin } = AuthHooks.useJwt()

  const isAgreementEditable = agreement.state === 'DRAFT' && isAdmin
  const queryClient = useQueryClient()

  const { actions } = useGetAgreementsActions(agreement)

  const eservice = agreement.eservice
  const descriptor = agreement.descriptor

  const isDelegatedEservice = eservice.producer.id != AuthHooks.useJwt().jwt?.organizationId

  const handlePrefetch = () => {
    queryClient.prefetchQuery(AgreementQueries.getSingle(agreement.id))
  }

  const eserviceCellData = (
    <>
      {t('eserviceName', {
        name: eservice.name,
        version: descriptor.version,
      })}{' '}
      {isDelegatedEservice && <Chip label={t('eserviceChip')} />}
    </>
  )

  return (
    <TableRow
      cellData={[
        eserviceCellData,
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
