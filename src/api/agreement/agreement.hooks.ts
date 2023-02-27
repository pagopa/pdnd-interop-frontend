import type { AgreementListingItem, AgreementSummary } from '@/types/agreement.types'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import type {
  Paginated,
  UseQueryWrapperOptions,
} from '../react-query-wrappers/react-query-wrappers.types'
import { useDownloadFile } from '../react-query-wrappers/useDownloadFile'
import type { GetListAgreementQueryParams } from './agreement.api.types'
import AgreementServices from './agreement.services'

export enum AgreementQueryKeys {
  GetList = 'AgreementGetList',
  GetSingle = 'AgreementGetSingle',
}

function useGetList(
  params: GetListAgreementQueryParams,
  config: UseQueryWrapperOptions<Paginated<AgreementListingItem>>
) {
  return useQueryWrapper(
    [AgreementQueryKeys.GetList, params],
    () => AgreementServices.getList(params),
    config
  )
}

function useGetSingle(agreementId: string, config?: UseQueryWrapperOptions<AgreementSummary>) {
  return useQueryWrapper(
    [AgreementQueryKeys.GetSingle, agreementId],
    () => AgreementServices.getSingle(agreementId),
    config
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
  })
}

function useSubmitDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.submitDraft' })
  return useMutationWrapper(AgreementServices.submitDraft, {
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

function useDeleteDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.deleteDraft' })
  return useMutationWrapper(AgreementServices.deleteDraft, {
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

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.updateDraft' })
  return useMutationWrapper(AgreementServices.updateDraft, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useDownloadDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.downloadDraftDocument',
  })
  return useDownloadFile(AgreementServices.downloadDraftDocument, {
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useUploadDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.uploadDraftDocument',
  })
  return useMutationWrapper(AgreementServices.uploadDraftDocument, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useDeleteDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.deleteDraftDocument',
  })
  return useMutationWrapper(AgreementServices.deleteDraftDocument, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useActivate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.activate' })
  return useMutationWrapper(AgreementServices.activate, {
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

function useReject() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.reject' })
  return useMutationWrapper(AgreementServices.reject, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useClone() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.clone' })
  return useMutationWrapper(AgreementServices.clone, {
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

function useSuspend() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.suspend' })
  return useMutationWrapper(AgreementServices.suspend, {
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

function useUpgrade() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.upgrade' })
  return useMutationWrapper(AgreementServices.upgrade, {
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

function useDownloadContract() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.downloadContract',
  })
  return useDownloadFile(AgreementServices.downloadContract, {
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
  useUpdateDraft,
  useUploadDraftDocument,
  useDeleteDraftDocument,
  useActivate,
  useReject,
  useSuspend,
  useUpgrade,
  useClone,
}

export const AgreementDownloads = {
  useDownloadDocument,
  useDownloadContract,
}
