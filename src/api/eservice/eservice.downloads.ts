import { useTranslation } from 'react-i18next'
import { useDownloadFile } from '../hooks'
import { EServiceServices } from './eservice.services'

function useDownloadVersionDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.downloadVersionDraftDocument',
  })
  return useDownloadFile(EServiceServices.downloadVersionDraftDocument, {
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useDownloadConsumerList() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.downloadConsumerList',
  })
  return useDownloadFile(EServiceServices.downloadConsumerList, {
    errorToastLabel: t('outcome.error'),
    successToastLabel: t('outcome.success'),
    loadingLabel: t('loading'),
  })
}

function useExportVersion() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.exportVersion',
  })
  return useDownloadFile(EServiceServices.exportVersion, {
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

export const EServiceDownloads = {
  useDownloadVersionDocument,
  useDownloadConsumerList,
  useExportVersion,
}
