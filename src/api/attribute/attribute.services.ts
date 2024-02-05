import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type {
  Attribute,
  AttributeSeed,
  Attributes,
  CertifiedAttributeSeed,
  CertifiedAttributesResponse,
  CertifiedTenantAttributeSeed,
  DeclaredAttributesResponse,
  DeclaredTenantAttributeSeed,
  GetAttributesParams,
  GetRequesterCertifiedAttributesParams,
  RequesterCertifiedAttributes,
  UpdateVerifiedTenantAttributeSeed,
  VerifiedAttributesResponse,
  VerifiedTenantAttributeSeed,
} from '../api.generatedTypes'

async function getList(params?: GetAttributesParams) {
  const response = await axiosInstance.get<Attributes>(`${BACKEND_FOR_FRONTEND_URL}/attributes`, {
    params,
  })
  return response.data
}

async function getRequesterCertifiedAttributesList(params?: GetRequesterCertifiedAttributesParams) {
  const response = await axiosInstance.get<RequesterCertifiedAttributes>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/attributes/certified`,
    {
      params,
    }
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
  return response.data
}

async function getPartyVerifiedList(partyId: string) {
  const response = await axiosInstance.get<VerifiedAttributesResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/attributes/verified`
  )
  return response.data
}

async function getPartyDeclaredList(partyId: string) {
  const response = await axiosInstance.get<DeclaredAttributesResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/attributes/declared`
  )
  return response.data
}

async function createCertified(payload: CertifiedAttributeSeed) {
  const response = await axiosInstance.post<Attribute>(
    `${BACKEND_FOR_FRONTEND_URL}/certifiedAttributes`,
    payload
  )
  return response.data
}

async function createVerified(payload: AttributeSeed) {
  const response = await axiosInstance.post<Attribute>(
    `${BACKEND_FOR_FRONTEND_URL}/verifiedAttributes`,
    payload
  )
  return response.data
}

async function createDeclared(payload: AttributeSeed) {
  const response = await axiosInstance.post<Attribute>(
    `${BACKEND_FOR_FRONTEND_URL}/declaredAttributes`,
    payload
  )
  return response.data
}

async function addCertifiedAttribute({
  tenantId,
  ...payload
}: { tenantId: string } & CertifiedTenantAttributeSeed) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${tenantId}/attributes/certified`,
    payload
  )
}

async function revokeCertifiedAttribute({
  tenantId,
  attributeId,
}: {
  tenantId: string
  attributeId: string
}) {
  return axiosInstance.delete(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${tenantId}/attributes/certified/${attributeId}`
  )
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

async function updateVerifiedPartyAttribute({
  partyId,
  attributeId,
  ...payload
}: { partyId: string; attributeId: string } & UpdateVerifiedTenantAttributeSeed) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/attributes/verified/${attributeId}`,
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
  getRequesterCertifiedAttributesList,
  getSingle,
  getPartyCertifiedList,
  getPartyVerifiedList,
  getPartyDeclaredList,
  createCertified,
  createVerified,
  createDeclared,
  addCertifiedAttribute,
  revokeCertifiedAttribute,
  verifyPartyAttribute,
  updateVerifiedPartyAttribute,
  revokeVerifiedPartyAttribute,
  declarePartyAttribute,
  revokeDeclaredPartyAttribute,
}

export default AttributeServices
