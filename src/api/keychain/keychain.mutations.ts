import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'
import { KeychainServices } from './keychain.services'
import { KeychainQueries } from './keychain.queries'

function useUpdateKeychain() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'keychain.updateKeychain' })
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: KeychainServices.updateKeychain,
    meta: {
      successToastLabel: (_data: unknown, variables: unknown) =>
        match(variables)
          .with({ name: P.string, description: P.string }, () =>
            t('outcome.successNameAndDescription')
          )
          .with({ name: P.string }, () => t('outcome.successName'))
          .with({ description: P.string }, () => t('outcome.successDescription'))
          .otherwise(() => t('outcome.error')),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
    onSuccess: (
      _data,
      { producerKeychainId }: Parameters<typeof KeychainServices.updateKeychain>[0]
    ) => {
      queryClient.invalidateQueries(KeychainQueries.getSingle(producerKeychainId))
      queryClient.invalidateQueries({ queryKey: ['KeychainGetList'] })
      queryClient.invalidateQueries({ queryKey: ['KeychainGetAllList'] })
    },
  })
}

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

function useRemoveKeychainFromEService(options: { withConfirmationDialog?: boolean } = {}) {
  const { withConfirmationDialog = true } = options
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'keychain.removeKeychainFromEService',
  })
  return useMutation({
    mutationFn: KeychainServices.removeKeychainFromEService,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: withConfirmationDialog
        ? {
            title: t('confirmDialog.title'),
            description: t('confirmDialog.description'),
          }
        : undefined,
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
  useUpdateKeychain,
  useDeleteKeychain,
  useCreateKeychain,
  useRemoveKeychainFromEService,
  useAddKeychainToEService,
  useAddProducerKeychainUsers,
  useDeleteProducerKeychainKey,
  useCreateProducerKeychainKey,
  useRemoveUserFromProducerKeychain,
}
