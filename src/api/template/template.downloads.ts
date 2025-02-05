import { useTranslation } from 'react-i18next'
import { TemplateServices } from './template.services'
import { useDownloadFile } from '../hooks'

function useDownloadVersionDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.downloadVersionDraftDocument',
  })
  return useDownloadFile(TemplateServices.downloadVersionDraftDocument, {
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

export const TemplateDownloads = {
  useDownloadVersionDocument,
}
