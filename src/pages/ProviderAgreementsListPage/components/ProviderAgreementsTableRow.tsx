import { AgreementQueries } from '@/api/agreement'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { useJwt } from '@/hooks/useJwt'
import { useNavigateRouter } from '@/router'
import type { AgreementListingItem } from '@/types/agreement.types'
import { Box, Button, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ProviderAgreementsTableRow: React.FC<{ agreement: AgreementListingItem }> = ({
  agreement,
}) => {
  const { navigate } = useNavigateRouter()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('agreement', { keyPrefix: 'list' })
  const { isAdmin } = useJwt()

  const isAgreementEditable = agreement.state === 'DRAFT' && isAdmin
  const prefetchAgreement = AgreementQueries.usePrefetchSingle()

  const { actions } = useGetAgreementsActions(agreement)

  const eservice = agreement.eservice
  const descriptor = agreement.descriptor

  const goToAgreementDetails = () => {
    navigate('PROVIDE_AGREEMENT_READ', { params: { agreementId: agreement.id } })
  }

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
      <Button
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        onClick={goToAgreementDetails}
      >
        {tCommon(isAgreementEditable ? 'edit' : 'inspect')}
      </Button>

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
