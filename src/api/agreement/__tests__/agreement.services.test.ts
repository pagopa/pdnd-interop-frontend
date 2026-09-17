import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import { AgreementServices } from '../agreement.services'

vi.mock('@/config/axios', () => ({
  default: {
    post: vi.fn(),
  },
}))

describe('AgreementServices', () => {
  it('should approve a pending agreement', async () => {
    vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

    await AgreementServices.approve({
      agreementId: 'agreement-id',
      delegationId: 'delegation-id',
    })

    expect(axiosInstance.post).toHaveBeenCalledWith(
      `${BACKEND_FOR_FRONTEND_URL}/agreements/agreement-id/approve`,
      { delegationId: 'delegation-id' }
    )
  })

  it('should unsuspend a suspended agreement', async () => {
    vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

    await AgreementServices.unsuspend({
      agreementId: 'agreement-id',
      delegationId: 'delegation-id',
    })

    expect(axiosInstance.post).toHaveBeenCalledWith(
      `${BACKEND_FOR_FRONTEND_URL}/agreements/agreement-id/unsuspend`,
      { delegationId: 'delegation-id' }
    )
  })
})
