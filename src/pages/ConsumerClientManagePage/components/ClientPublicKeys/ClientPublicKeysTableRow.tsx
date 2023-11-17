import { ClientQueries } from '@/api/client'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { Link } from '@/router'
import { formatDateString } from '@/utils/format.utils'
import { Box, Skeleton, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import useGetKeyActions from '@/hooks/useGetKeyActions'
import { TableRow } from '@pagopa/interop-fe-commons'
import type { PublicKey } from '@/api/api.generatedTypes'

interface ClientPublicKeysTableRowProps {
  publicKey: PublicKey
  clientId: string
}

export const ClientPublicKeysTableRow: React.FC<ClientPublicKeysTableRowProps> = ({
  publicKey,
  clientId,
}) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('key')
  const clientKind = useClientKind()
  const prefetchKey = ClientQueries.usePrefetchSingleKey()

  const kid = publicKey.keyId

  const { actions } = useGetKeyActions(clientId, kid)

  const inspectRouteKey =
    clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M_CLIENT_KEY_EDIT' : 'SUBSCRIBE_CLIENT_KEY_EDIT'

  const handlePrefetchKey = () => {
    prefetchKey(clientId, kid)
  }

  const color = publicKey.isOrphan ? 'error' : 'primary'

  return (
    <TableRow
      cellData={[
        <>
          {publicKey.name}{' '}
          {publicKey.isOrphan && (
            <Tooltip title={t('tableKey.operatorDeletedWarning.message')}>
              <ReportGmailerrorredIcon sx={{ ml: 0.75, fontSize: 16 }} color={color} />
            </Tooltip>
          )}
        </>,
        `${publicKey.user.name} ${publicKey.user.surname}`,
        formatDateString(publicKey.createdAt),
      ]}
    >
      <Link
        as="button"
        to={inspectRouteKey}
        params={{ clientId, kid }}
        variant="outlined"
        size="small"
        onPointerEnter={handlePrefetchKey}
        onFocusVisible={handlePrefetchKey}
      >
        {tCommon('actions.inspect')}
      </Link>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} iconColor={color} />
      </Box>
    </TableRow>
  )
}

export const ClientPublicKeysTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        <Skeleton width={120} key={0} />,
        <Skeleton width={120} key={1} />,
        <Skeleton width={120} key={2} />,
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
