import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import type {
  GetInstitutionUsersParams,
  GetTenantsParams,
  MailSeed,
  SelfcareInstitution,
  Tenant,
  Tenants,
  Users,
} from '../api.generatedTypes'

async function getParty(partyId: string) {
  const response = await axiosInstance.get<Tenant>(`${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}`)
  return response.data
}

async function getPartyUsersList({ tenantId, ...params }: GetInstitutionUsersParams) {
  const response = await axiosInstance.get<Users>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${tenantId}/users`,
    {
      params,
    }
  )

  return response.data
}

export async function getTenants(params: GetTenantsParams) {
  const response = await axiosInstance.get<Tenants>(`${BACKEND_FOR_FRONTEND_URL}/tenants`, {
    params,
  })
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
} & MailSeed) {
  return axiosInstance.post(`${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/mails`, payload)
}

async function getPartyList() {
  const response = await axiosInstance.get<Array<SelfcareInstitution>>(
    `${BACKEND_FOR_FRONTEND_URL}/selfcare/institutions`
  )
  return response.data
}

const PartyServices = {
  getParty,
  getPartyUsersList,
  getTenants,
  getProducts,
  getPartyList,
  updateMail,
}

export default PartyServices
