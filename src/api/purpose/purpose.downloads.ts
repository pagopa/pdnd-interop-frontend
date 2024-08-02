import { useTranslation } from 'react-i18next'
import { useDownloadFile } from '../hooks'
import { PurposeServices } from './purpose.services'

function useDownloadRiskAnalysis() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.downloadRiskAnalysis' })
  return useDownloadFile(PurposeServices.downloadRiskAnalysis, {
    loadingLabel: t('loading'),
    errorToastLabel: t('outcome.error'),
  })
}

export const PurposeDownloads = {
  useDownloadRiskAnalysis,
}
