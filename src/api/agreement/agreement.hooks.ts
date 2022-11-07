import { AgreementSummary } from '@/types/agreement.types'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import { GetListAgreementQueryParams } from './agreement.api.types'
import { updateAgreementsListCache, removeAgreementFromListCache } from './agreement.api.utils'
import AgreementServices from './agreement.services'

export enum AgreementQueryKeys {
  GetList = 'AgreementGetList',
  GetSingle = 'AgreementGetSingle',
}

function useGetList(params: GetListAgreementQueryParams) {
  return useQueryWrapper([AgreementQueryKeys.GetList, params], () =>
    AgreementServices.getList(params)
  )
}

function useGetSingle(agreementId: string) {
  return useQueryWrapper([AgreementQueryKeys.GetSingle, agreementId], () =>
    AgreementServices.getSingle(agreementId)
  )
}

function usePrefetchSingle() {
  const queryClient = useQueryClient()
  return (agreementId: string) =>
    queryClient.prefetchQuery([AgreementQueryKeys.GetSingle, agreementId], () =>
      AgreementServices.getSingle(agreementId)
    )
}

function useCreateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.createDraft' })
  const queryClient = useQueryClient()
  return useMutationWrapper(AgreementServices.createDraft, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: ({ eserviceName, eserviceVersion }) =>
        t('confirmDialog.description', { name: eserviceName, version: eserviceVersion }),
      proceedLabel: t('confirmDialog.proceedLabel'),
    },
    onSuccess() {
      queryClient.invalidateQueries([AgreementQueryKeys.GetList])
    },
  })
}

function useSubmitDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.submitDraft' })
  const queryClient = useQueryClient()
  return useMutationWrapper(AgreementServices.submitDraft, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(data) {
      queryClient.setQueriesData<Array<AgreementSummary>>(
        [AgreementQueryKeys.GetList],
        updateAgreementsListCache.bind(null, data)
      )
      queryClient.setQueryData([AgreementQueryKeys.GetSingle, data.id], data)
    },
  })
}

function useDeleteDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.deleteDraft' })
  const queryClient = useQueryClient()
  return useMutationWrapper(AgreementServices.deleteDraft, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { agreementId }) {
      queryClient.removeQueries([AgreementQueryKeys.GetSingle, agreementId])
      queryClient.setQueriesData<Array<AgreementSummary>>(
        [AgreementQueryKeys.GetList],
        removeAgreementFromListCache.bind(null, agreementId)
      )
    },
  })
}

function useDownloadDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.downloadDraftDocument',
  })
  return useMutationWrapper(AgreementServices.downloadDraftDocument, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useUploadDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.uploadDraftDocument',
  })
  const queryClient = useQueryClient()
  return useMutationWrapper(AgreementServices.uploadDraftDocument, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(_, { agreementId }) {
      queryClient.invalidateQueries([AgreementQueryKeys.GetSingle, agreementId])
    },
  })
}

function useDeleteDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.deleteDraftDocument',
  })
  const queryClient = useQueryClient()
  return useMutationWrapper(AgreementServices.deleteDraftDocument, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(_, { agreementId }) {
      queryClient.invalidateQueries([AgreementQueryKeys.GetSingle, agreementId])
    },
  })
}

function useActivate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.activate' })
  const queryClient = useQueryClient()
  return useMutationWrapper(AgreementServices.activate, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(data, { agreementId }) {
      queryClient.setQueryData([AgreementQueryKeys.GetSingle, agreementId], data)
      queryClient.setQueriesData<Array<AgreementSummary>>(
        [AgreementQueryKeys.GetList],
        updateAgreementsListCache.bind(null, data)
      )
    },
  })
}

function useReject() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.reject' })
  const queryClient = useQueryClient()
  return useMutationWrapper(AgreementServices.reject, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(data, { agreementId }) {
      queryClient.setQueryData([AgreementQueryKeys.GetSingle, agreementId], data)
      queryClient.setQueriesData<Array<AgreementSummary>>(
        [AgreementQueryKeys.GetList],
        updateAgreementsListCache.bind(null, data)
      )
    },
  })
}

function useSuspend() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.suspend' })
  const queryClient = useQueryClient()
  return useMutationWrapper(AgreementServices.suspend, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(data, { agreementId }) {
      queryClient.setQueryData([AgreementQueryKeys.GetSingle, agreementId], data)
      queryClient.setQueriesData<Array<AgreementSummary>>(
        [AgreementQueryKeys.GetList],
        updateAgreementsListCache.bind(null, data)
      )
    },
  })
}

function useUpgrade() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.upgrade' })
  const queryClient = useQueryClient()
  return useMutationWrapper(AgreementServices.upgrade, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(data, { agreementId }) {
      queryClient.setQueryData([AgreementQueryKeys.GetSingle, agreementId], data)
      queryClient.setQueriesData<Array<AgreementSummary>>(
        [AgreementQueryKeys.GetList],
        updateAgreementsListCache.bind(null, data)
      )
    },
  })
}

function useDownloadContract() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.downloadContract',
  })
  return useMutationWrapper(AgreementServices.downloadContract, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

export const AgreementQueries = {
  useGetList,
  useGetSingle,
  usePrefetchSingle,
}

export const AgreementMutations = {
  useCreateDraft,
  useSubmitDraft,
  useDeleteDraft,
  useDownloadDocument,
  useUploadDraftDocument,
  useDeleteDraftDocument,
  useActivate,
  useReject,
  useSuspend,
  useUpgrade,
  useDownloadContract,
}
