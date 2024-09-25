import type { Users } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { useDrawerState } from '@/hooks/useDrawerState'
import { Button, Stack, Tooltip } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { KeychainMembersTable, KeychainMembersTableSkeleton } from './KeychainMembersTable'
import { KeychainMutations } from '@/api/keychain/keychain.mutations'
import { KeychainQueries } from '@/api/keychain/keychain.queries'
import { TenantQueries } from '@/api/tenant'
import { AddOperatorsToKeychainDrawer } from '@/components/shared/AddOperatorsToKeychainDrawer'

type KeychainMembersTabProps = {
  keychainId: string
}

export const KeychainMembersTab: React.FC<KeychainMembersTabProps> = ({ keychainId }) => {
  const { t } = useTranslation('keychain')
  const { t: tCommon } = useTranslation('common')
  const { jwt, isAdmin } = AuthHooks.useJwt()
  const queryClient = useQueryClient()

  const { isOpen, closeDrawer, openDrawer } = useDrawerState()

  const { mutateAsync: addUser } = KeychainMutations.useAddProducerKeychainUser()

  const { data: excludeUsersIdsList = [] } = useQuery({
    ...KeychainQueries.getProducerKeychainUsersList(keychainId),
    select: (users) => users.map(({ userId }) => userId),
  })

  const handleSubmit = async (members: Users) => {
    await Promise.all(
      members.map(({ userId }) => addUser({ producerKeychainId: keychainId, userId }))
    )
    closeDrawer()
  }

  const canAddMembers = isAdmin

  const handlePrefetchUserList = () => {
    if (!canAddMembers) return
    queryClient.prefetchQuery(
      TenantQueries.getPartyUsersList({
        roles: ['admin', 'security'],
        tenantId: jwt?.organizationId as string,
      })
    )
  }

  return (
    <>
      <Stack sx={{ mb: 2 }} alignItems="end">
        <Tooltip
          open={!canAddMembers ? undefined : false}
          title={t('actionReservedToAdminTooltip')}
        >
          <span>
            <Button
              disabled={!canAddMembers}
              variant="contained"
              size="small"
              onClick={openDrawer}
              onPointerEnter={handlePrefetchUserList}
              onFocusVisible={handlePrefetchUserList}
              startIcon={<PlusOneIcon />}
            >
              {tCommon('addBtn')}
            </Button>
          </span>
        </Tooltip>
      </Stack>
      <React.Suspense fallback={<KeychainMembersTableSkeleton />}>
        <KeychainMembersTable keychainId={keychainId} />
      </React.Suspense>
      {canAddMembers && (
        <AddOperatorsToKeychainDrawer
          onSubmit={handleSubmit}
          excludeOperatorsIdsList={excludeUsersIdsList}
          isOpen={isOpen}
          onClose={closeDrawer}
        />
      )}
    </>
  )
}
