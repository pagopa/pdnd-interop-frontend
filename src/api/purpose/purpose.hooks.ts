import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import PurposeServices from './purpose.services'
import { PurposeGetAllUrlParams } from './purpose.api.types'

export enum PurposeQueryKeys {
  GetAll = 'PurposeGetAll',
  GetSingle = 'PurposeGetSingle',
}

function useGetAll(params: PurposeGetAllUrlParams) {
  return useQueryWrapper([PurposeQueryKeys.GetAll, params], () => PurposeServices.getAll(params))
}

function useGetSingle(purposeId: string) {
  return useQueryWrapper([PurposeQueryKeys.GetSingle, purposeId], () =>
    PurposeServices.getSingle(purposeId)
  )
}

function usePrefetchSingle() {
  const queryClient = useQueryClient()
  return (purposeId: string) =>
    queryClient.prefetchQuery(
      [PurposeQueryKeys.GetSingle, purposeId],
      () => PurposeServices.getSingle(purposeId),
      { staleTime: 180000 }
    )
}

function useCreateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.createDraft' })
  const queryClient = useQueryClient()
  return useMutationWrapper(PurposeServices.createDraft, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(data) {
      queryClient.setQueryData([PurposeQueryKeys.GetSingle, data.id], data)
    },
  })
}

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.updateDraft' })
  const queryClient = useQueryClient()
  return useMutationWrapper(PurposeServices.updateDraft, {
    suppressSuccessToast: true,
    errorToastLabel: t('loading'),
    loadingLabel: t('outcome.error'),
    onSuccess(data) {
      queryClient.setQueryData([PurposeQueryKeys.GetSingle, data.id], data)
    },
  })
}

function useDeleteDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.deleteDraft' })
  const queryClient = useQueryClient()

  return useMutationWrapper(PurposeServices.deleteDraft, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { purposeId }) {
      queryClient.removeQueries([PurposeQueryKeys.GetSingle, purposeId])
      queryClient.invalidateQueries([PurposeQueryKeys.GetAll])
    },
  })
}

function useCreateVersionDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.createVersionDraft' })
  const queryClient = useQueryClient()
  return useMutationWrapper(PurposeServices.createVersionDraft, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(_, { purposeId }) {
      queryClient.invalidateQueries([PurposeQueryKeys.GetSingle, purposeId])
    },
  })
}

function useUpdateVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.updateVersionDraft',
  })
  const queryClient = useQueryClient()
  return useMutationWrapper(PurposeServices.updateVersionDraft, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(_, { purposeId }) {
      queryClient.invalidateQueries([PurposeQueryKeys.GetSingle, purposeId])
    },
  })
}

function useUpdateDailyCalls() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.updateDailyCalls',
  })
  const queryClient = useQueryClient()
  return useMutationWrapper(PurposeServices.updateDailyCalls, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(_, { purposeId }) {
      queryClient.invalidateQueries([PurposeQueryKeys.GetSingle, purposeId])
      queryClient.invalidateQueries([PurposeQueryKeys.GetAll])
    },
  })
}

function useUpdateVersionWaitingForApproval() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.updateVersionWaitingForApproval',
  })
  const queryClient = useQueryClient()
  return useMutationWrapper(PurposeServices.updateVersionWaitingForApproval, {
    suppressSuccessToast: true,
    suppressErrorToast: true,
    loadingLabel: t('loading'),
    onSuccess(_, { purposeId }) {
      queryClient.invalidateQueries([PurposeQueryKeys.GetSingle, purposeId])
      queryClient.invalidateQueries([PurposeQueryKeys.GetAll, { states: ['WAITING_FOR_APPROVAL'] }])
    },
  })
}

function useDownloadRiskAnalysis() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.downloadRiskAnalysis' })
  return useMutationWrapper(PurposeServices.downloadRiskAnalysis, {
    loadingLabel: t('loading'),
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
  })
}

function useSuspendVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.suspendVersion' })
  const queryClient = useQueryClient()
  return useMutationWrapper(PurposeServices.suspendVersion, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { purposeId }) {
      queryClient.invalidateQueries([PurposeQueryKeys.GetAll])
      queryClient.invalidateQueries([PurposeQueryKeys.GetSingle, purposeId])
    },
  })
}

function useActivateVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.activateVersion' })
  const queryClient = useQueryClient()
  return useMutationWrapper(PurposeServices.activateVersion, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { purposeId }) {
      queryClient.invalidateQueries([PurposeQueryKeys.GetAll])
      queryClient.invalidateQueries([PurposeQueryKeys.GetSingle, purposeId])
    },
  })
}

function useArchiveVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.archiveVersion' })
  const queryClient = useQueryClient()
  return useMutationWrapper(PurposeServices.archiveVersion, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { purposeId }) {
      queryClient.invalidateQueries([PurposeQueryKeys.GetAll])
      queryClient.invalidateQueries([PurposeQueryKeys.GetSingle, purposeId])
    },
  })
}

function useDeleteVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.deleteVersion' })
  const queryClient = useQueryClient()
  return useMutationWrapper(PurposeServices.deleteVersion, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { purposeId }) {
      queryClient.invalidateQueries([PurposeQueryKeys.GetAll])
      queryClient.invalidateQueries([PurposeQueryKeys.GetSingle, purposeId])
    },
  })
}

export const PurposeQueries = {
  useGetAll,
  useGetSingle,
  usePrefetchSingle,
}

export const PurposeMutations = {
  useCreateDraft,
  useUpdateDraft,
  useDeleteDraft,
  useCreateVersionDraft,
  useUpdateVersionDraft,
  useUpdateDailyCalls,
  useUpdateVersionWaitingForApproval,
  useDownloadRiskAnalysis,
  useSuspendVersion,
  useActivateVersion,
  useArchiveVersion,
  useDeleteVersion,
}
