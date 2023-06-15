import { useQueries, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import AttributeServices from './attribute.services'
import type { Attribute, Attributes, GetAttributesParams } from '../api.generatedTypes'
import type { UseQueryWrapperOptions } from '../react-query-wrappers/react-query-wrappers.types'

export enum AttributeQueryKeys {
  GetList = 'AttributeGetList',
  GetSingle = 'AttributeGetSingle',
  GetPartyCertifiedList = 'AttributeGetPartyCertifiedList',
  GetPartyVerifiedList = 'AttributeGetPartyVerifiedList',
  GetPartyDeclaredList = 'AttributeGetPartyDeclaredList',
  GetPartyList = 'AttributeGetPartyList',
}

function useGetList(params: GetAttributesParams, config?: UseQueryWrapperOptions<Attributes>) {
  return useQueryWrapper(
    [AttributeQueryKeys.GetList, params],
    () => AttributeServices.getList(params),
    config
  )
}

function useGetSingle(attributeId: string, config?: UseQueryWrapperOptions<Attribute>) {
  return useQueryWrapper(
    [AttributeQueryKeys.GetSingle, attributeId],
    () => AttributeServices.getSingle(attributeId),
    config
  )
}

function usePrefetchSingle() {
  const queryClient = useQueryClient()
  return (attributeId: string) =>
    queryClient.prefetchQuery([AttributeQueryKeys.GetSingle, attributeId], () =>
      AttributeServices.getSingle(attributeId)
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

function usePrefetchPartyCertifiedList() {
  const queryClient = useQueryClient()
  return (partyId: string) =>
    queryClient.prefetchQuery([AttributeQueryKeys.GetPartyCertifiedList, partyId], () =>
      AttributeServices.getPartyCertifiedList(partyId)
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

function useGetListParty(partyId?: string, verifierId?: string, config = { suspense: true }) {
  return useQueries({
    queries: [
      {
        queryKey: [AttributeQueryKeys.GetPartyCertifiedList, partyId],
        queryFn: () => AttributeServices.getPartyCertifiedList(partyId!),
        enabled: !!partyId,
        ...config,
      },
      {
        queryKey: [AttributeQueryKeys.GetPartyVerifiedList, partyId],
        queryFn: () => AttributeServices.getPartyVerifiedList(partyId!),
        enabled: !!partyId,
        ...config,
      },
      {
        queryKey: [AttributeQueryKeys.GetPartyDeclaredList, partyId],
        queryFn: () => AttributeServices.getPartyDeclaredList(partyId!),
        enabled: !!partyId,
        ...config,
      },
    ],
  })
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
    },
  })
}

function useVerifyPartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.verifyPartyAttribute',
  })
  return useMutationWrapper(AttributeServices.verifyPartyAttribute, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useRevokeVerifiedPartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.revokeVerifiedPartyAttribute',
  })
  return useMutationWrapper(AttributeServices.revokeVerifiedPartyAttribute, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useDeclarePartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.declarePartyAttribute',
  })
  return useMutationWrapper(AttributeServices.declarePartyAttribute, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useRevokeDeclaredPartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.revokeDeclaredPartyAttribute',
  })
  return useMutationWrapper(AttributeServices.revokeDeclaredPartyAttribute, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

export const AttributeQueries = {
  useGetList,
  useGetSingle,
  usePrefetchSingle,
  useGetPartyCertifiedList,
  usePrefetchPartyCertifiedList,
  useGetPartyVerifiedList,
  useGetPartyDeclaredList,
  useGetListParty,
}

export const AttributeMutations = {
  useCreate,
  useVerifyPartyAttribute,
  useRevokeVerifiedPartyAttribute,
  useDeclarePartyAttribute,
  useRevokeDeclaredPartyAttribute,
}
