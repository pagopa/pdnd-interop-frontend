import { useTranslation } from 'react-i18next'
import { ClientServices } from './client.services'
import { useMutation } from '@tanstack/react-query'

function useCreate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.create' })
  return useMutation({
    mutationFn: ClientServices.create,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useCreateInteropM2M() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.createInteropM2M' })
  return useMutation({
    mutationFn: ClientServices.createInteropM2M,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDelete() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.deleteOne' })
  return useMutation({
    mutationFn: ClientServices.deleteOne,
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

function usePostKey() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.postKey' })
  return useMutation({
    mutationFn: ClientServices.postKey,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteKey() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.deleteKey' })
  return useMutation({
    mutationFn: ClientServices.deleteKey,
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

function useAddOperator(
  config: { suppressSuccessToast: boolean } = { suppressSuccessToast: false }
) {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.addOperators' })
  return useMutation({
    mutationFn: ClientServices.addOperators,
    meta: {
      successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useRemoveOperator() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.removeOperator' })
  return useMutation({
    mutationFn: ClientServices.removeOperator,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

export const ClientMutations = {
  useCreate,
  useCreateInteropM2M,
  useDelete,
  usePostKey,
  useDeleteKey,
  useAddOperator,
  useRemoveOperator,
}
