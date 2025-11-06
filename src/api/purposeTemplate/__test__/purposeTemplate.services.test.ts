import { PurposeTemplateServices } from '../purposeTemplate.services'
import type {
  GetCatalogPurposeTemplatesParams,
  LinkEServiceToPurposeTemplatePayload,
  UnlinkEServiceToPurposeTemplatePayload,
  PurposeTemplateSeed,
  GetCreatorPurposeTemplatesParams,
} from '../../api.generatedTypes'

import { vi } from 'vitest'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'

// Test constants
const TEST_PURPOSE_TEMPLATE_ID = 'test-template-id'
const TEST_ANSWER_ID = 'test-answer-id'
const TEST_DOCUMENT_ID = 'test-document-id'
const TEST_ESERVICE_ID = 'test-eservice-id'
const TEST_ID = 'test-id'
const TEST_ANSWER_KEY = 'test-answer-key'
const TEST_VALUE = 'test-value'
const TEST_DOCUMENT_NAME = 'test-document.pdf'
const TEST_DOCUMENT_CONTENT = 'test-content'

// Mock axiosInstance to avoid real HTTP calls
vi.mock('@/config/axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    patch: vi.fn().mockResolvedValue({ data: {} }),
  },
}))

// Mock console.log to avoid noise in tests
const mockConsoleLog = vi.fn()
global.console.log = mockConsoleLog

