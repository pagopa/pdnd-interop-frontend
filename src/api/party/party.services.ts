import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import { SelfCareUser, UserType } from '@/types/party.types'
import { PartyGetUsersListUrlParams } from './party.api.types'
import { remapUserResponseData } from './party.utils'

async function getUser(partyId: string) {
  const response = await axiosInstance.get<UserType>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}`
  )

  return remapUserResponseData(response.data)
}

async function getUsersList(partyId: string, params?: PartyGetUsersListUrlParams) {
  const response = await axiosInstance.get<Array<SelfCareUser>>(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/relationships`,
    {
      params,
    }
  )

  return response.data
}

function updateMail({
  partyId,
  ...payload
}: {
  partyId: string
  contactEmail: string
  description?: string
}) {
  return axiosInstance.post(`${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}`, payload)
}

const PartyServices = {
  getUser,
  getUsersList,
  updateMail,
}

export default PartyServices
