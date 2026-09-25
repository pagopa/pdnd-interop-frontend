import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { PurposeServices } from '../purpose.services'
import { AxiosError, AxiosHeaders } from 'axios'

vi.mock('@/config/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

describe('PurposeServices', () => {
  beforeEach(() => vi.resetAllMocks())

  const operations = [
    {
      name: 'save',
      request: () =>
        PurposeServices.updateRiskAnalysis({
          purposeId: 'purpose-id',
          version: '2.1',
          answers: {},
        }),
      method: 'put',
    },
    {
      name: 'sign',
      request: () =>
        PurposeServices.signRiskAnalysis({ purposeId: 'purpose-id', metadataVersionToSign: 3 }),
      method: 'post',
    },
  ] satisfies Array<{ name: string; request: () => Promise<unknown>; method: 'put' | 'post' }>

  describe.each(operations)('$name after a concurrent approval', ({ request, method }) => {
    const conflict = new AxiosError('Conflict', undefined, undefined, undefined, {
      status: 409,
      statusText: 'Conflict',
      data: {},
      headers: {},
      config: { headers: new AxiosHeaders() },
    })

    it('explains that the analysis is already approved', async () => {
      vi.mocked(axiosInstance[method]).mockRejectedValueOnce(conflict)
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: createMockPurpose({ reviewerWorkflow: { reviewers: [], signingState: 'SIGNED' } }),
        headers: {},
      })
      await expect(request()).rejects.toThrow('Risk analysis already approved')
    })

    it.each(['REJECTED', 'ASSIGNED'] as const)(
      'preserves the original error for %s',
      async (signingState) => {
        vi.mocked(axiosInstance[method]).mockRejectedValueOnce(conflict)
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({
          data: createMockPurpose({ reviewerWorkflow: { reviewers: [], signingState } }),
          headers: {},
        })
        await expect(request()).rejects.toBe(conflict)
      }
    )

    it('preserves the original error if refreshing fails', async () => {
      vi.mocked(axiosInstance[method]).mockRejectedValueOnce(conflict)
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('Network error'))
      await expect(request()).rejects.toBe(conflict)
    })

    it('does not classify network failures as concurrent approvals', async () => {
      const error = new Error('Network error')
      vi.mocked(axiosInstance[method]).mockRejectedValueOnce(error)
      await expect(request()).rejects.toBe(error)
      expect(axiosInstance.get).not.toHaveBeenCalled()
    })
  })
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
