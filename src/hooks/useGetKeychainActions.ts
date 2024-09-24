import { useTranslation } from 'react-i18next'
import { KeychainMutations } from '@/api/keychain'
import { useNavigate } from '@/router'
import type { ActionItemButton } from '@/types/common.types'
import type { ProducerKeychain, CompactProducerKeychain } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

function useGetKeychainActions(keychain?: ProducerKeychain | CompactProducerKeychain): {
  actions: Array<ActionItemButton>
} {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { isAdmin } = AuthHooks.useJwt()
  const navigate = useNavigate()
  const { mutate: deleteKeychain } = KeychainMutations.useDeleteKeychain()

  if (!keychain || !isAdmin) return { actions: [] }

  function handleDeleteKeychain() {
    if (!keychain) return
    deleteKeychain(
      { producerKeychainId: keychain.id },
      {
        onSuccess() {
          const successRouteKey = 'PROVIDE_KEYCHAINS_LIST'
          navigate(successRouteKey)
        },
      }
    )
  }

  const deleteKeychainAction: ActionItemButton = {
    action: handleDeleteKeychain,
    label: t('delete'),
    icon: DeleteOutlineIcon,
    color: 'error',
  }

  return { actions: [deleteKeychainAction] }
}

export default useGetKeychainActions
