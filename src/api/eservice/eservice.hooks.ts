import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import EServiceServices from './eservice.services'
import {
  EServiceGetCatalogListUrlParams,
  EServiceGetListFlatUrlParams,
  EServiceGetProviderListUrlParams,
  EServiceVersionDraftPayload,
} from './eservice.api.types'
import { useJwt } from '@/hooks/useJwt'
import { useDownloadFile } from '../react-query-wrappers/useDownloadFile'

export enum EServiceQueryKeys {
  /** @deprecated TO BE REMOVED */
  GetListFlat = 'EServiceGetListFlat',
  GetCatalogList = 'EServiceGetCatalogList',
  GetProviderList = 'EServiceGetProviderList',
  GetSingle = 'EServiceGetSingle',
  GetDescriptorCatalog = 'EServiceGetDescriptorCatalog',
  GetDescriptorProvider = 'EServiceGetDescriptorProvider',
}

/** @deprecated TO BE REMOVED */
function useGetListFlat(
  params: EServiceGetListFlatUrlParams,
  config?: {
    enabled?: boolean
    suspense?: boolean
  }
) {
  return useQueryWrapper(
    [EServiceQueryKeys.GetListFlat, params],
    () => EServiceServices.getListFlat(params),
    {
      suspense: config?.suspense ?? true,
      enabled: !!params.callerId && (config?.enabled ?? true),
    }
  )
}

function useGetCatalogList(
  params: EServiceGetCatalogListUrlParams,
  config?: { suspense?: boolean; keepPreviousData?: boolean }
) {
  return useQueryWrapper(
    [EServiceQueryKeys.GetCatalogList, params],
    () => EServiceServices.getCatalogList(params),
    config
  )
}

function useGetProviderList(
  params: EServiceGetProviderListUrlParams,
  config?: { suspense?: boolean; keepPreviousData?: boolean }
) {
  return useQueryWrapper(
    [EServiceQueryKeys.GetProviderList, params],
    () => EServiceServices.getProviderList(params),
    config
  )
}

function useGetSingle(eserviceId?: string, config?: { suspense?: boolean; enabled?: boolean }) {
  return useQueryWrapper(
    [EServiceQueryKeys.GetSingle, eserviceId],
    () => EServiceServices.getSingle(eserviceId!),
    { ...config, enabled: Boolean(eserviceId) && (config?.enabled ?? true) }
  )
}

function useGetDescriptorCatalog(
  eserviceId: string,
  descriptorId: string,
  config?: { suspense?: boolean; enabled?: boolean }
) {
  return useQueryWrapper(
    [EServiceQueryKeys.GetDescriptorCatalog, eserviceId, descriptorId],
    () => EServiceServices.getDescriptorCatalog(eserviceId, descriptorId),
    config
  )
}

function useGetDescriptorProvider(
  eserviceId?: string,
  descriptorId?: string,
  config?: { suspense?: boolean; enabled?: boolean }
) {
  return useQueryWrapper(
    [EServiceQueryKeys.GetDescriptorProvider, eserviceId, descriptorId],
    () => EServiceServices.getDescriptorProvider(eserviceId!, descriptorId!),
    {
      enabled: Boolean(eserviceId && descriptorId) && (config?.enabled ?? true),
      ...config,
    }
  )
}

/** @deprecated TO BE REMOVED */
function useGetSingleFlat(
  eserviceId: string,
  descriptorId: string | undefined,
  config = { enabled: true }
) {
  const { jwt } = useJwt()
  const { data: eservices } = useGetListFlat(
    { callerId: jwt?.organizationId, state: 'PUBLISHED' },
    config
  )

  return React.useMemo(() => {
    return eservices?.find(
      (eservice) => eservice.id === eserviceId && eservice.descriptorId === descriptorId
    )
  }, [eservices, eserviceId, descriptorId])
}

function usePrefetchSingle() {
  const queryClient = useQueryClient()
  return (eserviceId: string) =>
    queryClient.prefetchQuery([EServiceQueryKeys.GetSingle, eserviceId], () =>
      EServiceServices.getSingle(eserviceId)
    )
}

