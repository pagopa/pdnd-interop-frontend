import { ClientDownloads, ClientMutations } from '@/api/client'
import { useClientKind } from '@/hooks/useClientKind'
import { useNavigate } from '@/router'
import type { ActionItem } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import { AuthHooks } from '@/api/auth'

function useGetKeyActions(clientId: string, kid: string): { actions: Array<ActionItem> } {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { isOperatorSecurity, isAdmin } = AuthHooks.useJwt()
  const clientKind = useClientKind()
  const navigate = useNavigate()
  const downloadKey = ClientDownloads.useDownloadKey()
  const { mutate: deleteKey } = ClientMutations.useDeleteKey()

  if (!isAdmin && !isOperatorSecurity) return { actions: [] }

  const backToOperatorsListRouteKey =
    clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT' : 'SUBSCRIBE_CLIENT_EDIT'

  const handleDownloadKey = () => {
    downloadKey({ clientId, kid }, 'public_key.pub')
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
