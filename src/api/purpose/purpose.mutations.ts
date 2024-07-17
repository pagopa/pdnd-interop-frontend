import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { PurposeServices } from './purpose.services'

function useCreateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.createDraft' })
  return useMutation({
    mutationFn: PurposeServices.createDraft,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.updateDraft' })
  return useMutation({
    mutationFn: PurposeServices.updateDraft,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.deleteDraft' })
  return useMutation({
    mutationFn: PurposeServices.deleteDraft,
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

function useCreateDraftForReceiveEService() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.createDraftForReceiveEService',
  })
  return useMutation({
    mutationFn: PurposeServices.createDraftForReceiveEService,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateDraftForReceiveEService() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.updateDraft',
  })
  return useMutation({
    mutationFn: PurposeServices.updateDraftForReceiveEService,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateDailyCalls() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.updateDailyCalls',
  })
  return useMutation({
    mutationFn: PurposeServices.updateDailyCalls,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useSuspendVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.suspendVersion' })
  return useMutation({
    mutationFn: PurposeServices.suspendVersion,
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

function useActivateVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.activateVersion' })
  return useMutation({
    mutationFn: PurposeServices.activateVersion,
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

function useArchiveVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.archiveVersion' })
  return useMutation({
    mutationFn: PurposeServices.archiveVersion,
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

function useDeleteVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.deleteVersion' })
  return useMutation({
    mutationFn: PurposeServices.deleteVersion,
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

function useRejectVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.rejectVersion' })
  return useMutation({
    mutationFn: PurposeServices.rejectVersion,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useClone() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.clone' })
  return useMutation({
    mutationFn: PurposeServices.clone,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useAddClient() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.addClient' })
  return useMutation({
    mutationFn: PurposeServices.addClient,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useRemoveClient() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.removeClient' })
  return useMutation({
    mutationFn: PurposeServices.removeClient,
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

export const PurposeMutations = {
  useCreateDraft,
  useUpdateDraft,
  useDeleteDraft,
  useCreateDraftForReceiveEService,
  useUpdateDraftForReceiveEService,
  useUpdateDailyCalls,
  useSuspendVersion,
  useActivateVersion,
  useArchiveVersion,
  useDeleteVersion,
  useRejectVersion,
  useClone,
  useAddClient,
  useRemoveClient,
}
