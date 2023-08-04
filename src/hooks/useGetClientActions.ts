import { useTranslation } from 'react-i18next'
import { ClientMutations } from '@/api/client'
import { useClientKind } from './useClientKind'
import { useNavigate } from '@/router'
import type { ActionItem } from '@/types/common.types'
import type { Client, CompactClient } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'

function useGetClientActions(client?: Client | CompactClient): { actions: Array<ActionItem> } {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const clientKind = useClientKind()
  const { isAdmin } = AuthHooks.useJwt()
  const navigate = useNavigate()
  const { mutate: deleteClient } = ClientMutations.useDelete()

  if (!client || !isAdmin) return { actions: [] }

  function handleDeleteClient() {
    if (!client) return
    deleteClient(
      { clientId: client.id },
      {
        onSuccess() {
          const successRouteKey =
            clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M' : 'SUBSCRIBE_CLIENT_LIST'
          navigate(successRouteKey)
        },
      }
    )
  }

  const deleteClientAction = {
    action: handleDeleteClient,
    label: t('delete'),
  }

  return { actions: [deleteClientAction] }
}

export default useGetClientActions
