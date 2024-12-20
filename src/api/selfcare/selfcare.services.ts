import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import type { SelfcareInstitution, User } from '../api.generatedTypes'

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

export const SelfcareServices = {
  getProducts,
  getPartyList,
  getSingleUser,
}
