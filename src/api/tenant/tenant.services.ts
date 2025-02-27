import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import type {
  GetInstitutionUsersParams,
  GetTenantsParams,
  HasCertifiedAttributes,
  MailSeed,
  Tenant,
  TenantDelegatedFeaturesFlagsUpdateSeed,
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

function updateMail({
  partyId,
  ...payload
}: {
  partyId: string
} & MailSeed) {
  return axiosInstance.post(`${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/mails`, payload)
}

function UpdateTenantDelegatedFeatures(payload: TenantDelegatedFeaturesFlagsUpdateSeed) {
  return axiosInstance.post(`${BACKEND_FOR_FRONTEND_URL}/tenants/delegatedFeatures/update`, payload)
}

async function verifyTenantCertifiedAttributes({
  tenantId,
  eserviceId,
  descriptorId,
}: {
  tenantId: string
  eserviceId: string
  descriptorId: string
}) {
  const response = await axiosInstance.get<HasCertifiedAttributes>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${tenantId}/eservices/${eserviceId}/descriptors/${descriptorId}/certifiedAttributes/validate`
  )

  return response.data
}

export const TenantServices = {
  getParty,
  getPartyUsersList,
  getTenants,
  updateMail,
  UpdateTenantDelegatedFeatures,
  verifyTenantCertifiedAttributes,
}