function usePrefetchDescriptorCatalog() {
  const queryClient = useQueryClient()
  return (eserviceId: string, descriptorId: string) =>
    queryClient.prefetchQuery(
      [EServiceQueryKeys.GetDescriptorCatalog, eserviceId, descriptorId],
      () => EServiceServices.getDescriptorCatalog(eserviceId, descriptorId)
    )
}

function usePrefetchDescriptorProvider() {
  const queryClient = useQueryClient()
  return (eserviceId: string, descriptorId: string) =>
    queryClient.prefetchQuery(
      [EServiceQueryKeys.GetDescriptorProvider, eserviceId, descriptorId],
      () => EServiceServices.getDescriptorProvider(eserviceId, descriptorId)
    )
}

function useCreateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.createDraft' })
  return useMutationWrapper(EServiceServices.createDraft, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.updateDraft' })
  return useMutationWrapper(EServiceServices.updateDraft, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useDeleteDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.deleteDraft' })
  const queryClient = useQueryClient()

  return useMutationWrapper(EServiceServices.deleteDraft, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { eserviceId }) {
      queryClient.removeQueries([EServiceQueryKeys.GetSingle, eserviceId])
    },
  })
}

function useCloneFromVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.cloneFromVersion' })

  return useMutationWrapper(EServiceServices.cloneFromVersion, {
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

function useCreateVersionDraft(
  config = { suppressSuccessToast: false, showConfirmationDialog: true }
) {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.createVersionDraft' })
  return useMutationWrapper(
    (
      payload: {
        eserviceId: string
      } & EServiceVersionDraftPayload
    ) => EServiceServices.createVersionDraft(payload),
    {
      suppressSuccessToast: config.suppressSuccessToast,
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      showConfirmationDialog: config.showConfirmationDialog,
      dialogConfig: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
    }
  )
}

function useUpdateVersionDraft(config = { suppressSuccessToast: false }) {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateVersionDraft',
  })
  return useMutationWrapper(
    (
      payload: {
        eserviceId: string
        descriptorId: string
      } & EServiceVersionDraftPayload
    ) => EServiceServices.updateVersionDraft(payload),
    {
      suppressSuccessToast: config.suppressSuccessToast,
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    }
  )
}

function usePublishVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.publishVersionDraft',
  })
  return useMutationWrapper(EServiceServices.publishVersionDraft, {
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

function useSuspendVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.suspendVersion' })
  return useMutationWrapper(EServiceServices.suspendVersion, {
    loadingLabel: t('loading'),
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useReactivateVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.reactivateVersion' })
  return useMutationWrapper(EServiceServices.reactivateVersion, {
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

function useDeleteVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.deleteVersionDraft',
  })
  return useMutationWrapper(EServiceServices.deleteVersionDraft, {
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

function usePostVersionDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.postVersionDraftDocument',
  })
  return useMutationWrapper(EServiceServices.postVersionDraftDocument, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useDeleteVersionDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.deleteVersionDraftDocument',
  })
  return useMutationWrapper(EServiceServices.deleteVersionDraftDocument, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useUpdateVersionDraftDocumentDescription() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateVersionDraftDocumentDescription',
  })
  return useMutationWrapper(EServiceServices.updateVersionDraftDocumentDescription, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useDownloadVersionDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.downloadVersionDraftDocument',
  })
  return useDownloadFile(EServiceServices.downloadVersionDraftDocument, {
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

export const EServiceQueries = {
  useGetListFlat,
  useGetCatalogList,
  useGetProviderList,
  useGetDescriptorCatalog,
  useGetDescriptorProvider,
  useGetSingle,
  usePrefetchSingle,
  usePrefetchDescriptorCatalog,
  usePrefetchDescriptorProvider,
  useGetSingleFlat,
}

export const EServiceMutations = {
  useCreateDraft,
  useUpdateDraft,
  useDeleteDraft,
  useCloneFromVersion,
  useCreateVersionDraft,
  useUpdateVersionDraft,
  usePublishVersionDraft,
  useSuspendVersion,
  useReactivateVersion,
  useDeleteVersionDraft,
  usePostVersionDraftDocument,
  useDeleteVersionDraftDocument,
  useUpdateVersionDraftDocumentDescription,
}

export const EServiceDownloads = {
  useDownloadVersionDocument,
}
