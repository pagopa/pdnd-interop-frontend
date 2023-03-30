import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import EServiceServices from './eservice.services'
import { useDownloadFile } from '../react-query-wrappers/useDownloadFile'
import type { UseQueryWrapperOptions } from '../react-query-wrappers/react-query-wrappers.types'
import type {
  CatalogEServices,
  EServiceDescriptorSeed,
  GetConsumersParams,
  GetEServicesCatalogParams,
  GetProducerEServicesParams,
  GetProducersParams,
  ProducerEServices,
  UpdateEServiceDescriptorSeed,
} from '../api.generatedTypes'

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
  config?: UseQueryWrapperOptions<CatalogEServices>
) {
  return useQueryWrapper(
    [EServiceQueryKeys.GetCatalogList, params],
    () => EServiceServices.getCatalogList(params),
    config
  )
}

function useGetProviderList(
  params: GetProducerEServicesParams,
  config?: UseQueryWrapperOptions<ProducerEServices>
) {
  return useQueryWrapper(
    [EServiceQueryKeys.GetProviderList, params],
    () => EServiceServices.getProviderList(params),
    config
  )
}

function useGetConsumers(
  params: GetConsumersParams,
  config?: { suspense?: boolean; keepPreviousData?: boolean }
) {
  return useQueryWrapper(
    [EServiceQueryKeys.GetConsumers, params],
    () => EServiceServices.getConsumers(params),
    config
  )
}

function useGetProducers(
  params: GetProducersParams,
  config?: { suspense?: boolean; keepPreviousData?: boolean }
) {
  return useQueryWrapper(
    [EServiceQueryKeys.GetProducers, params],
    () => EServiceServices.getProducers(params),
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
      } & EServiceDescriptorSeed
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
      } & UpdateEServiceDescriptorSeed
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
}
