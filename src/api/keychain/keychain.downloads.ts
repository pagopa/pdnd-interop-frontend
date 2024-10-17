import { useTranslation } from 'react-i18next'
import { useDownloadFile } from '../hooks'
import { KeychainServices } from './keychain.services'

function useDownloadKey() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'keychain.downloadKey' })
  return useDownloadFile(KeychainServices.downloadKey, {
    loadingLabel: t('loading'),
  })
}

export const KeychainDownloads = {
  useDownloadKey,
}
