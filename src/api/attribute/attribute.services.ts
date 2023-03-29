import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type {
  Attribute,
  AttributeSeed,
  AttributesResponse,
  CertifiedAttributesResponse,
  DeclaredAttributesResponse,
  DeclaredTenantAttributeSeed,
  VerifiedAttributesResponse,
  VerifiedTenantAttributeSeed,
} from '../api.generatedTypes'
import { remapAttributeResponseData } from './attribute.api.utils'

async function getList(params?: { search: string }) {
  const response = await axiosInstance.get<AttributesResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/attributes`,
    { params }
  )
  return response.data
}

async function getSingle(attributeId: string) {
  const response = await axiosInstance.get<Attribute>(
    `${BACKEND_FOR_FRONTEND_URL}/attributes/${attributeId}`
  )
  return response.data
}

async function getPartyCertifiedList(partyId: string) {
  const response = await axiosInstance.get<CertifiedAttributesResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/attributes/certified`
  )
  return remapAttributeResponseData(response.data, 'certified')
}

async function getPartyVerifiedList(partyId: string, verifierId?: string) {
  const response = await axiosInstance.get<VerifiedAttributesResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/attributes/verified`
  )
  return remapAttributeResponseData(response.data, 'verified', verifierId)
}

async function getPartyDeclaredList(partyId: string) {
  const response = await axiosInstance.get<DeclaredAttributesResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/attributes/declared`
  )
  return remapAttributeResponseData(response.data, 'declared')
}

async function create(payload: AttributeSeed) {
  const response = await axiosInstance.post<Attribute>(
    `${BACKEND_FOR_FRONTEND_URL}/attributes`,
    payload
  )
  return response.data
}

async function verifyPartyAttribute({
  partyId,
  ...payload
}: { partyId: string } & VerifiedTenantAttributeSeed) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/attributes/verified`,
    payload
  )
}

async function revokeVerifiedPartyAttribute({
  partyId,
  attributeId,
}: {
  partyId: string
  attributeId: string
}) {
  return axiosInstance.delete<Attribute>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/attributes/verified/${attributeId}`
  )
}

async function declarePartyAttribute(payload: DeclaredTenantAttributeSeed) {
  return axiosInstance.post(`${BACKEND_FOR_FRONTEND_URL}/tenants/attributes/declared`, payload)
}

async function revokeDeclaredPartyAttribute({ attributeId }: { attributeId: string }) {
  return axiosInstance.delete<Attribute>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/attributes/declared/${attributeId}`
  )
}

const AttributeServices = {
  getList,
  getSingle,
  getPartyCertifiedList,
  getPartyVerifiedList,
  getPartyDeclaredList,
  create,
  verifyPartyAttribute,
  revokeVerifiedPartyAttribute,
  declarePartyAttribute,
  revokeDeclaredPartyAttribute,
}

export default AttributeServices
