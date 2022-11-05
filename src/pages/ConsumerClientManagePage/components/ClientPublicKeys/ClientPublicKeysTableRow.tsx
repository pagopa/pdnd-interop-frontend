import { ClientMutations, ClientQueries } from '@/api/client'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { TableRow } from '@/components/shared/Table'
import { RouterLink } from '@/router'
import { ActionItem } from '@/types/common.types'
import { PublicKey } from '@/types/key.types'
import { formatDateString } from '@/utils/format.utils'
import { Box, Skeleton, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '../../hooks/useClientKind'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import { isKeyOrphan } from '@/utils/key.utils'
import { ButtonSkeleton } from '@/components/shared/MUISkeletons'

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
  const { mutate: downloadKey } = ClientMutations.useDownloadKey()
  const { mutate: deleteKey } = ClientMutations.useDeleteKey()
  const { data: operators = [] } = ClientQueries.useGetOperatorsList(clientId)

  const kid = publicKey.key.kid

  const actions: Array<ActionItem> = [
    { action: downloadKey.bind(null, { clientId, kid }), label: tCommon('actions.download') },
    { action: deleteKey.bind(null, { clientId, kid }), label: tCommon('actions.delete') },
  ]

  const inspectRouteKey =
    clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M_CLIENT_KEY_EDIT' : 'SUBSCRIBE_CLIENT_KEY_EDIT'

  const isOrphan = isKeyOrphan(publicKey, operators)
  const color = isOrphan ? 'error' : 'primary'

  return (
    <TableRow
      cellData={[
        {
          label: publicKey.name,
          tooltip: isOrphan ? (
            <Tooltip title={t('tableKey.operatorDeletedWarning.message')}>
              <ReportGmailerrorredIcon sx={{ ml: 0.75, fontSize: 16 }} color={color} />
            </Tooltip>
          ) : undefined,
        },
        { label: formatDateString(publicKey.createdAt) },
        { label: `${publicKey.operator.name} ${publicKey.operator.familyName}` },
      ]}
    >
      <RouterLink
        as="button"
        to={inspectRouteKey}
        params={{ clientId, kid }}
        variant="outlined"
        size="small"
      >
        {tCommon('actions.inspect')}
      </RouterLink>

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
        { label: <Skeleton width={120} /> },
        { label: <Skeleton width={120} /> },
        { label: <Skeleton width={120} /> },
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
