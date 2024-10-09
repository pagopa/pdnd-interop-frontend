import { AuthHooks } from '@/api/auth'
import type { ActionItemButton } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useDialog } from '@/stores'
import { KeychainDownloads } from '@/api/keychain/keychain.downloads'
import type { PublicKey } from '@/api/api.generatedTypes'

function useGetProducerKeychainKeyActions({
  keychainId,
  publicKey,
}: {
  keychainId: string
  publicKey?: PublicKey
}): {
  actions: Array<ActionItemButton>
} {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { isOperatorSecurity, isAdmin, jwt } = AuthHooks.useJwt()
  const { openDialog } = useDialog()
  const downloadKey = KeychainDownloads.useDownloadKey()

  if ((!isAdmin && !isOperatorSecurity) || !publicKey) return { actions: [] }

  const handleDownloadKey = () => {
    downloadKey({ producerKeychainId: keychainId, keyId: publicKey.keyId }, 'public_key.pub')
  }

  const handleDeleteKey = () => {
    openDialog({
      type: 'deleteProducerKeychainKey',
      keychainId,
      keyId: publicKey.keyId,
    })
  }

  if (isOperatorSecurity && jwt?.organizationId !== publicKey.user.userId) {
    return {
      actions: [{ action: handleDownloadKey, label: t('download'), icon: DownloadIcon }],
    }
  }

  return {
    actions: [
      { action: handleDownloadKey, label: t('download'), icon: DownloadIcon },
      { action: handleDeleteKey, label: t('delete'), color: 'error', icon: DeleteOutlineIcon },
    ],
  }
}

export default useGetProducerKeychainKeyActions
