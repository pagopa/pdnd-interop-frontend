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

  const suspendedPurpose = createMockPurpose({
    suspendedByConsumer: true,
    currentVersion: {
      id: 'current-version',
      state: 'SUSPENDED',
      dailyCalls: 10,
      createdAt: '2026-09-01T00:00:00Z',
    },
    waitingForApprovalVersion: {
      id: 'waiting-version',
      state: 'WAITING_FOR_APPROVAL',
      dailyCalls: 10,
      createdAt: '2026-09-02T00:00:00Z',
    },
  })

  describe.each([
    { name: 'BFF versions', purpose: suspendedPurpose },
    {
      name: 'BFF-normalized versions',
      purpose: { ...suspendedPurpose, currentVersion: undefined },
    },
  ])('$name', ({ purpose }) => {
    it('preserves the detail payload and metadata version', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: purpose,
        headers: { 'x-metadata-version': '3' },
      })

      expect(await PurposeServices.getSingle(purpose.id)).toEqual({
        ...purpose,
        metadataVersion: 3,
      })
    })

    it.each([
      ['producers', PurposeServices.getProducersList],
      ['consumers', PurposeServices.getConsumersList],
      ['risk analysis assignments', PurposeServices.getRiskAnalysisAssignments],
    ])('preserves %s results and pagination metadata', async (_name, request) => {
      const data = { results: [purpose], pagination: { offset: 10, limit: 10, totalCount: 21 } }
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data })

      expect(await request({ offset: 10, limit: 10 })).toEqual(data)
    })
  })

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
    {
      name: 'reject',
      request: () =>
        PurposeServices.rejectRiskAnalysis({
          purposeId: 'purpose-id',
          rejectionReason: 'A valid rejection reason',
        }),
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

    it('explains that the analysis is already rejected', async () => {
      vi.mocked(axiosInstance[method]).mockRejectedValueOnce(conflict)
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: createMockPurpose({ reviewerWorkflow: { reviewers: [], signingState: 'REJECTED' } }),
        headers: {},
      })
      await expect(request()).rejects.toThrow('Risk analysis already rejected')
    })

    it.each(['SUBMITTED', 'ASSIGNED'] as const)(
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
