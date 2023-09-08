import type { Purpose } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { PurposeQueries } from '@/api/purpose'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import useGetConsumerPurposesActions from '@/hooks/useGetConsumerPurposesActions'
import { Link } from '@/router'
import { Box, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ConsumerPurposesTableRow: React.FC<{ purpose: Purpose }> = ({ purpose }) => {
  const { t } = useTranslation('common')
  const prefetch = PurposeQueries.usePrefetchSingle()
  const { isAdmin } = AuthHooks.useJwt()

  const { actions } = useGetConsumerPurposesActions(purpose)

  const isPurposeEditable = purpose?.currentVersion?.state === 'DRAFT' && isAdmin

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
      <Link
        as="button"
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        to={isPurposeEditable ? 'SUBSCRIBE_PURPOSE_EDIT' : 'SUBSCRIBE_PURPOSE_DETAILS'}
        params={{ purposeId: purpose.id }}
      >
        {t(`actions.${isPurposeEditable ? 'edit' : 'inspect'}`)}
      </Link>

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
