import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import ClientServices from './client.services'
import { ClientGetListUrlParams, ClientGetOperatorsListUrlParams } from './client.api.types'

export enum ClientQueryKeys {
  GetList = 'ClientGetList',
  GetSingle = 'ClientGetSingle',
  GetKeyList = 'ClientGetKeyList',
  GetSingleKey = 'ClientGetSingleKey',
  GetOperatorsList = 'ClientGetOperatorsList',
  GetSingleOperator = 'ClientGetSingleOperator',
  GetClientOperatorKeys = 'ClientGetClientOperatorKeys',
}

function useGetList(params: ClientGetListUrlParams) {
  return useQueryWrapper([ClientQueryKeys.GetList, params], () => ClientServices.getList(params), {
    enabled: !!params.consumerId,
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
    queryClient.prefetchQuery(
      [ClientQueryKeys.GetSingle, clientId],
      () => ClientServices.getSingle(clientId),
      { staleTime: 180000 }
    )
}

function useGetKeyList(clientId: string) {
  return useQueryWrapper([ClientQueryKeys.GetKeyList, clientId], () =>
    ClientServices.getKeyList(clientId)
  )
}

function useGetSingleKey(clientId: string, kid: string) {
  return useQueryWrapper([ClientQueryKeys.GetSingleKey, clientId, kid], () =>
    ClientServices.getSingleKey(clientId, kid)
  )
}

function usePrefetchSingleKey() {
  const queryClient = useQueryClient()
  return (clientId: string, kid: string) =>
    queryClient.prefetchQuery(
      [ClientQueryKeys.GetKeyList, clientId, kid],
      () => ClientServices.getSingleKey(clientId, kid),
      { staleTime: 180000 }
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
    queryClient.prefetchQuery(
      [ClientQueryKeys.GetSingleOperator, relationshipId],
      () => ClientServices.getSingleOperator(relationshipId),
      { staleTime: 180000 }
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
      queryClient.invalidateQueries([ClientQueryKeys.GetList])
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
      queryClient.invalidateQueries([ClientQueryKeys.GetList])
      queryClient.removeQueries([ClientQueryKeys.GetSingle, clientId])
    },
  })
}

function useJoinWithPurpose() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.joinWithPurpose' })
  const queryClient = useQueryClient()
  return useMutationWrapper(ClientServices.joinWithPurpose, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(_, { clientId }) {
      queryClient.invalidateQueries([ClientQueryKeys.GetSingle, clientId])
    },
  })
}

function useRemoveFromPurpose() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.removeFromPurpose' })
  const queryClient = useQueryClient()
  return useMutationWrapper(ClientServices.removeFromPurpose, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { clientId }) {
      queryClient.invalidateQueries([ClientQueryKeys.GetSingle, clientId])
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
      queryClient.invalidateQueries([ClientQueryKeys.GetKeyList, clientId])
      queryClient.setQueryData([ClientQueryKeys.GetSingleKey, clientId, data.key.kid], data)
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
      queryClient.invalidateQueries([ClientQueryKeys.GetKeyList, clientId])
      queryClient.removeQueries([ClientQueryKeys.GetSingleKey, clientId, kid])
    },
  })
}

function useDownloadKey() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.downloadKey' })
  return useMutationWrapper(ClientServices.downloadKey, {
    suppressSuccessToast: true,
    suppressErrorToast: true,
    loadingLabel: t('loading'),
  })
}

function useAddOperator() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.addOperator' })
  const queryClient = useQueryClient()
  return useMutationWrapper(ClientServices.addOperator, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(data, { clientId }) {
      queryClient.invalidateQueries([ClientQueryKeys.GetList])
      queryClient.invalidateQueries([ClientQueryKeys.GetOperatorsList, clientId])
      queryClient.setQueryData([ClientQueryKeys.GetSingle, clientId], data)
    },
  })
}

function useRemoveOperator() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.removeOperator' })
  const queryClient = useQueryClient()
  return useMutationWrapper(ClientServices.removeOperator, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { clientId }) {
      queryClient.invalidateQueries([ClientQueryKeys.GetList])
      queryClient.invalidateQueries([ClientQueryKeys.GetOperatorsList, clientId])
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
  useDelete,
  useJoinWithPurpose,
  useRemoveFromPurpose,
  usePostKey,
  useDeleteKey,
  useDownloadKey,
  useAddOperator,
  useRemoveOperator,
}
