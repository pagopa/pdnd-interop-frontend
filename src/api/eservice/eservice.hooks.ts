import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import EServiceServices from './eservice.services'
import { EServiceGetAllFlatUrlParams, EServiceVersionDraftPayload } from './eservice.api.types'
import { useNavigateRouter } from '@/router'
import { useJwt } from '@/hooks/useJwt'

export enum EServiceQueryKeys {
  GetAllFlat = 'EServiceGetAllFlat',
  GetSingle = 'EServiceGetSingle',
}

function useGetAllFlat(params: EServiceGetAllFlatUrlParams) {
  return useQueryWrapper(
    [EServiceQueryKeys.GetAllFlat, params],
    () => EServiceServices.getAllFlat(params),
    {
      enabled: !!params.callerId,
    }
  )
}

function useGetSingle(eserviceId?: string, descriptorId?: string) {
  return useQueryWrapper(
    [EServiceQueryKeys.GetSingle, eserviceId, descriptorId],
    () => EServiceServices.getSingle(eserviceId!, descriptorId!),
    { enabled: Boolean(eserviceId && descriptorId) }
  )
}

function useGetSingleFlat(eserviceId: string, descriptorId: string | undefined) {
  const { jwt } = useJwt()
  const { data: eservices } = useGetAllFlat({ callerId: jwt?.organizationId, state: 'PUBLISHED' })

  return React.useMemo(() => {
    return eservices?.find(
      (eservice) => eservice.id === eserviceId && eservice.descriptorId === descriptorId
    )
  }, [eservices, eserviceId, descriptorId])
}

function usePrefetchSingle() {
  const queryClient = useQueryClient()
  return (eserviceId: string, descriptorId: string) =>
    queryClient.prefetchQuery(
      [EServiceQueryKeys.GetSingle, eserviceId],
      () => EServiceServices.getSingle(eserviceId, descriptorId),
      { staleTime: 180000 }
    )
}

function useCreateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.createDraft' })
  const queryClient = useQueryClient()
  return useMutationWrapper(EServiceServices.upsertDraft, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(data) {
      queryClient.setQueryData([EServiceQueryKeys.GetSingle, data.id], data)
    },
  })
}

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.updateDraft' })
  const queryClient = useQueryClient()
  return useMutationWrapper(EServiceServices.upsertDraft, {
    suppressSuccessToast: true,
    errorToastLabel: t('loading'),
    loadingLabel: t('outcome.error'),
    onSuccess(data) {
      queryClient.setQueryData([EServiceQueryKeys.GetSingle, data.id], data)
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
      queryClient.invalidateQueries([EServiceQueryKeys.GetAllFlat])
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

function useCreateVersionDraft(redirectToDraftPage = true) {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.createVersionDraft' })
  const { navigate } = useNavigateRouter()
  const queryClient = useQueryClient()
  return useMutationWrapper(
    (
      payload: {
        eserviceId: string
      } & EServiceVersionDraftPayload
    ) => EServiceServices.upsertVersionDraft(payload),
    {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      showConfirmationDialog: true,
      dialogConfig: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
      onSuccess({ id }, { eserviceId }) {
        if (redirectToDraftPage) {
          navigate('PROVIDE_ESERVICE_EDIT', { params: { eserviceId, descriptorId: id } })
        }
        queryClient.invalidateQueries([EServiceQueryKeys.GetSingle, eserviceId])
      },
    }
  )
}

function useUpdateVersionDraft(redirectToDraftPage = true) {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateVersionDraft',
  })
  const { navigate } = useNavigateRouter()
  const queryClient = useQueryClient()
  return useMutationWrapper(
    (
      payload: {
        eserviceId: string
        descriptorId: string
      } & EServiceVersionDraftPayload
    ) => EServiceServices.upsertVersionDraft(payload),
    {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      onSuccess({ id }, { eserviceId }) {
        if (redirectToDraftPage) {
          navigate('PROVIDE_ESERVICE_EDIT', { params: { eserviceId, descriptorId: id } })
        }
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
      queryClient.invalidateQueries([EServiceQueryKeys.GetAllFlat])
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
      console.log('SUCCESS')
      queryClient.invalidateQueries([EServiceQueryKeys.GetAllFlat])
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
      queryClient.invalidateQueries([EServiceQueryKeys.GetAllFlat])
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
    onSuccess(_, { eserviceId }) {
      queryClient.invalidateQueries([[EServiceQueryKeys.GetSingle, eserviceId]])
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
  useGetAllFlat,
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
