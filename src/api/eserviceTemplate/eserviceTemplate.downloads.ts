import { useTranslation } from 'react-i18next'
import { EServiceTemplateServices } from './eserviceTemplate.services'
import { useDownloadFile } from '../hooks'

function useDownloadVersionDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.downloadVersionDraftDocument',
  })
  return useDownloadFile(EServiceTemplateServices.downloadVersionDraftDocument, {
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useDownloadEServiceTemplateConsumerList() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.downloadConsumerList',
  })
  return useDownloadFile(EServiceTemplateServices.downloadConsumerList, {
    errorToastLabel: t('outcome.error'),
    successToastLabel: t('outcome.success'),
    loadingLabel: t('loading'),
  })
}

export const EServiceTemplateDownloads = {
  useDownloadVersionDocument,
  useDownloadEServiceTemplateConsumerList,
}
