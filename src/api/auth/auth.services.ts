import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'

async function swapTokens(identity_token: string) {
  const response = await axiosInstance.post<{ session_token: string }>(
    `${BACKEND_FOR_FRONTEND_URL}/session/tokens`,
    { identity_token }
  )
  return response.data
}

function authHealthCheck() {
  return axiosInstance.get(`${BACKEND_FOR_FRONTEND_URL}/status`)
}

const AuthServices = {
  swapTokens,
  authHealthCheck,
}

export default AuthServices
