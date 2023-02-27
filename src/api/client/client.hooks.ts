import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import ClientServices from './client.services'
import type { ClientGetListUrlParams, ClientGetOperatorsListUrlParams } from './client.api.types'
import { useDownloadFile } from '../react-query-wrappers/useDownloadFile'

export enum ClientQueryKeys {
  GetList = 'ClientGetList',
  GetSingle = 'ClientGetSingle',
  GetKeyList = 'ClientGetKeyList',
  GetSingleKey = 'ClientGetSingleKey',
  GetOperatorsList = 'ClientGetOperatorsList',
  GetSingleOperator = 'ClientGetSingleOperator',
  GetClientOperatorKeys = 'ClientGetClientOperatorKeys',
}

function useGetList(params: ClientGetListUrlParams, config = { suspense: true }) {
  const queryClient = useQueryClient()
  return useQueryWrapper([ClientQueryKeys.GetList, params], () => ClientServices.getList(params), {
    enabled: !!params.consumerId,
    ...config,
    onSuccess(data) {
      data.forEach((client) => {
        queryClient.setQueryData([ClientQueryKeys.GetSingle, client.id], client)
      })
    },
  })
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

function useGetOperatorsList(
  clientId: string,
  params?: ClientGetOperatorsListUrlParams,
  config = { suspense: true }
) {
  return useQueryWrapper(
    [ClientQueryKeys.GetOperatorsList, clientId, params],
    () => ClientServices.getOperatorList(clientId, params),
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
  const queryClient = useQueryClient()
  return useMutationWrapper(ClientServices.create, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(data) {
      queryClient.setQueryData([ClientQueryKeys.GetSingle, data.id], data)
    },
  })
}

function useCreateInteropM2M() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.createInteropM2M' })
  const queryClient = useQueryClient()
  return useMutationWrapper(ClientServices.createInteropM2M, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(data) {
      queryClient.setQueryData([ClientQueryKeys.GetSingle, data.id], data)
    },
  })
}

function useDelete() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.deleteOne' })
  const queryClient = useQueryClient()
  return useMutationWrapper(ClientServices.deleteOne, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { clientId }) {
      queryClient.removeQueries([ClientQueryKeys.GetSingle, clientId])
    },
  })
}

function usePostKey() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.postKey' })
  const queryClient = useQueryClient()
  return useMutationWrapper(ClientServices.postKey, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(data, { clientId }) {
      if (data.length > 0) {
        queryClient.setQueryData([ClientQueryKeys.GetSingleKey, clientId, data[0].key.kid], data[0])
      }
    },
  })
}

function useDeleteKey() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.deleteKey' })
  const queryClient = useQueryClient()
  return useMutationWrapper(ClientServices.deleteKey, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { clientId, kid }) {
      queryClient.removeQueries([ClientQueryKeys.GetSingleKey, clientId, kid])
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
  const queryClient = useQueryClient()
  return useMutationWrapper(ClientServices.addOperator, {
    suppressSuccessToast: config.suppressSuccessToast,
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(data, { clientId }) {
      queryClient.setQueryData([ClientQueryKeys.GetSingle, clientId], data)
    },
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
