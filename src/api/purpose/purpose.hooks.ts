import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useQueryWrapper } from '../react-query-wrappers'
import PurposeServices from './purpose.services'
import { useDownloadFile } from '../react-query-wrappers/useDownloadFile'
import type { UseQueryWrapperOptions } from '../react-query-wrappers/react-query-wrappers.types'
import type { GetConsumerPurposesParams, GetProducerPurposesParams } from '../api.generatedTypes'

export enum PurposeQueryKeys {
  GetList = 'PurposeGetList',
  GetSingle = 'PurposeGetSingle',
  GetRiskAnalysisLatest = 'PurposeGetRiskAnalysisLatest',
  GetRiskAnalysisVersion = 'PurposeGetRiskAnalysisVersion',
}

function useGetProducersList(
  params: GetProducerPurposesParams,
  config?: UseQueryWrapperOptions<Awaited<ReturnType<typeof PurposeServices.getProducersList>>>
) {
  return useQueryWrapper(
    [PurposeQueryKeys.GetList, params],
    () => PurposeServices.getProducersList(params),
    config
  )
}

function useGetConsumersList(
  params: GetConsumerPurposesParams,
  config?: UseQueryWrapperOptions<Awaited<ReturnType<typeof PurposeServices.getConsumersList>>>
) {
  return useQueryWrapper(
    [PurposeQueryKeys.GetList, params],
    () => PurposeServices.getConsumersList(params),
    config
  )
}

function useGetSingle(
  purposeId: string,
  config?: UseQueryWrapperOptions<Awaited<ReturnType<typeof PurposeServices.getSingle>>>
) {
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

function useGetRiskAnalysisLatest(
  config?: UseQueryWrapperOptions<Awaited<ReturnType<typeof PurposeServices.getRiskAnalysisLatest>>>
) {
  return useQueryWrapper(
    [PurposeQueryKeys.GetRiskAnalysisLatest],
    () => PurposeServices.getRiskAnalysisLatest(),
    config
  )
}

function useGetRiskAnalysisVersion(
  riskAnalysisVersion: string,
  config?: UseQueryWrapperOptions<
    Awaited<ReturnType<typeof PurposeServices.getRiskAnalysisVersion>>
  >
) {
  return useQueryWrapper(
    [PurposeQueryKeys.GetRiskAnalysisVersion, riskAnalysisVersion],
    () => PurposeServices.getRiskAnalysisVersion(riskAnalysisVersion),
    config
  )
}

function useCreateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.createDraft' })
  return useMutation(PurposeServices.createDraft, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.updateDraft' })
  return useMutation(PurposeServices.updateDraft, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.deleteDraft' })
  return useMutation(PurposeServices.deleteDraft, {
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

function useCreateVersionDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.createVersionDraft' })
  return useMutation(PurposeServices.createVersionDraft, {
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.updateVersionDraft',
  })
  return useMutation(PurposeServices.updateVersionDraft, {
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
  return useMutation(PurposeServices.updateDailyCalls, {
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateVersionWaitingForApproval() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.updateVersionWaitingForApproval',
  })
  return useMutation(PurposeServices.updateVersionWaitingForApproval, {
    meta: {
      loadingLabel: t('loading'),
    },
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
  return useMutation(PurposeServices.suspendVersion, {
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
  return useMutation(PurposeServices.activateVersion, {
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
  return useMutation(PurposeServices.archiveVersion, {
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
  return useMutation(PurposeServices.deleteVersion, {
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

function useClone() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.clone' })
  return useMutation(PurposeServices.clone, {
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

function useAddClient() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.addClient' })
  return useMutation(PurposeServices.addClient, {
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useRemoveClient() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.removeClient' })
  return useMutation(PurposeServices.removeClient, {
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
export const PurposeQueries = {
  useGetProducersList,
  useGetConsumersList,
  useGetSingle,
  usePrefetchSingle,
  useGetRiskAnalysisLatest,
  useGetRiskAnalysisVersion,
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
  useClone,
  useAddClient,
  useRemoveClient,
}

export const PurposeDownloads = {
  useDownloadRiskAnalysis,
}
