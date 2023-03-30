import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import ClientServices from './client.services'
import { useDownloadFile } from '../react-query-wrappers/useDownloadFile'
import type { UseQueryWrapperOptions } from '../react-query-wrappers/react-query-wrappers.types'
import type { CompactClients, GetClientsParams } from '../api.generatedTypes'

export enum ClientQueryKeys {
  GetList = 'ClientGetList',
  GetSingle = 'ClientGetSingle',
  GetKeyList = 'ClientGetKeyList',
  GetSingleKey = 'ClientGetSingleKey',
  GetOperatorsList = 'ClientGetOperatorsList',
  GetSingleOperator = 'ClientGetSingleOperator',
  GetClientOperatorKeys = 'ClientGetClientOperatorKeys',
}

function useGetList(params: GetClientsParams, config?: UseQueryWrapperOptions<CompactClients>) {
  return useQueryWrapper(
    [ClientQueryKeys.GetList, params],
    () => ClientServices.getList(params),
    config
  )
}

function useGetSingle(clientId: string, config = { suspense: true }) {
  return useQueryWrapper(
    [ClientQueryKeys.GetSingle, clientId],
    () => ClientServices.getSingle(clientId),
    config
  )
}

function usePrefetchSingle() {
  const queryClient = useQueryClient()
  return (clientId: string) =>
    queryClient.prefetchQuery([ClientQueryKeys.GetSingle, clientId], () =>
      ClientServices.getSingle(clientId)
    )
}

function useGetKeyList(clientId: string) {
  return useQueryWrapper(
    [ClientQueryKeys.GetKeyList, clientId],
    () => ClientServices.getKeyList(clientId),
    {
      skipThrowOn404Error: true,
    }
  )
}

function useGetSingleKey(clientId: string, kid: string, config = { suspense: true }) {
  return useQueryWrapper(
    [ClientQueryKeys.GetSingleKey, clientId, kid],
    () => ClientServices.getSingleKey(clientId, kid),
    config
  )
}

function usePrefetchSingleKey() {
  const queryClient = useQueryClient()
  return (clientId: string, kid: string) =>
    queryClient.prefetchQuery([ClientQueryKeys.GetKeyList, clientId, kid], () =>
      ClientServices.getSingleKey(clientId, kid)
    )
}

function useGetOperatorsList(clientId: string, config = { suspense: true }) {
  return useQueryWrapper(
    [ClientQueryKeys.GetOperatorsList, clientId],
    () => ClientServices.getOperatorList(clientId),
    config
  )
}

function useGetSingleOperator(relationshipId: string, config = { suspense: true }) {
  return useQueryWrapper(
    [ClientQueryKeys.GetSingleOperator, relationshipId],
    () => ClientServices.getSingleOperator(relationshipId),
    config
  )
}

function usePrefetchSingleOperator() {
  const queryClient = useQueryClient()
  return (relationshipId: string) =>
    queryClient.prefetchQuery([ClientQueryKeys.GetSingleOperator, relationshipId], () =>
      ClientServices.getSingleOperator(relationshipId)
    )
}

function useGetOperatorKeys(clientId: string, operatorId: string) {
  return useQueryWrapper([ClientQueryKeys.GetClientOperatorKeys, clientId, operatorId], () =>
    ClientServices.getOperatorKeys(clientId, operatorId)
  )
}

function useCreate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.create' })
  return useMutationWrapper(ClientServices.create, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useCreateInteropM2M() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.createInteropM2M' })
  return useMutationWrapper(ClientServices.createInteropM2M, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useDelete() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.deleteOne' })
  return useMutationWrapper(ClientServices.deleteOne, {
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

function usePostKey() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.postKey' })
  return useMutationWrapper(ClientServices.postKey, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useDeleteKey() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.deleteKey' })
  return useMutationWrapper(ClientServices.deleteKey, {
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

function useDownloadKey() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.downloadKey' })
  return useDownloadFile(ClientServices.downloadKey, {
    loadingLabel: t('loading'),
  })
}

function useAddOperator(
  config: { suppressSuccessToast: boolean } = { suppressSuccessToast: false }
) {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.addOperator' })
  return useMutationWrapper(ClientServices.addOperator, {
    suppressSuccessToast: config.suppressSuccessToast,
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useRemoveOperator() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.removeOperator' })
  return useMutationWrapper(ClientServices.removeOperator, {
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

export const ClientQueries = {
  useGetList,
  useGetSingle,
  usePrefetchSingle,
  useGetKeyList,
  useGetSingleKey,
  usePrefetchSingleKey,
  useGetOperatorsList,
  useGetSingleOperator,
  usePrefetchSingleOperator,
  useGetOperatorKeys,
}

export const ClientMutations = {
  useCreate,
  useCreateInteropM2M,
  useDelete,
  usePostKey,
  useDeleteKey,
  useAddOperator,
  useRemoveOperator,
}

export const ClientDownloads = {
  useDownloadKey,
}
