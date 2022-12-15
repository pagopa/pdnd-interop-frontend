import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import { SelfCareUser } from '@/types/party.types'
import { PartyGetUsersListUrlParams } from './party.api.types'

async function getUsersList(partyId: string, params?: PartyGetUsersListUrlParams) {
  const response = await axiosInstance.get<Array<SelfCareUser>>(
    `${BACKEND_FOR_FRONTEND_URL}/institutions/${partyId}/relationships`,
    {
      params,
    }
  )

  return response.data
}

const PartyServices = {
  getUsersList,
}

export default PartyServices
