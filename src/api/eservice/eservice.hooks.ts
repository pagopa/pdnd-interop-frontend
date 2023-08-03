import { type UseQueryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import EServiceServices from './eservice.services'
import { useDownloadFile } from '../hooks/useDownloadFile'
import type {
  CatalogEServices,
  CompactOrganizations,
  EServiceDescriptorSeed,
  GetConsumersParams,
  GetEServicesCatalogParams,
  GetProducerEServicesParams,
  GetProducersParams,
  ProducerEServices,
  UpdateEServiceDescriptorSeed,
} from '../api.generatedTypes'
import { useAuthenticatedQuery } from '../hooks/useAuthenticatedQuery'

export enum EServiceQueryKeys {
  GetCatalogList = 'EServiceGetCatalogList',
  GetProviderList = 'EServiceGetProviderList',
  GetSingle = 'EServiceGetSingle',
  GetDescriptorCatalog = 'EServiceGetDescriptorCatalog',
  GetDescriptorProvider = 'EServiceGetDescriptorProvider',
  GetConsumers = 'EServiceGetConsumers',
  GetProducers = 'EServiceGetProducers',
}

function useGetCatalogList(
  params: GetEServicesCatalogParams,
  config?: UseQueryOptions<CatalogEServices>
) {
  return useAuthenticatedQuery(
    [EServiceQueryKeys.GetCatalogList, params],
    () => EServiceServices.getCatalogList(params),
    config
  )
}

function useGetProviderList(
  params: GetProducerEServicesParams,
  config?: UseQueryOptions<ProducerEServices>
) {
  return useAuthenticatedQuery(
    [EServiceQueryKeys.GetProviderList, params],
    () => EServiceServices.getProviderList(params),
    config
  )
}

function useGetConsumers(
  params: GetConsumersParams,
  config?: UseQueryOptions<CompactOrganizations>
) {
  return useAuthenticatedQuery(
    [EServiceQueryKeys.GetConsumers, params],
    () => EServiceServices.getConsumers(params),
    config
  )
}

function useGetProducers(
  params: GetProducersParams,
  config?: UseQueryOptions<CompactOrganizations>
) {
  return useAuthenticatedQuery(
    [EServiceQueryKeys.GetProducers, params],
    () => EServiceServices.getProducers(params),
    config
  )
}

function useGetSingle(eserviceId?: string, config?: { suspense?: boolean; enabled?: boolean }) {
  return useAuthenticatedQuery(
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
  return useAuthenticatedQuery(
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
  return useAuthenticatedQuery(
    [EServiceQueryKeys.GetDescriptorProvider, eserviceId, descriptorId],
    () => EServiceServices.getDescriptorProvider(eserviceId!, descriptorId!),
    {
      enabled: Boolean(eserviceId && descriptorId) && (config?.enabled ?? true),
      ...config,
    }
  )
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
  return useMutation(EServiceServices.createDraft, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.updateDraft' })
  return useMutation(EServiceServices.updateDraft, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.deleteDraft' })
  const queryClient = useQueryClient()

  return useMutation(EServiceServices.deleteDraft, {
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
    },
    onSuccess(_, { eserviceId }) {
      queryClient.removeQueries([EServiceQueryKeys.GetSingle, eserviceId])
    },
  })
}

function useCloneFromVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.cloneFromVersion' })

  return useMutation(EServiceServices.cloneFromVersion, {
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

function useCreateVersionDraft(
  config = { suppressSuccessToast: false, showConfirmationDialog: true }
) {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.createVersionDraft' })
  return useMutation(
    (
      payload: {
        eserviceId: string
      } & EServiceDescriptorSeed
    ) => EServiceServices.createVersionDraft(payload),
    {
      meta: {
        successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
        errorToastLabel: t('outcome.error'),
        loadingLabel: t('loading'),
        confirmationDialog: config.showConfirmationDialog
          ? {
              title: t('confirmDialog.title'),
              description: t('confirmDialog.description'),
            }
          : undefined,
      },
    }
  )
}

function useUpdateVersionDraft(config = { suppressSuccessToast: false }) {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateVersionDraft',
  })
  return useMutation(
    (
      payload: {
        eserviceId: string
        descriptorId: string
      } & UpdateEServiceDescriptorSeed
    ) => EServiceServices.updateVersionDraft(payload),
    {
      meta: {
        successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
        errorToastLabel: t('outcome.error'),
        loadingLabel: t('loading'),
      },
    }
  )
}

function usePublishVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.publishVersionDraft',
  })
  return useMutation(EServiceServices.publishVersionDraft, {
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

function useSuspendVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.suspendVersion' })
  return useMutation(EServiceServices.suspendVersion, {
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

function useReactivateVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.reactivateVersion' })
  return useMutation(EServiceServices.reactivateVersion, {
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

function useDeleteVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.deleteVersionDraft',
  })
  return useMutation(EServiceServices.deleteVersionDraft, {
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

function usePostVersionDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.postVersionDraftDocument',
  })
  return useMutation(EServiceServices.postVersionDraftDocument, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteVersionDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.deleteVersionDraftDocument',
  })
  return useMutation(EServiceServices.deleteVersionDraftDocument, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateVersionDraftDocumentDescription() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateVersionDraftDocumentDescription',
  })
  return useMutation(EServiceServices.updateVersionDraftDocumentDescription, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
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

function useDownloadConsumerList() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.downloadConsumerList',
  })
  return useDownloadFile(EServiceServices.downloadConsumerList, {
    errorToastLabel: t('outcome.error'),
    successToastLabel: t('outcome.success'),
    loadingLabel: t('loading'),
  })
}

export const EServiceQueries = {
  useGetCatalogList,
  useGetProviderList,
  useGetDescriptorCatalog,
  useGetDescriptorProvider,
  useGetSingle,
  useGetConsumers,
  useGetProducers,
  usePrefetchSingle,
  usePrefetchDescriptorCatalog,
  usePrefetchDescriptorProvider,
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
  useDownloadConsumerList,
}
