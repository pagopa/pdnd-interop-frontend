import { ClientQueries } from '@/api/client'
import useGetClientActions from '@/hooks/useGetClientActions'
import { useNavigateRouter } from '@/router'
import type { ClientKind, ClientListingItem } from '@/types/client.types'
import { Box, Button, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActionMenu, ActionMenuSkeleton } from '../ActionMenu'
import { ButtonSkeleton } from '../MUI-skeletons'

type ClientTableRow = {
  client: ClientListingItem
  clientKind: ClientKind
}

export const ClientTableRow: React.FC<ClientTableRow> = ({ client, clientKind }) => {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { navigate } = useNavigateRouter()
  const prefetch = ClientQueries.usePrefetchSingle()

  const { actions } = useGetClientActions(client)

  const handlePrefetch = () => {
    prefetch(client.id)
  }

  const handleInspect = () => {
    const path =
      clientKind === 'CONSUMER' ? 'SUBSCRIBE_CLIENT_EDIT' : 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT'

    navigate(path, { params: { clientId: client.id } })
  }

  return (
    <TableRow cellData={[client.name]}>
      <Button
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        onClick={handleInspect}
      >
        {t('inspect')}
      </Button>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const ClientTableRowSkeleton: React.FC = () => {
  return (
    <TableRow cellData={[<Skeleton key={0} width={440} />]}>
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
