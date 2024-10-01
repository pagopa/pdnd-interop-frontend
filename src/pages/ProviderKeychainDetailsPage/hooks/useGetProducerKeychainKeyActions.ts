import { AuthHooks } from '@/api/auth'
// import { KeychainDownloads } from '@/api/keychain/keychain.downloads'
import type { ActionItemButton } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useDialog } from '@/stores'
import { KeychainDownloads } from '@/api/keychain/keychain.downloads'

function useGetProducerKeychainKeyActions({
  keychainId,
  keyId,
  parentId,
}: {
  keychainId: string
  keyId: string
  parentId?: string
}): {
  actions: Array<ActionItemButton>
} {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { isOperatorSecurity, isAdmin, jwt } = AuthHooks.useJwt()
  const { openDialog } = useDialog()
  const downloadKey = KeychainDownloads.useDownloadKey()

  if (!isAdmin && !isOperatorSecurity) return { actions: [] }

  const handleDownloadKey = () => {
    downloadKey({ producerKeychainId: keychainId, keyId }, 'public_key.pub')
  }

  const handleDeleteKey = () => {
    openDialog({
      type: 'deleteProducerKeychainKey',
      keychainId,
      keyId,
    })
  }

  if (isOperatorSecurity && jwt?.organizationId !== parentId) {
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
