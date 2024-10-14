import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { Link } from '@/router'
import { Box, Skeleton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TableRow } from '@pagopa/interop-fe-commons'
import { AuthHooks } from '@/api/auth'
import type { CompactUser } from '@/api/api.generatedTypes'
import { useQueryClient } from '@tanstack/react-query'
import { SelfcareQueries } from '@/api/selfcare'
import { useGetProducerKeychainUserActions } from '../../hooks/useGetProducerKeychainUserActions'

interface KeychainMembersTableRowProps {
  user: CompactUser
  keychainId: string
}

export const KeychainMembersTableRow: React.FC<KeychainMembersTableRowProps> = ({
  user,
  keychainId,
}) => {
  const { isAdmin } = AuthHooks.useJwt()
  const { t: tCommon } = useTranslation('common')
  const queryClient = useQueryClient()

  const { actions } = useGetProducerKeychainUserActions({ keychainId, userId: user.userId })

  const handlePrefetchOperator = () => {
    queryClient.prefetchQuery(SelfcareQueries.getSingleUser(user.userId))
  }

  return (
    <TableRow cellData={[`${user.name} ${user.familyName}`]}>
      <Link
        as="button"
        to={'PROVIDE_KEYCHAIN_USER_DETAILS'}
        params={{ keychainId, userId: user.userId }}
        variant="outlined"
        size="small"
        onPointerEnter={handlePrefetchOperator}
        onFocusVisible={handlePrefetchOperator}
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

export const KeychainMembersTableRowSkeleton: React.FC = () => {
  return (
    <TableRow cellData={[<Skeleton key={0} width={120} />]}>
      <ButtonSkeleton size="small" width={103} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
