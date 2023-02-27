import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type {
  CreateAttributePayload,
  GetListAttributesResponse,
  GetCertifiedAttributesResponse,
  GetDeclaredAttributesResponse,
  GetSingleAttributeResponse,
  GetVerifiedAttributesResponse,
  VerifyPartyAttributeAttributePayload,
} from './attribute.api.types'
import { remapAttributeResponseData } from './attribute.api.utils'

async function getList(params?: { search: string }) {
  const response = await axiosInstance.get<GetListAttributesResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/attributes`,
    { params }
  )
  return response.data
}

async function getSingle(attributeId: string) {
  const response = await axiosInstance.get<GetSingleAttributeResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/attributes/${attributeId}`
  )
  return response.data
}

async function getPartyCertifiedList(partyId: string) {
  const response = await axiosInstance.get<GetCertifiedAttributesResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/attributes/certified`
  )
  return remapAttributeResponseData(response.data, 'certified')
}

async function getPartyVerifiedList(partyId: string, verifierId?: string) {
  const response = await axiosInstance.get<GetVerifiedAttributesResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/attributes/verified`
  )
  return remapAttributeResponseData(response.data, 'verified', verifierId)
}

async function getPartyDeclaredList(partyId: string) {
  const response = await axiosInstance.get<GetDeclaredAttributesResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/attributes/declared`
  )
  return remapAttributeResponseData(response.data, 'declared')
}

async function create(payload: CreateAttributePayload) {
  const response = await axiosInstance.post<GetSingleAttributeResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/attributes`,
    payload
  )
  return response.data
}

async function verifyPartyAttribute({
  partyId,
  ...payload
}: { partyId: string } & VerifyPartyAttributeAttributePayload) {
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
  return axiosInstance.delete<GetSingleAttributeResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/attributes/verified/${attributeId}`
  )
}

async function declarePartyAttribute(payload: { id: string }) {
  return axiosInstance.post(`${BACKEND_FOR_FRONTEND_URL}/tenants/attributes/declared`, payload)
}

async function revokeDeclaredPartyAttribute({ attributeId }: { attributeId: string }) {
  return axiosInstance.delete<GetSingleAttributeResponse>(
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
