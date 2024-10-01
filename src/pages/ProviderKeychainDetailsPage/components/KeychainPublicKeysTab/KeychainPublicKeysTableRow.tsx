import type { PublicKey } from '@/api/api.generatedTypes'
import { KeychainQueries } from '@/api/keychain/keychain.queries'
import { Box, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@/router'
import { formatDateString } from '@/utils/format.utils'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import useGetProducerKeychainKeyActions from '../../hooks/useGetProducerKeychainKeyActions'

type KeychainPublicKeysTableRowProps = {
  keychainId: string
  publicKey: PublicKey
}

export const KeychainPublicKeysTableRow: React.FC<KeychainPublicKeysTableRowProps> = ({
  keychainId,
  publicKey,
}) => {
  const { t: tCommon } = useTranslation('common')
  const queryClient = useQueryClient()

  const keyId = publicKey.keyId

  const { actions } = useGetProducerKeychainKeyActions({
    keychainId,
    keyId,
    parentId: publicKey.user.userId,
  })

  const handlePrefetchKey = () => {
    queryClient.prefetchQuery(
      KeychainQueries.getProducerKeychainKey({
        producerKeychainId: keychainId,
        keyId,
      })
    )
  }

  const color = publicKey.isOrphan ? 'error' : 'primary'

  return (
    <TableRow
      cellData={[
        `${publicKey.name}`,
        `${publicKey.user.name} ${publicKey.user.familyName}`,
        formatDateString(publicKey.createdAt),
      ]}
    >
      <Link
        as="button"
        to="PROVIDE_KEYCHAIN_PUBLIC_KEY_DETAILS"
        params={{ keychainId, keyId }}
        variant="outlined"
        size="small"
        onPointerEnter={handlePrefetchKey}
        onFocusVisible={handlePrefetchKey}
      >
        {tCommon('actions.inspect')}
      </Link>

      {actions.length !== 0 && (
        <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
          <ActionMenu actions={actions} iconColor={color} />
        </Box>
      )}
    </TableRow>
  )
}

export const KeychainPublicKeysTableRowSkeleton: React.FC = () => {
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
