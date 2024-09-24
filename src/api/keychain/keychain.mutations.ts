import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { KeychainServices } from './keychain.services'
function useDeleteKeychain() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'keychain.deleteKeychain' })
  return useMutation({
    mutationFn: KeychainServices.deleteKeychain,
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

function useCreateKeychain() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'keychain.createKeychain' })
  return useMutation({
    mutationFn: KeychainServices.createKeychain,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useAddKeychainOperator(
  config: { suppressSuccessToast: boolean } = { suppressSuccessToast: false }
) {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'keychain.addOperator' })
  return useMutation({
    mutationFn: KeychainServices.addOperator,
    meta: {
      successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

export const KeychainMutations = {
  useDeleteKeychain,
  useCreateKeychain,
  useAddKeychainOperator,
}
