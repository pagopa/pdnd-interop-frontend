import type { CompactProducerKeychain } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { KeychainQueries } from '@/api/keychain'
import { KeychainMutations } from '@/api/keychain/keychain.mutations'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { Link } from '@/router'
import type { ActionItem } from '@/types/common.types'
import { Box, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ProviderEServiceKeychainsTableRowProps = {
  eserviceId: string
  keychain: CompactProducerKeychain
}

export const ProviderEServiceKeychainsTableRow: React.FC<
  ProviderEServiceKeychainsTableRowProps
> = ({ eserviceId, keychain }) => {
  const { isAdmin } = AuthHooks.useJwt()
  const { t } = useTranslation('eservice', { keyPrefix: 'read.keychain' })
  const { t: tCommon } = useTranslation('common')
  const queryClient = useQueryClient()
  const { mutate: removeKeychainFromEService } = KeychainMutations.useRemoveKeychainFromEService()

  const handlePrefetchKeychain = () => {
    queryClient.prefetchQuery(KeychainQueries.getSingle(keychain.id))
  }

  const actions: ActionItem[] = [
    {
      label: t('actions.removeKeychainFromEService'),
      action: () =>
        removeKeychainFromEService({
          eserviceId,
          keychainId: keychain.id,
        }),
    },
  ]

  return (
    <TableRow cellData={[`${keychain.name}`]}>
      <Link
        as="button"
        to={'PROVIDE_ESERVICE_MANAGE'} // TODO KEYCHAIN SECTION
        params={{ eserviceId, descriptorId: eserviceId }} // TODO right params
        variant="outlined"
        size="small"
        onPointerEnter={handlePrefetchKeychain}
        onFocusVisible={handlePrefetchKeychain}
      >
        {tCommon('actions.inspect')}
      </Link>

      {isAdmin && (
        <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
          <ActionMenu actions={actions} />
        </Box>
      )}
    </TableRow>
  )
}

export const ProviderEServiceKeychainsTableRowSkeleton: React.FC = () => {
  return (
    <TableRow cellData={[<Skeleton key={0} width={120} />]}>
      <ButtonSkeleton size="small" width={103} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
