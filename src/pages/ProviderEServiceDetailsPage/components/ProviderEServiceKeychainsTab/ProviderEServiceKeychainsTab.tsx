import { AuthHooks } from '@/api/auth'
import { useDrawerState } from '@/hooks/useDrawerState'
import { Button, Stack, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { useParams } from '@/router'
import { ProviderEServiceKeychainsTable } from './ProviderEServiceKeychainsTable'
import { AddKeychainToEServiceDrawer } from './AddKeychainToEServiceDrawer'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { KeychainQueries } from '@/api/keychain'
import { KeychainMutations } from '@/api/keychain/keychain.mutations'
import type { CompactProducerKeychain } from '@/api/api.generatedTypes'

export const ProviderEserviceKeychainsTab: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.keychain' })
  const { t: tCommon } = useTranslation('common')
  const { eserviceId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const queryClient = useQueryClient()
  const { jwt, isAdmin } = AuthHooks.useJwt()

  const { isOpen, closeDrawer, openDrawer } = useDrawerState()

  const { data: excludeKeychainsIdsList = [] } = useQuery({
    ...KeychainQueries.getKeychainsList({
      producerId: jwt?.organizationId as string,
      eserviceId: eserviceId,
      limit: 50,
      offset: 0,
    }),
    select: (d) => d.results.map((keychain) => keychain.id),
  })

  const { mutateAsync: addKeychainToEService } = KeychainMutations.useAddKeychainToEService()
  const handleSubmit = async (selectedKeychains: CompactProducerKeychain[]) => {
    await Promise.all(
      selectedKeychains.map((keychain) =>
        addKeychainToEService({ keychainId: keychain.id, eserviceId: eserviceId })
      )
    )
    closeDrawer()
  }

  const canAddKeychain = isAdmin

  const handlePrefetchKeychainList = () => {
    if (!canAddKeychain) return
    queryClient.prefetchQuery(
      KeychainQueries.getKeychainsList({
        limit: 50,
        offset: 0,
        producerId: jwt?.organizationId as string,
      })
    )
  }

  return (
    <>
      <Stack sx={{ mb: 2 }} alignItems="end">
        <Tooltip
          open={!canAddKeychain ? undefined : false}
          title={t('actionReservedToAdminTooltip')}
        >
          <span>
            <Button
              disabled={!canAddKeychain}
              variant="contained"
              size="small"
              onClick={openDrawer}
              onPointerEnter={handlePrefetchKeychainList}
              onFocusVisible={handlePrefetchKeychainList}
              startIcon={<PlusOneIcon />}
            >
              {tCommon('addBtn')}
            </Button>
          </span>
        </Tooltip>
      </Stack>
      <ProviderEServiceKeychainsTable eserviceId={eserviceId} />
      {canAddKeychain && (
        <AddKeychainToEServiceDrawer
          isOpen={isOpen}
          onClose={closeDrawer}
          onSubmit={handleSubmit}
          excludeKeychainsIdsList={excludeKeychainsIdsList}
        />
      )}
    </>
  )
}
