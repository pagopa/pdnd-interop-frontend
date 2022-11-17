import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import EServiceServices from './eservice.services'
import {
  EServiceGetCatalogListUrlParams,
  EServiceGetListFlatUrlParams,
  EServiceVersionDraftPayload,
} from './eservice.api.types'
import { useJwt } from '@/hooks/useJwt'
import { URL_FRAGMENTS } from '@/router/utils'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'

export enum EServiceQueryKeys {
  /** @deprecated TO BE REMOVED */
  GetListFlat = 'EServiceGetListFlat',
  GetCatalogList = 'EServiceGetCatalogList',
  GetSingle = 'EServiceGetSingle',
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

function useGetCatalogList(params: EServiceGetCatalogListUrlParams) {
  return useQueryWrapper([EServiceQueryKeys.GetCatalogList, params], () =>
    EServiceServices.getCatalogList(params)
  )
}

function useGetSingle(eserviceId?: string, descriptorId?: string, config = { suspense: true }) {
  return useQueryWrapper(
    [EServiceQueryKeys.GetSingle, eserviceId, descriptorId],
    () => EServiceServices.getSingle(eserviceId!, descriptorId!),
    { enabled: Boolean(eserviceId && descriptorId), ...config }
  )
}

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
  return (eserviceId: string, descriptorId: string) =>
    queryClient.prefetchQuery([EServiceQueryKeys.GetSingle, eserviceId, descriptorId], () =>
      EServiceServices.getSingle(eserviceId, descriptorId)
    )
}

function useCreateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.createDraft' })
  const currentLanguage = useCurrentLanguage()
  const queryClient = useQueryClient()
  return useMutationWrapper(EServiceServices.createDraft, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(data) {
      queryClient.invalidateQueries([EServiceQueryKeys.GetListFlat])
      queryClient.invalidateQueries([EServiceQueryKeys.GetCatalogList])
      queryClient.setQueryData(
        [EServiceQueryKeys.GetSingle, data.id, URL_FRAGMENTS.FIRST_DRAFT[currentLanguage]],
        data
      )
    },
  })
}

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.updateDraft' })
  const queryClient = useQueryClient()
  return useMutationWrapper(EServiceServices.updateDraft, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(data) {
      queryClient.invalidateQueries([EServiceQueryKeys.GetListFlat])
      queryClient.invalidateQueries([EServiceQueryKeys.GetCatalogList])
      queryClient.invalidateQueries([EServiceQueryKeys.GetSingle, data.id])
    },
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
      queryClient.invalidateQueries([EServiceQueryKeys.GetListFlat])
      queryClient.invalidateQueries([EServiceQueryKeys.GetCatalogList])
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
  const queryClient = useQueryClient()
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
      onSuccess(_, { eserviceId }) {
        queryClient.invalidateQueries([EServiceQueryKeys.GetSingle, eserviceId])
        queryClient.invalidateQueries([EServiceQueryKeys.GetListFlat])
        queryClient.invalidateQueries([EServiceQueryKeys.GetCatalogList])
      },
    }
  )
}

function useUpdateVersionDraft(config = { suppressSuccessToast: false }) {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateVersionDraft',
  })
  const queryClient = useQueryClient()
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
      onSuccess(_, { eserviceId }) {
        queryClient.invalidateQueries([EServiceQueryKeys.GetSingle, eserviceId])
      },
    }
  )
}

function usePublishVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.publishVersionDraft',
  })
  const queryClient = useQueryClient()
  return useMutationWrapper(EServiceServices.publishVersionDraft, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { eserviceId }) {
      queryClient.invalidateQueries([EServiceQueryKeys.GetListFlat])
      queryClient.invalidateQueries([EServiceQueryKeys.GetCatalogList])
      queryClient.invalidateQueries([EServiceQueryKeys.GetSingle, eserviceId])
    },
  })
}

function useSuspendVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.suspendVersion' })
  const queryClient = useQueryClient()
  return useMutationWrapper(EServiceServices.suspendVersion, {
    loadingLabel: t('loading'),
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { eserviceId }) {
      queryClient.invalidateQueries([EServiceQueryKeys.GetListFlat])
      queryClient.invalidateQueries([EServiceQueryKeys.GetCatalogList])
      queryClient.invalidateQueries([EServiceQueryKeys.GetSingle, eserviceId])
    },
  })
}

function useReactivateVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.reactivateVersion' })
  const queryClient = useQueryClient()
  return useMutationWrapper(EServiceServices.reactivateVersion, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { eserviceId }) {
      queryClient.invalidateQueries([EServiceQueryKeys.GetListFlat])
      queryClient.invalidateQueries([EServiceQueryKeys.GetCatalogList])
      queryClient.invalidateQueries([EServiceQueryKeys.GetSingle, eserviceId])
    },
  })
}

function useDeleteVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.deleteVersionDraft',
  })
  const queryClient = useQueryClient()
  return useMutationWrapper(EServiceServices.deleteVersionDraft, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess() {
      queryClient.invalidateQueries([EServiceQueryKeys.GetListFlat])
      queryClient.invalidateQueries([EServiceQueryKeys.GetCatalogList])
    },
  })
}

function usePostVersionDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.postVersionDraftDocument',
  })
  const queryClient = useQueryClient()
  return useMutationWrapper(EServiceServices.postVersionDraftDocument, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(_, { eserviceId }) {
      queryClient.invalidateQueries([EServiceQueryKeys.GetSingle, eserviceId])
    },
  })
}

function useDeleteVersionDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.deleteVersionDraftDocument',
  })
  const queryClient = useQueryClient()
  return useMutationWrapper(EServiceServices.deleteVersionDraftDocument, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(_, { eserviceId }) {
      queryClient.invalidateQueries([EServiceQueryKeys.GetSingle, eserviceId])
    },
  })
}

function useUpdateVersionDraftDocumentDescription() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateVersionDraftDocumentDescription',
  })
  const queryClient = useQueryClient()
  return useMutationWrapper(EServiceServices.updateVersionDraftDocumentDescription, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(_, { eserviceId }) {
      queryClient.invalidateQueries([EServiceQueryKeys.GetSingle, eserviceId])
    },
  })
}

function useDownloadVersionDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.downloadVersionDraftDocument',
  })
  return useMutationWrapper(EServiceServices.downloadVersionDraftDocument, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

export const EServiceQueries = {
  useGetListFlat,
  useGetCatalogList,
  useGetSingle,
  usePrefetchSingle,
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
  useDownloadVersionDocument,
}
