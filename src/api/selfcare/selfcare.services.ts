import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import type { SelfcareInstitution, User, Users } from '../api.generatedTypes'
import type { UserProductRole } from '@/types/party.types'

async function getProducts() {
  const response = await axiosInstance.get<Array<{ id: string; name: string }>>(
    `${BACKEND_FOR_FRONTEND_URL}/selfcare/institutions/products`
  )
  return response.data
}

async function getPartyList() {
  const response = await axiosInstance.get<Array<SelfcareInstitution>>(
    `${BACKEND_FOR_FRONTEND_URL}/selfcare/institutions`
  )
  return response.data
}

async function getSingleUser(userId: string) {
  const response = await axiosInstance.get<User>(`${BACKEND_FOR_FRONTEND_URL}/users/${userId}`)
  return response.data
}

// TODO[PIN-10138]: verify with BE that GET /tenants/{tenantId}/users?roles=<role>
// is the right endpoint to retrieve users by role (e.g. reviewers) for the current institution.
async function getUsersByRole({ tenantId, role }: { tenantId: string; role: UserProductRole }) {
  const response = await axiosInstance.get<Users>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${tenantId}/users`,
    { params: { roles: [role] } }
  )
  return response.data
}

export const SelfcareServices = {
  getProducts,
  getPartyList,
  getSingleUser,
  getUsersByRole,
}
