import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import KeychainServices from './keychain.services'

function useDeleteKeychain() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'keychain.deleteKeychain' })
  return useMutation(KeychainServices.deleteKeychain, {
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
    },
  })
}

export const KeychainMutations = {
  useDeleteKeychain,
}
