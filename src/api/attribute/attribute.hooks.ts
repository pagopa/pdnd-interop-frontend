import {
  type UseQueryOptions,
  useMutation,
  useQueries,
  useQueryClient,
  useQuery,
} from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import AttributeServices from './attribute.services'
import type { Attribute, Attributes, GetAttributesParams } from '../api.generatedTypes'

export enum AttributeQueryKeys {
  GetList = 'AttributeGetList',
  GetSingle = 'AttributeGetSingle',
  GetPartyCertifiedList = 'AttributeGetPartyCertifiedList',
  GetPartyVerifiedList = 'AttributeGetPartyVerifiedList',
  GetPartyDeclaredList = 'AttributeGetPartyDeclaredList',
  GetPartyList = 'AttributeGetPartyList',
}

function useGetList(params: GetAttributesParams, config?: UseQueryOptions<Attributes>) {
  return useQuery({
    queryKey: [AttributeQueryKeys.GetList, params],
    queryFn: () => AttributeServices.getList(params),
    ...config,
  })
}

function useGetSingle(attributeId: string, config?: UseQueryOptions<Attribute>) {
  return useQuery({
    queryKey: [AttributeQueryKeys.GetSingle, attributeId],
    queryFn: () => AttributeServices.getSingle(attributeId),
    ...config,
  })
}

function usePrefetchSingle() {
  const queryClient = useQueryClient()
  return (attributeId: string) =>
    queryClient.prefetchQuery([AttributeQueryKeys.GetSingle, attributeId], () =>
      AttributeServices.getSingle(attributeId)
    )
}

function useGetPartyCertifiedList(partyId?: string) {
  return useQuery({
    queryKey: [AttributeQueryKeys.GetPartyCertifiedList, partyId],
    queryFn: () => AttributeServices.getPartyCertifiedList(partyId!),
    enabled: !!partyId,
  })
}

function usePrefetchPartyCertifiedList() {
  const queryClient = useQueryClient()
  return (partyId: string) =>
    queryClient.prefetchQuery([AttributeQueryKeys.GetPartyCertifiedList, partyId], () =>
      AttributeServices.getPartyCertifiedList(partyId)
    )
}

function useGetPartyVerifiedList(partyId?: string) {
  return useQuery({
    queryKey: [AttributeQueryKeys.GetPartyVerifiedList, partyId],
    queryFn: () => AttributeServices.getPartyVerifiedList(partyId!),
    enabled: !!partyId,
  })
}

function useGetPartyDeclaredList(partyId?: string) {
  return useQuery({
    queryKey: [AttributeQueryKeys.GetPartyDeclaredList, partyId],
    queryFn: () => AttributeServices.getPartyDeclaredList(partyId!),
    enabled: !!partyId,
  })
}

function useGetListParty(partyId?: string, config = { suspense: true }) {
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

function useCreateCertified() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'attribute.create' })
  return useMutation(AttributeServices.createCertified, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      successToastLabel: t('outcome.success'),
    },
  })
}

function useCreateVerified() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'attribute.create' })
  return useMutation(AttributeServices.createVerified, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useCreateDeclared() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'attribute.create' })
  return useMutation(AttributeServices.createDeclared, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useVerifyPartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.verifyPartyAttribute',
  })
  return useMutation(AttributeServices.verifyPartyAttribute, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateVerifiedPartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.updatingExpirationPartyAttribute',
  })
  return useMutation(AttributeServices.updateVerifiedPartyAttribute, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useRevokeVerifiedPartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.revokeVerifiedPartyAttribute',
  })
  return useMutation(AttributeServices.revokeVerifiedPartyAttribute, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeclarePartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.declarePartyAttribute',
  })
  return useMutation(AttributeServices.declarePartyAttribute, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
    },
  })
}

function useRevokeDeclaredPartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.revokeDeclaredPartyAttribute',
  })
  return useMutation(AttributeServices.revokeDeclaredPartyAttribute, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
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
  useCreateCertified,
  useCreateVerified,
  useCreateDeclared,
  useVerifyPartyAttribute,
  useUpdateVerifiedPartyAttribute,
  useRevokeVerifiedPartyAttribute,
  useDeclarePartyAttribute,
  useRevokeDeclaredPartyAttribute,
}
