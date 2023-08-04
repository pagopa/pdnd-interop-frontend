import { type UseQueryOptions, useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import ClientServices from './client.services'
import { useDownloadFile } from '../hooks/useDownloadFile'
import type {
  Client,
  CompactClients,
  GetClientsParams,
  Operators,
  PublicKey,
  RelationshipInfo,
} from '../api.generatedTypes'
import { NotFoundError } from '@/utils/errors.utils'

export enum ClientQueryKeys {
  GetList = 'ClientGetList',
  GetSingle = 'ClientGetSingle',
  GetKeyList = 'ClientGetKeyList',
  GetSingleKey = 'ClientGetSingleKey',
  GetOperatorsList = 'ClientGetOperatorsList',
  GetSingleOperator = 'ClientGetSingleOperator',
  GetClientOperatorKeys = 'ClientGetClientOperatorKeys',
}

function useGetList(params: GetClientsParams, config?: UseQueryOptions<CompactClients>) {
  return useQuery({
    queryKey: [ClientQueryKeys.GetList, params],
    queryFn: () => ClientServices.getList(params),
    ...config,
  })
}

function useGetSingle(clientId: string, config?: UseQueryOptions<Client>) {
  return useQuery({
    queryKey: [ClientQueryKeys.GetSingle, clientId],
    queryFn: () => ClientServices.getSingle(clientId),
    ...config,
  })
}

function usePrefetchSingle() {
  const queryClient = useQueryClient()
  return (clientId: string) =>
    queryClient.prefetchQuery([ClientQueryKeys.GetSingle, clientId], () =>
      ClientServices.getSingle(clientId)
    )
}

function useGetKeyList(clientId: string) {
  return useQuery({
    queryKey: [ClientQueryKeys.GetKeyList, clientId],
    queryFn: () => ClientServices.getKeyList(clientId),
    useErrorBoundary: (error) => {
      // The error boundary is disabled for 404 errors because the `getKeyList` service
      // returns 404 if the client has no keys associated.
      return !(error instanceof NotFoundError)
    },
  })
}

function useGetSingleKey(clientId: string, kid: string, config?: UseQueryOptions<PublicKey>) {
  return useQuery({
    queryKey: [ClientQueryKeys.GetSingleKey, clientId, kid],
    queryFn: () => ClientServices.getSingleKey(clientId, kid),
    ...config,
  })
}

function usePrefetchSingleKey() {
  const queryClient = useQueryClient()
  return (clientId: string, kid: string) =>
    queryClient.prefetchQuery([ClientQueryKeys.GetKeyList, clientId, kid], () =>
      ClientServices.getSingleKey(clientId, kid)
    )
}

function useGetOperatorsList(clientId: string, config?: UseQueryOptions<Operators>) {
  return useQuery({
    queryKey: [ClientQueryKeys.GetOperatorsList, clientId],
    queryFn: () => ClientServices.getOperatorList(clientId),
    ...config,
  })
}

function useGetSingleOperator(relationshipId: string, config?: UseQueryOptions<RelationshipInfo>) {
  return useQuery({
    queryKey: [ClientQueryKeys.GetSingleOperator, relationshipId],
    queryFn: () => ClientServices.getSingleOperator(relationshipId),
    ...config,
  })
}

function usePrefetchSingleOperator() {
  const queryClient = useQueryClient()
  return (relationshipId: string) =>
    queryClient.prefetchQuery([ClientQueryKeys.GetSingleOperator, relationshipId], () =>
      ClientServices.getSingleOperator(relationshipId)
    )
}

function useGetOperatorKeys(clientId: string, operatorId: string) {
  return useQuery({
    queryKey: [ClientQueryKeys.GetClientOperatorKeys, clientId, operatorId],
    queryFn: () => ClientServices.getOperatorKeys(clientId, operatorId),
  })
}

function useCreate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.create' })
  return useMutation(ClientServices.create, {
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useCreateInteropM2M() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.createInteropM2M' })
  return useMutation(ClientServices.createInteropM2M, {
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDelete() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.deleteOne' })
  return useMutation(ClientServices.deleteOne, {
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

function usePostKey() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.postKey' })
  return useMutation(ClientServices.postKey, {
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteKey() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.deleteKey' })
  return useMutation(ClientServices.deleteKey, {
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
  return useMutation(ClientServices.addOperator, {
    meta: {
      successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useRemoveOperator() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.removeOperator' })
  return useMutation(ClientServices.removeOperator, {
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
