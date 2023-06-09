import axiosInstance from '@/config/axios'
import type {
  TokenGenerationValidationRequest,
  TokenGenerationValidationResult,
} from '@/pages/ConsumerDebugVoucherPage/types/debug-voucher.types'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'

async function validateTokenGeneration(payload: TokenGenerationValidationRequest) {
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

const VoucherServices = {
  validateTokenGeneration,
}

export default VoucherServices
