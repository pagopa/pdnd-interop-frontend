import { AgreementQueries } from '@/api/agreement'
import { EServiceQueries } from '@/api/eservice'
import ActionMenu from '@/components/shared/ActionMenu'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { TableRow } from '@/components/shared/Table'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { useNavigateRouter } from '@/router'
import { AgreementSummary } from '@/types/agreement.types'
import { Box, Button, Skeleton, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ProviderAgreementsTableRow: React.FC<{ agreement: AgreementSummary }> = ({
  agreement,
}) => {
  const { navigate } = useNavigateRouter()
  const { t } = useTranslation('common')
  const prefetchAgreement = AgreementQueries.usePrefetchSingle()
  const prefetchEService = EServiceQueries.usePrefetchSingle()

  const { actions } = useGetAgreementsActions(agreement)

  const goToAgreementDetails = () => {
    navigate('PROVIDE_AGREEMENT_READ', { params: { agreementId: agreement.id } })
  }

  const handlePrefetch = () => {
    prefetchAgreement(agreement.id)
    prefetchEService(agreement.eservice.id, agreement.descriptorId)
  }

  return (
    <TableRow
      cellData={[
        { label: agreement.eservice.name },
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
        {t(`actions.${agreement.state === 'DRAFT' ? 'edit' : 'inspect'}`)}
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
      <Stack direction="row" sx={{ display: 'inline-flex' }}>
        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" width={100} height={35} />

        <Box
          sx={{
            ml: 4,
            mr: 2,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Skeleton variant="rectangular" width={4} />
        </Box>
      </Stack>
    </TableRow>
  )
}
