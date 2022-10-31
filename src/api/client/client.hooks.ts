import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import ClientServices from './client.services'
import { ClientGetAllUrlParams } from './client.api.types'

export enum ClientQueryKeys {
  GetAll = 'ClientGetAll',
  GetSingle = 'ClientGetSingle',
}

function useGetAll(params: ClientGetAllUrlParams) {
  return useQueryWrapper([ClientQueryKeys.GetAll, params], () => ClientServices.getAll(params), {
    enabled: !!params.consumerId,
  })
}

function useGetSingle(clientId: string) {
  return useQueryWrapper([ClientQueryKeys.GetSingle, clientId], () =>
    ClientServices.getSingle(clientId)
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

function useCreate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'client.create' })
  const queryClient = useQueryClient()
  return useMutationWrapper(ClientServices.create, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(data) {
      queryClient.invalidateQueries([ClientQueryKeys.GetAll])
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
      queryClient.invalidateQueries([ClientQueryKeys.GetAll])
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

export const ClientQueries = {
  useGetAll,
  useGetSingle,
  usePrefetchSingle,
}

export const ClientMutations = {
  useCreate,
  useDelete,
  useJoinWithPurpose,
  useRemoveFromPurpose,
}
