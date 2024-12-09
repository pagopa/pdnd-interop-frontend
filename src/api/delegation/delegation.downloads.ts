import { useTranslation } from 'react-i18next'
import { useDownloadFile } from '../hooks'
import { DelegationServices } from './delegation.services'

function useDownloadDelegationContract() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'delegation.downloadDelegationContract',
  })
  return useDownloadFile(DelegationServices.downloadDelegationContract, {
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

export const DelegationDownloads = {
  useDownloadDelegationContract,
}
