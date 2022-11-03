import { PartyAttributes } from '@/types/attribute.types'
import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import AttributeServices from './attribute.services'

export enum AttributeQueryKeys {
  GetAll = 'AttributeGetAll',
  GetSingle = 'AttributeGetSingle',
  GetPartyCertifiedList = 'AttributeGetPartyCertifiedList',
  GetPartyVerifiedList = 'AttributeGetPartyVerifiedList',
  GetPartyDeclaredList = 'AttributeGetPartyDeclaredList',
}

function useGetAll(search?: string) {
  return useQueryWrapper([AttributeQueryKeys.GetAll, search], () =>
    AttributeServices.getAll(search ? { search } : undefined)
  )
}

function useGetSingle(attributeId: string) {
  return useQueryWrapper([AttributeQueryKeys.GetSingle, attributeId], () =>
    AttributeServices.getSingle(attributeId)
  )
}

function usePrefetchSingle() {
  const queryClient = useQueryClient()
  return (attributeId: string) =>
    queryClient.prefetchQuery(
      [AttributeQueryKeys.GetSingle, attributeId],
      () => AttributeServices.getSingle(attributeId),
      { staleTime: 180000 }
    )
}

function useGetPartyCertifiedList(partyId?: string) {
  return useQueryWrapper(
    [AttributeQueryKeys.GetPartyCertifiedList, partyId],
    () => AttributeServices.getPartyCertifiedList(partyId!),
    {
      enabled: !!partyId,
    }
  )
}

function useGetPartyVerifiedList(partyId?: string) {
  return useQueryWrapper(
    [AttributeQueryKeys.GetPartyVerifiedList, partyId],
    () => AttributeServices.getPartyVerifiedList(partyId!),
    {
      enabled: !!partyId,
    }
  )
}

function useGetPartyDeclaredList(partyId?: string) {
  return useQueryWrapper(
    [AttributeQueryKeys.GetPartyDeclaredList, partyId],
    () => AttributeServices.getPartyDeclaredList(partyId!),
    {
      enabled: !!partyId,
    }
  )
}

function useGetAllPartyAttributes(partyId?: string): PartyAttributes {
  const { data: certified = [] } = useGetPartyCertifiedList(partyId)
  const { data: verified = [] } = useGetPartyVerifiedList(partyId)
  const { data: declared = [] } = useGetPartyDeclaredList(partyId)

  return { certified, verified, declared }
}

function useCreate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'attribute.create' })
  const queryClient = useQueryClient()
  return useMutationWrapper(AttributeServices.create, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(data) {
      queryClient.setQueryData([AttributeQueryKeys.GetSingle, data.id], data)
      let keyToInvalidate: QueryKey | null = null
      if (data.kind === 'CERTIFIED') {
        keyToInvalidate = [AttributeQueryKeys.GetPartyCertifiedList]
      }
      if (data.kind === 'VERIFIED') {
        keyToInvalidate = [AttributeQueryKeys.GetPartyVerifiedList]
      }
      if (data.kind === 'DECLARED') {
        keyToInvalidate = [AttributeQueryKeys.GetPartyDeclaredList]
      }
      if (keyToInvalidate) {
        queryClient.invalidateQueries(keyToInvalidate)
      }
    },
  })
}

function useVerifyPartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.verifyPartyAttribute',
  })
  const queryClient = useQueryClient()
  return useMutationWrapper(AttributeServices.verifyPartyAttribute, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { id }) {
      queryClient.invalidateQueries([AttributeQueryKeys.GetPartyVerifiedList])
      queryClient.invalidateQueries([AttributeQueryKeys.GetSingle, id])
    },
  })
}

function useRevokeVerifiedPartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.revokeVerifiedPartyAttribute',
  })
  const queryClient = useQueryClient()
  return useMutationWrapper(AttributeServices.revokeVerifiedPartyAttribute, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { attributeId }) {
      queryClient.invalidateQueries([AttributeQueryKeys.GetPartyVerifiedList])
      queryClient.invalidateQueries([AttributeQueryKeys.GetSingle, attributeId])
    },
  })
}

function useDeclarePartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.declarePartyAttribute',
  })
  const queryClient = useQueryClient()
  return useMutationWrapper(AttributeServices.declarePartyAttribute, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { id }) {
      queryClient.invalidateQueries([AttributeQueryKeys.GetPartyDeclaredList])
      queryClient.invalidateQueries([AttributeQueryKeys.GetSingle, id])
    },
  })
}

function useRevokeDeclaredPartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.revokeDeclaredPartyAttribute',
  })
  const queryClient = useQueryClient()
  return useMutationWrapper(AttributeServices.revokeDeclaredPartyAttribute, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
    onSuccess(_, { attributeId }) {
      queryClient.invalidateQueries([AttributeQueryKeys.GetPartyDeclaredList])
      queryClient.invalidateQueries([AttributeQueryKeys.GetSingle, attributeId])
    },
  })
}

export const AttributeQueries = {
  useGetAll,
  useGetSingle,
  usePrefetchSingle,
  useGetPartyCertifiedList,
  useGetPartyVerifiedList,
  useGetPartyDeclaredList,
  useGetAllPartyAttributes,
}

export const AttributeMutations = {
  useCreate,
  useVerifyPartyAttribute,
  useRevokeVerifiedPartyAttribute,
  useDeclarePartyAttribute,
  useRevokeDeclaredPartyAttribute,
}
