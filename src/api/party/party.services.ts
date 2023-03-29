import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import { remapUserResponseData } from './party.utils'
import type {
  GetUserInstitutionRelationshipsParams,
  RelationshipsResponse,
  SelfcareInstitution,
  Tenant,
  TenantDelta,
} from '../api.generatedTypes'

async function getParty(partyId: string) {
  const response = await axiosInstance.get<Tenant>(`${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}`)

  return remapUserResponseData(response.data)
}

async function getUsersList({ tenantId, ...params }: GetUserInstitutionRelationshipsParams) {
  const response = await axiosInstance.get<RelationshipsResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${tenantId}/relationships`,
    {
      params,
    }
  )

  return response.data
}

async function getProducts() {
  const response = await axiosInstance.get<Array<{ id: string; name: string }>>(
    `${BACKEND_FOR_FRONTEND_URL}/selfcare/institutions/products`
  )
  return response.data
}

function updateMail({
  partyId,
  ...payload
}: {
  partyId: string
} & TenantDelta) {
  return axiosInstance.post(`${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}`, payload)
}

async function getPartyList() {
  const response = await axiosInstance.get<Array<SelfcareInstitution>>(
    `${BACKEND_FOR_FRONTEND_URL}/selfcare/institutions`
  )
  return response.data
}

const PartyServices = {
  getParty,
  getUsersList,
  getProducts,
  getPartyList,
  updateMail,
}

export default PartyServices
