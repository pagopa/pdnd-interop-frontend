import { useTranslation } from 'react-i18next'
import { useDownloadFile } from '../hooks'
import { ClientServices } from './client.services'

function useDownloadKey() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.downloadKey' })
  return useDownloadFile(ClientServices.downloadKey, {
    loadingLabel: t('loading'),
  })
}

export const ClientDownloads = {
  useDownloadKey,
}
