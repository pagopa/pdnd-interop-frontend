import type { Purpose } from '@/api/api.generatedTypes'
import { ClientQueries } from '@/api/client'
import { PurposeMutations } from '@/api/purpose'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { useJwt } from '@/hooks/useJwt'
import { RouterLink } from '@/router'
import type { ActionItem } from '@/types/common.types'
import { Box, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface PurposeClientsTableRowProps {
  purposeId: string
  client: Purpose['clients'][0]
}

export const PurposeClientsTableRow: React.FC<PurposeClientsTableRowProps> = ({
  purposeId,
  client,
}) => {
  const { t } = useTranslation('client')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { isAdmin } = useJwt()

  const { mutate: removeClientFromPurpose } = PurposeMutations.useRemoveClient()
  const prefetchClient = ClientQueries.usePrefetchSingle()

  const handleRemoveClientFromPurpose = () => {
    removeClientFromPurpose({ purposeId, clientId: client.id })
  }

  const actions: Array<ActionItem> = []

  if (isAdmin) {
    actions.push({
      label: t('tableClientInPurpose.actions.removeFromPurpose'),
      action: handleRemoveClientFromPurpose,
    })
  }

  const handlePrefetchClient = () => {
    prefetchClient(client.id)
  }

  return (
    <TableRow cellData={[client.name]}>
      <RouterLink
        as="button"
        to="SUBSCRIBE_CLIENT_EDIT"
        params={{ clientId: client.id }}
        onPointerEnter={handlePrefetchClient}
        onFocusVisible={handlePrefetchClient}
        variant="outlined"
        size="small"
        options={{ urlParams: { purposeId: purposeId } }}
      >
        {tCommon('inspect')}
      </RouterLink>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const PurposeClientsTableRowSkeleton: React.FC = () => {
  return (
    <TableRow cellData={[<Skeleton key={0} width={440} />]}>
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
