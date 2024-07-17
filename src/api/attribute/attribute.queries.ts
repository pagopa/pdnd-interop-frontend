import { queryOptions } from '@tanstack/react-query'
import { AttributeServices } from './attribute.services'
import type {
  GetAttributesParams,
  GetRequesterCertifiedAttributesParams,
} from '../api.generatedTypes'

function getList(params: GetAttributesParams) {
  return queryOptions({
    queryKey: ['AttributeGetList', params],
    queryFn: () => AttributeServices.getList(params),
  })
}

function getRequesterCertifiedAttributesList(params: GetRequesterCertifiedAttributesParams) {
  return queryOptions({
    queryKey: ['AttributeGetRequesterCertifiedAttributesList', params],
    queryFn: () => AttributeServices.getRequesterCertifiedAttributesList(params),
  })
}

function getSingle(attributeId: string) {
  return queryOptions({
    queryKey: ['AttributeGetSingle', attributeId],
    queryFn: () => AttributeServices.getSingle(attributeId),
  })
}

function getPartyCertifiedList(partyId?: string) {
  return queryOptions({
    queryKey: ['AttributeGetPartyCertifiedList', partyId],
    queryFn: () => AttributeServices.getPartyCertifiedList(partyId!),
    enabled: Boolean(partyId),
  })
}

function getPartyVerifiedList(partyId?: string) {
  return queryOptions({
    queryKey: ['AttributeGetPartyVerifiedList', partyId],
    queryFn: () => AttributeServices.getPartyVerifiedList(partyId!),
    enabled: Boolean(partyId),
  })
}

function getPartyDeclaredList(partyId?: string) {
  return queryOptions({
    queryKey: ['AttributeGetPartyDeclaredList', partyId],
    queryFn: () => AttributeServices.getPartyDeclaredList(partyId!),
    enabled: Boolean(partyId),
  })
}

export const AttributeQueries = {
  getList,
  getRequesterCertifiedAttributesList,
  getSingle,
  getPartyCertifiedList,
  getPartyVerifiedList,
  getPartyDeclaredList,
}
