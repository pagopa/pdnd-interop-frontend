import { ClientMutations } from '@/api/client'
import { useClientKind } from '@/hooks/useClientKind'
import { useNavigateRouter } from '@/router'
import { ActionItem } from '@/types/common.types'
import { useTranslation } from 'react-i18next'

function useGetKeyActions(clientId: string, kid: string): { actions: Array<ActionItem> } {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const clientKind = useClientKind()
  const { navigate } = useNavigateRouter()
  const { mutate: downloadKey } = ClientMutations.useDownloadKey()
  const { mutate: deleteKey } = ClientMutations.useDeleteKey()

  const backToOperatorsListRouteKey =
    clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT' : 'SUBSCRIBE_CLIENT_EDIT'

  const handleDownloadKey = () => {
    downloadKey({ clientId, kid })
  }

  const handleDeleteKey = () => {
    deleteKey(
      { clientId, kid },
      {
        onSuccess() {
          navigate(backToOperatorsListRouteKey, {
            params: { clientId },
            urlParams: { tab: 'publicKeys' },
          })
        },
      }
    )
  }

  return {
    actions: [
      { action: handleDownloadKey, label: t('download') },
      { action: handleDeleteKey, label: t('delete') },
    ],
  }
}

export default useGetKeyActions
