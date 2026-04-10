import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type { AccessTokenRequest, TokenGenerationValidationResult } from '../api.generatedTypes'

async function validateTokenGeneration(payload: AccessTokenRequest) {
  const response = await axiosInstance.post<TokenGenerationValidationResult>(
    `${BACKEND_FOR_FRONTEND_URL}/tools/validateTokenGeneration`,
    payload,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

  return response.data
}

async function validateDPoPProof(payload: AccessTokenRequest) {
  const response = await axiosInstance.post<TokenGenerationValidationResult>(
    `${BACKEND_FOR_FRONTEND_URL}/tools/validateDPoPProof`,
    payload,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

  return response.data
}

export const VoucherServices = {
  validateTokenGeneration,
  validateDPoPProof,
}
