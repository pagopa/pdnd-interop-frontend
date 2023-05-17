import type { Purpose } from '@/api/api.generatedTypes'
import { PurposeQueries } from '@/api/purpose'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import useGetConsumerPurposesActions from '@/hooks/useGetConsumerPurposesActions'
import { useJwt } from '@/hooks/useJwt'
import { useNavigate } from '@/router'
import { Box, Button, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ConsumerPurposesTableRow: React.FC<{ purpose: Purpose }> = ({ purpose }) => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const prefetch = PurposeQueries.usePrefetchSingle()
  const { isAdmin } = useJwt()

  const { actions } = useGetConsumerPurposesActions(purpose)

  const isPurposeEditable = purpose?.currentVersion?.state === 'DRAFT' && isAdmin

  const goToEditOrInspectPurpose = () => {
    const path = isPurposeEditable ? 'SUBSCRIBE_PURPOSE_EDIT' : 'SUBSCRIBE_PURPOSE_DETAILS'
    navigate(path, { params: { purposeId: purpose.id } })
  }

  const handlePrefetch = () => {
    prefetch(purpose.id)
  }

  return (
    <TableRow
      cellData={[
        purpose.title,
        purpose.eservice.name,
        purpose.eservice.producer.name,
        <StatusChip key={purpose.id} for="purpose" purpose={purpose} />,
      ]}
    >
      <Button
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        onClick={goToEditOrInspectPurpose}
      >
        {t(`actions.${isPurposeEditable ? 'edit' : 'inspect'}`)}
      </Button>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const ConsumerPurposesTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        <Skeleton key={0} width={180} />,
        <Skeleton key={1} width={180} />,
        <Skeleton key={2} width={180} />,
        <StatusChipSkeleton key={3} />,
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
