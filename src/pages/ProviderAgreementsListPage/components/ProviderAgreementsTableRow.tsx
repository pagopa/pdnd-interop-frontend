import { AgreementQueries } from '@/api/agreement'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUISkeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { TableRow } from '@/components/shared/Table'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { useNavigateRouter } from '@/router'
import type { AgreementListingItem } from '@/types/agreement.types'
import { Box, Button, Skeleton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ProviderAgreementsTableRow: React.FC<{ agreement: AgreementListingItem }> = ({
  agreement,
}) => {
  const { navigate } = useNavigateRouter()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('agreement', { keyPrefix: 'list' })
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
        { label: t('eserviceName', { name: eservice.name, version: descriptor.version }) },
        { label: agreement.consumer.name },
        {
          custom: <StatusChip for="agreement" agreement={agreement} />,
        },
      ]}
    >
      <Button
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        onClick={goToAgreementDetails}
      >
        {tCommon(agreement.state === 'DRAFT' ? 'edit' : 'inspect')}
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
        { label: <Skeleton width={220} /> },
        { label: <Skeleton width={220} /> },
        {
          custom: <StatusChipSkeleton />,
        },
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
