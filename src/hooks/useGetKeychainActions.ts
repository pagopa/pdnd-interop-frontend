import { useTranslation } from 'react-i18next'
import { KeychainMutations } from '@/api/keychain'
import { useNavigate } from '@/router'
import type { ActionItemButton } from '@/types/common.types'
import type { Client, CompactClient } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

function useGetKeychainActions(): {
  actions: Array<ActionItemButton>
} {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { isAdmin } = AuthHooks.useJwt()
  const navigate = useNavigate()
  const { mutate: deleteKeychain } = KeychainMutations.useDeleteKeychain()

  //if (!client || !isAdmin) return { actions: [] }

  function handleDeleteKeychain() {
    //if (!client) return
    deleteKeychain(
      { client: '' },
      {
        onSuccess() {
          console.log('DELETED')
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
