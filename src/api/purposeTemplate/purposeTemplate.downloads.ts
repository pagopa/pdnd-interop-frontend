import { useTranslation } from 'react-i18next'
import { useDownloadFile } from '../hooks'
import { PurposeTemplateServices } from './purposeTemplate.services'

function useDownloadAnnotationDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purposeTemplate.downloadDocument',
  })
  return useDownloadFile(PurposeTemplateServices.downloadDocumentFromAnnotation, {
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

export const PurposeTemplateDownloads = {
  useDownloadAnnotationDocument,
}
