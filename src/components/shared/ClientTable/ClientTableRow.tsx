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
import { useQueryClient } from '@tanstack/react-query'
import { FEATURE_FLAG_ADMIN_CLIENT_API } from '@/config/env'

type ClientTableRowProps = {
  client: CompactClient
  clientKind: ClientKind
}

export const ClientTableRow: React.FC<ClientTableRowProps> = ({ client, clientKind }) => {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const queryClient = useQueryClient()

  const { actions } = useGetClientActions(client)

  const handlePrefetch = () => {
    queryClient.prefetchQuery(ClientQueries.getSingle(client.id))
  }

  return (
    <TableRow
      cellData={
        FEATURE_FLAG_ADMIN_CLIENT_API && clientKind === 'API'
          ? [client.name, client.admin?.name ?? '-']
          : [client.name]
      }
    >
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

export const ClientTableRowSkeleton: React.FC<{ clientKind: ClientKind }> = ({ clientKind }) => {
  return (
    <TableRow
      cellData={
        FEATURE_FLAG_ADMIN_CLIENT_API && clientKind === 'API'
          ? [<Skeleton key={0} width={260} />, <Skeleton key={1} width={180} />]
          : [<Skeleton key={0} width={440} />]
      }
    >
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
