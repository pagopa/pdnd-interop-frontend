import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import type { SelfCareUser, Party } from '@/types/party.types'
import type { PartyGetUsersListUrlParams, PartyItem } from './party.api.types'
import { remapUserResponseData } from './party.utils'

async function getParty(partyId: string) {
  const response = await axiosInstance.get<Party>(`${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}`)

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

async function getProducts() {
  const response = await axiosInstance.get<Array<{ id: string; name: string }>>(
    `${BACKEND_FOR_FRONTEND_URL}/selfcare/institutions/products`
  )
  return response.data
}

async function getPartyList() {
  const response = await axiosInstance.get<Array<PartyItem>>(
    `${BACKEND_FOR_FRONTEND_URL}/selfcare/institutions`
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

async function getPartyList() {
  const response = await axiosInstance.get<Array<PartyItem>>(
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
  getPartyList,
}

export default PartyServices
