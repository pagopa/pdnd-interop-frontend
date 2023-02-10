import { AgreementQueries } from '@/api/agreement'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUISkeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { TableRow } from '@/components/shared/Table'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { useNavigateRouter } from '@/router'
import { AgreementListingItem } from '@/types/agreement.types'
import { Box, Button, Skeleton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ConsumerAgreementsTableRow: React.FC<{ agreement: AgreementListingItem }> = ({
  agreement,
}) => {
  const { navigate } = useNavigateRouter()
  const { t } = useTranslation('agreement', { keyPrefix: 'list' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const prefetchAgreement = AgreementQueries.usePrefetchSingle()

  const { actions } = useGetAgreementsActions(agreement)

  const eservice = agreement.eservice

  const handleEditOrInspect = () => {
    const destPath =
      agreement.state === 'DRAFT' ? 'SUBSCRIBE_AGREEMENT_EDIT' : 'SUBSCRIBE_AGREEMENT_READ'

    navigate(destPath, { params: { agreementId: agreement.id } })
  }

  const handlePrefetch = () => {
    prefetchAgreement(agreement.id)
  }

  return (
    <TableRow
      cellData={[
        {
          label: t('eserviceName', { name: eservice.name, version: eservice.version }),
        },
        { label: agreement.eservice.producer.name },
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
        onClick={handleEditOrInspect}
      >
        {tCommon(agreement.state === 'DRAFT' ? 'edit' : 'inspect')}
      </Button>

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
