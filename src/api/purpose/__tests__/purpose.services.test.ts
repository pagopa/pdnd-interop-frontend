import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { PurposeServices } from '../purpose.services'

vi.mock('@/config/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('PurposeServices', () => {
  it('should include the purpose metadata version returned in the response header', async () => {
    const purpose = createMockPurpose()
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: purpose,
      headers: { 'x-metadata-version': '3' },
    })

    const result = await PurposeServices.getSingle('purpose-id')

    expect(result).toEqual({ ...purpose, metadataVersion: 3 })
  })

  it('should send the purpose metadata version when signing the risk analysis', async () => {
    vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

    await PurposeServices.signRiskAnalysis({
      purposeId: 'purpose-id',
      metadataVersionToSign: 3,
    })

    expect(axiosInstance.post).toHaveBeenCalledWith(
      `${BACKEND_FOR_FRONTEND_URL}/purposes/purpose-id/riskAnalysis/sign`,
      { metadataVersionToSign: 3 }
    )
  })
})
