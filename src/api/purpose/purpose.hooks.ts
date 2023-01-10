import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import PurposeServices from './purpose.services'
import { PurposeGetListUrlParams } from './purpose.api.types'
import { DecoratedPurpose, Purpose } from '@/types/purpose.types'
import {
  addPurposeVersionToPurposeCache,
  removePurposeFromListCache,
  updatePurposeVersionCache,
  updatePurposeListCache,
  decoratePurposeWithMostRecentVersion,
} from './purpose.api.utils'
import { useDownloadFile } from '../react-query-wrappers/useDownloadFile'

export enum PurposeQueryKeys {
  GetList = 'PurposeGetList',
  GetSingle = 'PurposeGetSingle',
}

function useGetList(
  params: PurposeGetListUrlParams,
  config?: { enabled?: boolean; suspense?: boolean }
) {
  const queryClient = useQueryClient()
  return useQueryWrapper(
    [PurposeQueryKeys.GetList, params],
    () => PurposeServices.getList(params),
    {
      ...config,
      onSuccess(data) {
        data.forEach((purpose) => {
          queryClient.setQueryData([PurposeQueryKeys.GetSingle, purpose.id], purpose)
        })
      },
    }
  )
}

function useGetSingle(purposeId: string, config: { suspense: boolean } = { suspense: true }) {
  return useQueryWrapper(
    [PurposeQueryKeys.GetSingle, purposeId],
    () => PurposeServices.getSingle(purposeId),
    { enabled: !!purposeId, ...config }
  )
}

function usePrefetchSingle() {
  const queryClient = useQueryClient()
  return (purposeId: string) =>
    queryClient.prefetchQuery([PurposeQueryKeys.GetSingle, purposeId], () =>
      PurposeServices.getSingle(purposeId)
    )
}

function useCreateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.createDraft' })
  const queryClient = useQueryClient()
  return useMutationWrapper(PurposeServices.createDraft, {
    suppressSuccessToast: true,
    errorToastLabel: t('loading'),
    loadingLabel: t('outcome.error'),
    onSuccess(data) {
      const decoratedPurpose = decoratePurposeWithMostRecentVersion(data)
      queryClient.setQueryData([PurposeQueryKeys.GetSingle, data.id], decoratedPurpose)
    },
  })
}

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.updateDraft' })
  const queryClient = useQueryClient()
  return useMutationWrapper(PurposeServices.updateDraft, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(data) {
      const decoratedPurpose = decoratePurposeWithMostRecentVersion(data)
      queryClient.setQueryData([PurposeQueryKeys.GetSingle, data.id], decoratedPurpose)
      queryClient.setQueriesData<Array<DecoratedPurpose>>(
        [PurposeQueryKeys.GetList],
        updatePurposeListCache.bind(null, data)
      )
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
      queryClient.setQueriesData<Array<DecoratedPurpose>>(
        [PurposeQueryKeys.GetList],
        removePurposeFromListCache.bind(null, purposeId)
      )
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
    onSuccess(data, { purposeId }) {
      queryClient.setQueriesData<Purpose>(
        [PurposeQueryKeys.GetSingle, purposeId],
        addPurposeVersionToPurposeCache.bind(null, data)
      )
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
    onSuccess(data, { purposeId }) {
      queryClient.setQueriesData<Purpose>(
        [PurposeQueryKeys.GetSingle, purposeId],
        updatePurposeVersionCache.bind(null, data)
      )
    },
  })
}

function useUpdateDailyCalls() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.updateDailyCalls',
  })
  return useMutationWrapper(PurposeServices.updateDailyCalls, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useUpdateVersionWaitingForApproval() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.updateVersionWaitingForApproval',
  })
  return useMutationWrapper(PurposeServices.updateVersionWaitingForApproval, {
    suppressSuccessToast: true,
    suppressErrorToast: true,
    loadingLabel: t('loading'),
  })
}

function useDownloadRiskAnalysis() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.downloadRiskAnalysis' })
  return useDownloadFile(PurposeServices.downloadRiskAnalysis, {
    loadingLabel: t('loading'),
    errorToastLabel: t('outcome.error'),
  })
}

function useSuspendVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.suspendVersion' })
  return useMutationWrapper(PurposeServices.suspendVersion, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useActivateVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.activateVersion' })
  return useMutationWrapper(PurposeServices.activateVersion, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useArchiveVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.archiveVersion' })
  return useMutationWrapper(PurposeServices.archiveVersion, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useDeleteVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.deleteVersion' })
  return useMutationWrapper(PurposeServices.deleteVersion, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useAddClient() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.addClient' })
  return useMutationWrapper(PurposeServices.addClient, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useRemoveClient() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.removeClient' })
  return useMutationWrapper(PurposeServices.removeClient, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}
export const PurposeQueries = {
  useGetList,
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
  useSuspendVersion,
  useActivateVersion,
  useArchiveVersion,
  useDeleteVersion,
  useAddClient,
  useRemoveClient,
}

export const PurposeDownloads = {
  useDownloadRiskAnalysis,
}
