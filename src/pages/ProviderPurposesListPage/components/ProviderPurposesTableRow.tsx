import type { Purpose } from '@/api/api.generatedTypes'
import { PurposeQueries } from '@/api/purpose'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import useGetProviderPurposesActions from '@/hooks/useGetProviderPurposesActions'
import { Link } from '@/router'
import { Box, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ProviderPurposesTableRow: React.FC<{ purpose: Purpose }> = ({ purpose }) => {
  const { t } = useTranslation('common')
  const prefetch = PurposeQueries.usePrefetchSingle()

  const { actions } = useGetProviderPurposesActions(purpose)

  const handlePrefetch = () => {
    prefetch(purpose.id)
  }

  return (
    <TableRow
      cellData={[
        purpose.title,
        purpose.consumer.name,
        <StatusChip key={purpose.id} for="purpose" purpose={purpose} />,
      ]}
    >
      <Link
        as="button"
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        to="PROVIDE_PURPOSE_DETAILS"
        params={{ purposeId: purpose.id }}
      >
        {t('actions.inspect')}
      </Link>

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
        <Skeleton key={0} width={180} />,
        <Skeleton key={1} width={180} />,
        <StatusChipSkeleton key={2} />,
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
