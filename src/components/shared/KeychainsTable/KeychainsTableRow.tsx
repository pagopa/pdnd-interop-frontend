import { Link } from '@/router'
import { Box, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActionMenu, ActionMenuSkeleton } from '../ActionMenu'
import { ButtonSkeleton } from '../MUI-skeletons'
import useGetKeychainActions from '@/hooks/useGetKeychainActions'
import type { CompactProducerKeychain } from '@/api/api.generatedTypes'
import { useQueryClient } from '@tanstack/react-query'
import { KeychainQueries } from '@/api/keychain/keychain.queries'

type KeychainsTableRow = {
  keychain: CompactProducerKeychain
}

export const KeychainsTableRow: React.FC<KeychainsTableRow> = ({ keychain }) => {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const queryClient = useQueryClient()

  const { actions } = useGetKeychainActions(keychain)

  const handlePrefetch = () => {
    queryClient.prefetchQuery(KeychainQueries.getSingle(keychain.id))
  }

  return (
    <TableRow cellData={[keychain.name]}>
      <Link
        as="button"
        variant="outlined"
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        size="small"
        to={'PROVIDE_KEYCHAIN_DETAILS'}
        params={{ keychainId: keychain.id }}
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
