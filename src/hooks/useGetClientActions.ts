import { useTranslation } from 'react-i18next'
import { ClientMutations } from '@/api/client'
import type { Client } from '@/types/client.types'
import { useClientKind } from './useClientKind'
import { useNavigateRouter } from '@/router'
import type { ActionItem } from '@/types/common.types'

function useGetClientActions(client?: Client): { actions: Array<ActionItem> } {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const clientKind = useClientKind()
  const { navigate } = useNavigateRouter()
  const { mutate: deleteClient } = ClientMutations.useDelete()

  if (!client) return { actions: [] }

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
