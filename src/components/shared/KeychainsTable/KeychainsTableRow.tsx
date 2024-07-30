import type { ClientKind, CompactClient } from '@/api/api.generatedTypes'
import { ClientQueries } from '@/api/client'
import useGetClientActions from '@/hooks/useGetClientActions'
import { Link } from '@/router'
import { Box, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActionMenu, ActionMenuSkeleton } from '../ActionMenu'
import { ButtonSkeleton } from '../MUI-skeletons'

type KeychainsTableRow = {
  client: CompactClient
  clientKind: ClientKind
}

export const KeychainsTableRow: React.FC<KeychainsTableRow> = ({ client, clientKind }) => {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const prefetch = ClientQueries.usePrefetchSingle()

  const { actions } = useGetClientActions(client)

  const handlePrefetch = () => {
    prefetch(client.id)
  }

  return (
    <TableRow cellData={[client.name]}>
      <Link
        as="button"
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        to={
          clientKind === 'CONSUMER' ? 'SUBSCRIBE_CLIENT_EDIT' : 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT'
        }
        params={{ clientId: client.id }}
      >
        {t('inspect')}
      </Link>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const KeychainsTableRowSkeleton: React.FC = () => {
  return (
    <TableRow cellData={[<Skeleton key={0} width={440} />]}>
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