describe('PurposeTemplateServices', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getConsumerPurposeTemplatesList', () => {
    it('should make correct API call with parameters', async () => {
      const params: GetCreatorPurposeTemplatesParams = {
        offset: 0,
        limit: 10,
      }

      await PurposeTemplateServices.getConsumerPurposeTemplatesList(params)

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/creators/purposeTemplates`,
        { params }
      )
    })
  })

  describe('getConsumerCatalogPurposeTemplates', () => {
    it('should make correct API call to catalog endpoint', async () => {
      const params: GetCatalogPurposeTemplatesParams = {
        offset: 0,
        limit: 10,
      }

      await PurposeTemplateServices.getCatalogPurposeTemplates(params)

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/catalog/purposeTemplates`,
        { params }
      )
    })
  })

  describe('getEservicesLinkedToPurposeTemplatesList', () => {
    it('should make correct API call to eservices endpoint', async () => {
      const id = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      await PurposeTemplateServices.getEservicesLinkedToPurposeTemplatesList(id, {
        offset: 0,
        limit: 10,
      })

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/eservices`,
        { params: { offset: 0, limit: 10 } }
      )
    })
  })

  describe('getSingle', () => {
    it('should make correct API call with purpose template id', async () => {
      const id = TEST_ID

      await PurposeTemplateServices.getSingle(id)

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}`
      )
    })
  })

  describe('getAnswerDocuments', () => {
    it('should return empty array for documents', async () => {
      const purposeTemplateId = TEST_PURPOSE_TEMPLATE_ID
      const answerId = TEST_ANSWER_ID

      const result = await PurposeTemplateServices.getAnswerDocuments(purposeTemplateId, answerId)

      expect(result).toEqual([])
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call with purpose template and answer ids', async () => {
    //   const purposeTemplateId = 'template-id'
    //   const answerId = 'answer-id'
    //
    //   await PurposeTemplateServices.getAnswerDocuments(purposeTemplateId, answerId)
    //
    //   expect(axiosInstance.get).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/documents`
    //   )
    // })
  })

  describe('getCatalogPurposeTemplates', () => {
    it('should make correct API call to catalog endpoint', async () => {
      const params: GetCatalogPurposeTemplatesParams = {
        offset: 0,
        limit: 10,
        eserviceIds: ['test-eservice-id'],
      }

      await PurposeTemplateServices.getCatalogPurposeTemplates(params)

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/catalog/purposeTemplates`,
        { params }
      )
    })
  })

  describe('createDraft', () => {
    it('should make correct API call to create draft', async () => {
      const payload: PurposeTemplateSeed = {
        targetDescription: 'Test target description',
        targetTenantKind: 'PA',
        purposeTitle: 'Test Purpose',
        purposeDescription: 'Test purpose description',
        purposeIsFreeOfCharge: true,
        purposeDailyCalls: 1000,
        handlesPersonalData: false,
      }

      await PurposeTemplateServices.createDraft(payload)

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates`,
        payload
      )
    })
  })

  describe('updateDraft', () => {
    it('should make correct API call to update draft', async () => {
      const payload: PurposeTemplateSeed = {
        targetDescription: 'Test target description',
        targetTenantKind: 'PA',
        purposeTitle: 'Test Purpose',
        purposeDescription: 'Test purpose description',
        purposeIsFreeOfCharge: true,
        purposeDailyCalls: 1000,
        handlesPersonalData: false,
      }

      await PurposeTemplateServices.updateDraft({
        purposeTemplateId: TEST_ID,
        ...payload,
      })

      expect(axiosInstance.put).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-id`,
        payload
      )
    })
  })

  describe('linkEserviceToPurposeTemplate', () => {
    it('should make correct API call to link eservice', async () => {
      const payload: LinkEServiceToPurposeTemplatePayload = {
        eserviceId: TEST_ESERVICE_ID,
      }

      await PurposeTemplateServices.linkEserviceToPurposeTemplate({
        purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
        ...payload,
      })

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-template-id/linkEservice`,
        payload
      )
    })
  })

  describe('unlinkEserviceFromPurposeTemplate', () => {
    it('should make correct API call to unlink eservice', async () => {
      const payload: UnlinkEServiceToPurposeTemplatePayload = {
        eserviceId: TEST_ESERVICE_ID,
      }

      await PurposeTemplateServices.unlinkEserviceFromPurposeTemplate({
        purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
        ...payload,
      })

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-template-id/unlinkEservice`,
        payload
      )
    })
  })

  describe('addRiskAnalysisAnswer', () => {
    it('should make correct API call to add risk analysis answer', async () => {
      const mockResponse = { id: TEST_ANSWER_ID }
      vi.mocked(axiosInstance.post).mockResolvedValue({ data: mockResponse })

      const result = await PurposeTemplateServices.addRiskAnalysisAnswer({
        purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
        answerRequest: {
          answerKey: TEST_ANSWER_KEY,
          answerData: {
            values: [TEST_VALUE],
            editable: false,
            annotation: { text: 'test annotation', docs: [] },
            suggestedValues: [],
          },
        },
      })

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-template-id/riskAnalysis/answers`,
        {
          answerKey: TEST_ANSWER_KEY,
          answerData: {
            values: [TEST_VALUE],
            editable: false,
            annotation: { text: 'test annotation', docs: [] },
            suggestedValues: [],
          },
        }
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('addDocumentToAnnotation', () => {
    it('should make correct API call to add document to annotation', async () => {
      const mockResponse = { id: TEST_DOCUMENT_ID }
      vi.mocked(axiosInstance.post).mockResolvedValue({ data: mockResponse })

      const result = await PurposeTemplateServices.addDocumentToAnnotation({
        purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
        answerId: TEST_ANSWER_ID,
        documentPayload: {
          prettyName: TEST_DOCUMENT_NAME,
          doc: new File([TEST_DOCUMENT_CONTENT], TEST_DOCUMENT_NAME),
        },
      })

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-template-id/riskAnalysis/answers/test-answer-id/annotation/documents`,
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('publishDraft', () => {
    it('should make correct API call to publish draft', async () => {
      const mockResponse = { id: TEST_ID, state: 'PUBLISHED' }
      vi.mocked(axiosInstance.post).mockResolvedValue({ data: mockResponse })

      const result = await PurposeTemplateServices.publishDraft({ id: TEST_ID })

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-id/publish`
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteDraft', () => {
    it('should make correct API call to delete draft', async () => {
      await PurposeTemplateServices.deleteDraft({ id: 'test-id' })

      expect(axiosInstance.delete).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-id`
      )
    })
  })

  describe('deleteAnnotation', () => {
    it('should log annotation deletion message', async () => {
      await PurposeTemplateServices.deleteAnnotation({
        purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
        answerId: TEST_ANSWER_ID,
      })

      expect(mockConsoleLog).toHaveBeenCalledWith('Annotation deleted')
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to delete annotation', async () => {
    //   await PurposeTemplateServices.deleteAnnotation({
    //     purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
    //     answerId: TEST_ANSWER_ID,
    //   })
    //
    //   expect(axiosInstance.delete).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-template-id/riskAnalysis/answers/test-answer-id/annotation`
    //   )
    // })
  })

  describe('deleteDocumentFromAnnotation', () => {
    it('should make correct API call to delete document from annotation', async () => {
      vi.mocked(axiosInstance.delete).mockResolvedValue({})

      await PurposeTemplateServices.deleteDocumentFromAnnotation({
        purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
        answerId: TEST_ANSWER_ID,
        documentId: TEST_DOCUMENT_ID,
      })

      expect(axiosInstance.delete).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-template-id/riskAnalysis/answers/test-answer-id/annotation/documents/test-document-id`
      )
    })
  })

  describe('suspendPurposeTemplate', () => {
    it('should make API call to suspend purpose template', async () => {
      await PurposeTemplateServices.suspendPurposeTemplate({ id: TEST_ID })

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-id/suspend`
      )
    })
  })

  describe('reactivatePurposeTemplate', () => {
    it('should make correct API call to reactivate purpose template', async () => {
      await PurposeTemplateServices.reactivatePurposeTemplate({ id: 'test-id' })

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-id/unsuspend`
      )
    })
  })

  describe('archivePurposeTemplate', () => {
    it('should make correct API call to archive purpose template', async () => {
      await PurposeTemplateServices.archivePurposeTemplate({ id: 'test-id' })

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-id/archive`
      )
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to archive purpose template', async () => {
    //   await PurposeTemplateServices.archivePurposeTemplate({ id: TEST_ID })
    //
    //   expect(axiosInstance.post).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-id/archive`
    //   )
    // })
  })
})
