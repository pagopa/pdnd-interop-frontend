import { vi } from 'vitest'
import { PurposeTemplateQueries } from '../purposeTemplate.queries'
import { PurposeTemplateServices } from '../purposeTemplate.services'
import type {
  Document as ApiDocument,
  GetCatalogPurposeTemplatesParams,
  GetCreatorPurposeTemplatesParams,
  GetPurposeTemplateEServicesParams,
} from '../../api.generatedTypes'
import { mockPurposeTemplateResponse } from '@/../__mocks__/data/purposeTemplate.mocks'
import type { AxiosResponse } from 'axios'

vi.mock('../purposeTemplate.services', () => ({
  PurposeTemplateServices: {
    getConsumerPurposeTemplatesList: vi.fn(),
    getEservicesLinkedToPurposeTemplatesList: vi.fn(),
    getSingle: vi.fn(),
    getCatalogPurposeTemplates: vi.fn(),
    getAnswerDocuments: vi.fn(),
    getPublishedPurposeTemplateCreators: vi.fn(),
  },
}))

describe('PurposeTemplateQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getConsumerPurposeTemplatesList', () => {
    it('should return queryOptions with correct queryKey', () => {
      const params: GetCreatorPurposeTemplatesParams = {
        offset: 0,
        limit: 10,
      }

      const result = PurposeTemplateQueries.getConsumerPurposeTemplatesList(params)

      expect(result.queryKey).toEqual(['PurposeTemplateGetProviderPurposeTemplatesList', params])
    })

    it('should call getConsumerPurposeTemplatesList service when queryFn is executed', async () => {
      const params: GetCreatorPurposeTemplatesParams = {
        offset: 0,
        limit: 10,
      }
      const mockData = {
        results: [],
        pagination: {
          offset: 0,
          limit: 10,
          totalCount: 0,
        },
      }
      vi.mocked(PurposeTemplateServices.getConsumerPurposeTemplatesList).mockResolvedValue(mockData)

      const result = PurposeTemplateQueries.getConsumerPurposeTemplatesList(params)

      expect(result.queryFn).toBeDefined()
      const data = await (result.queryFn as () => Promise<unknown>)()

      expect(PurposeTemplateServices.getConsumerPurposeTemplatesList).toHaveBeenCalledWith(params)
      expect(data).toEqual(mockData)
    })
  })

  describe('getEservicesLinkedToPurposeTemplatesList', () => {
    it('should return queryOptions with correct queryKey', () => {
      const params: GetPurposeTemplateEServicesParams = {
        purposeTemplateId: 'test-template-id',
        offset: 0,
        limit: 10,
      }

      const result = PurposeTemplateQueries.getEservicesLinkedToPurposeTemplatesList(params)

      expect(result.queryKey).toEqual([
        'PurposeTemplateGetEservicesLinkedToPurposeTemplatesList',
        params.purposeTemplateId,
        params,
      ])
    })

    it('should call getEservicesLinkedToPurposeTemplatesList service when queryFn is executed', async () => {
      const params: GetPurposeTemplateEServicesParams = {
        purposeTemplateId: 'test-template-id',
        offset: 0,
        limit: 10,
      }
      const mockData = {
        results: [],
        pagination: {
          offset: 0,
          limit: 10,
          totalCount: 0,
        },
      }
      vi.mocked(PurposeTemplateServices.getEservicesLinkedToPurposeTemplatesList).mockResolvedValue(
        mockData
      )

      const result = PurposeTemplateQueries.getEservicesLinkedToPurposeTemplatesList(params)

      expect(result.queryFn).toBeDefined()
      const data = await (result.queryFn as () => Promise<unknown>)()

      expect(PurposeTemplateServices.getEservicesLinkedToPurposeTemplatesList).toHaveBeenCalledWith(
        params.purposeTemplateId,
        params
      )
      expect(data).toEqual(mockData)
    })
  })

  describe('getSingle', () => {
    it('should return queryOptions with correct queryKey', () => {
      const purposeTemplateId = 'test-template-id'

      const result = PurposeTemplateQueries.getSingle(purposeTemplateId)

      expect(result.queryKey).toEqual(['PurposeTemplateGetSingle', purposeTemplateId])
    })

    it('should call getSingle service when queryFn is executed', async () => {
      const purposeTemplateId = 'test-template-id'
      const mockData = {
        ...mockPurposeTemplateResponse,
        id: purposeTemplateId,
      }
      vi.mocked(PurposeTemplateServices.getSingle).mockResolvedValue(mockData)

      const result = PurposeTemplateQueries.getSingle(purposeTemplateId)

      expect(result.queryFn).toBeDefined()
      const data = await (result.queryFn as () => Promise<unknown>)()

      expect(PurposeTemplateServices.getSingle).toHaveBeenCalledWith(purposeTemplateId)
      expect(data).toEqual(mockData)
    })
  })

  describe('getCatalogPurposeTemplates', () => {
    it('should return queryOptions with correct queryKey', () => {
      const params: GetCatalogPurposeTemplatesParams = {
        offset: 0,
        limit: 10,
      }

      const result = PurposeTemplateQueries.getCatalogPurposeTemplates(params)

      expect(result.queryKey).toEqual(['PurposeTemplateGetCatalogPurposeTemplates', params])
    })

    it('should call getCatalogPurposeTemplates service when queryFn is executed', async () => {
      const params: GetCatalogPurposeTemplatesParams = {
        offset: 0,
        limit: 10,
        eserviceIds: ['test-eservice-id'],
      }
      const mockData = {
        results: [],
        pagination: {
          offset: 0,
          limit: 10,
          totalCount: 0,
        },
      }
      vi.mocked(PurposeTemplateServices.getCatalogPurposeTemplates).mockResolvedValue(mockData)

      const result = PurposeTemplateQueries.getCatalogPurposeTemplates(params)

      expect(result.queryFn).toBeDefined()
      const data = await (result.queryFn as () => Promise<unknown>)()

      expect(PurposeTemplateServices.getCatalogPurposeTemplates).toHaveBeenCalledWith(params)
      expect(data).toEqual(mockData)
    })
  })

  describe('getAnswerDocuments', () => {
    it('should return queryOptions with correct queryKey', () => {
      const purposeTemplateId = 'test-template-id'
      const answerId = 'test-answer-id'

      const result = PurposeTemplateQueries.getAnswerDocuments(purposeTemplateId, answerId)

      expect(result.queryKey).toEqual([
        'PurposeTemplateGetAnswerDocuments',
        purposeTemplateId,
        answerId,
      ])
    })

    it('should call getAnswerDocuments service when queryFn is executed', async () => {
      const purposeTemplateId = 'test-template-id'
      const answerId = 'test-answer-id'
      const mockData: ApiDocument[] = [
        {
          id: 'doc-1',
          name: 'document.pdf',
          contentType: 'application/pdf',
          prettyName: 'Document PDF',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ]
      vi.mocked(PurposeTemplateServices.getAnswerDocuments).mockResolvedValue(mockData as never)

      const result = PurposeTemplateQueries.getAnswerDocuments(purposeTemplateId, answerId)

      expect(result.queryFn).toBeDefined()
      const data = await (result.queryFn as unknown as () => Promise<ApiDocument[]>)()

      expect(PurposeTemplateServices.getAnswerDocuments).toHaveBeenCalledWith(
        purposeTemplateId,
        answerId
      )
      expect(data).toEqual(mockData)
    })
  })

  describe('getPublishedPurposeTemplateCreators', () => {
    it('should return queryOptions with correct queryKey', () => {
      const params = {
        q: 'test-query',
        offset: 0,
        limit: 10,
      }

      const result = PurposeTemplateQueries.getPublishedPurposeTemplateCreators(params)

      expect(result.queryKey).toEqual([
        'PurposeTemplateGetPublishedPurposeTemplateCreators',
        params,
      ])
    })

    it('should call getPublishedPurposeTemplateCreators service when queryFn is executed', async () => {
      const params = {
        q: 'test-query',
        offset: 0,
        limit: 10,
      }
      const mockResponse: AxiosResponse = {
        data: {
          results: [],
          pagination: {
            offset: 0,
            limit: 10,
            totalCount: 0,
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never,
      }
      vi.mocked(PurposeTemplateServices.getPublishedPurposeTemplateCreators).mockResolvedValue(
        mockResponse
      )

      const result = PurposeTemplateQueries.getPublishedPurposeTemplateCreators(params)

      expect(result.queryFn).toBeDefined()
      const data = await (result.queryFn as () => Promise<unknown>)()

      expect(PurposeTemplateServices.getPublishedPurposeTemplateCreators).toHaveBeenCalledWith(
        params
      )
      expect(data).toEqual(mockResponse)
    })
  })
})
