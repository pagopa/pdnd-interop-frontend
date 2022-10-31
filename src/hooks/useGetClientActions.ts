import { useTranslation } from 'react-i18next'
import { ClientMutations } from '@/api/client'
import { Client } from '@/types/client.types'

function useGetClientActions(client: Client) {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { mutate: deleteClient } = ClientMutations.useDelete()

  function handleDeleteClient() {
    deleteClient({ clientId: client.id })
  }

  const deleteClientAction = {
    action: handleDeleteClient,
    label: t('delete'),
  }

  return { actions: [deleteClientAction] }
}

export default useGetClientActions
