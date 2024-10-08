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

function useRemoveKeychainFromEService() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'keychain.removeKeychainFromEService',
  })
  return useMutation({
    mutationFn: KeychainServices.removeKeychainFromEService,
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

function useAddKeychainToEService() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'keychain.addKeychainToEService',
  })
  return useMutation({
    mutationFn: KeychainServices.addKeychainToEService,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useAddProducerKeychainUsers() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'keychain.addProducerKeychainUsers',
  })
  return useMutation({
    mutationFn: KeychainServices.addProducerKeychainUsers,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteProducerKeychainKey() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'keychain.deleteProducerKeychainKey',
  })
  return useMutation({
    mutationFn: KeychainServices.deleteProducerKeychainKey,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useCreateProducerKeychainKey() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'keychain.createProducerKeychainKey',
  })

  return useMutation({
    mutationFn: KeychainServices.createProducerKeychainKey,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useRemoveUserFromProducerKeychain() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'keychain.removeUserFromProducerKeychain',
  })
  return useMutation({
    mutationFn: KeychainServices.removeUserFromKeychain,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

export const KeychainMutations = {
  useDeleteKeychain,
  useCreateKeychain,
  useRemoveKeychainFromEService,
  useAddKeychainToEService,
  useAddProducerKeychainUsers,
  useDeleteProducerKeychainKey,
  useCreateProducerKeychainKey,
  useRemoveUserFromProducerKeychain,
}
