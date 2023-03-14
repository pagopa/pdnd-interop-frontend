import { PurposeQueries } from '@/api/purpose'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { TableRow } from '@/components/shared/Table'
import useGetProviderPurposesActions from '@/hooks/useGetProviderPurposesActions'
import { useNavigateRouter } from '@/router'
import type { PurposeListingItem } from '@/types/purpose.types'
import { Box, Button, Skeleton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ProviderPurposesTableRow: React.FC<{ purpose: PurposeListingItem }> = ({
  purpose,
}) => {
  const { navigate } = useNavigateRouter()
  const { t } = useTranslation('common')
  const prefetch = PurposeQueries.usePrefetchSingle()

  const { actions } = useGetProviderPurposesActions(purpose)

  const handleInspect = () => {
    navigate('PROVIDE_PURPOSE_DETAILS', { params: { purposeId: purpose.id } })
  }

  const handlePrefetch = () => {
    prefetch(purpose.id)
  }

  return (
    <TableRow
      cellData={[
        { label: purpose.title },
        { label: purpose.consumer.name },
        {
          custom: <StatusChip for="purpose" purpose={purpose} />,
        },
      ]}
    >
      <Button
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        onClick={handleInspect}
      >
        {t('actions.inspect')}
      </Button>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const ProviderPurposesTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        { label: <Skeleton width={180} /> },
        { label: <Skeleton width={180} /> },
        { label: <Skeleton width={180} /> },
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
