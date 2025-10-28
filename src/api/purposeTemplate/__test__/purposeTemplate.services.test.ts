import { PurposeTemplateServices } from '../purposeTemplate.services'
import { purposeTemplatesListMock, mockCatalogPurposeTemplates } from '../mockedResponses'
import type { GetConsumerPurposeTemplatesParams } from '../mockedResponses'
import type {
  GetCatalogPurposeTemplatesParams,
  LinkEServiceToPurposeTemplatePayload,
  UnlinkEServiceToPurposeTemplatePayload,
  PurposeTemplateSeed,
} from '../../api.generatedTypes'

import { vi } from 'vitest'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'

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
    it('should return mocked purpose templates list', async () => {
      const params: GetConsumerPurposeTemplatesParams = {
        offset: 0,
        limit: 10,
      }

      const result = await PurposeTemplateServices.getConsumerPurposeTemplatesList(params)

      expect(result).toEqual(purposeTemplatesListMock)
      expect(result).toHaveLength(5)
    })

    it('should handle different query parameters', async () => {
      const params: GetConsumerPurposeTemplatesParams = {
        q: 'healthcare',
        eservicesIds: ['11111111-1111-1111-1111-111111111111'],
        states: ['ACTIVE'],
        offset: 0,
        limit: 20,
      }

      const result = await PurposeTemplateServices.getConsumerPurposeTemplatesList(params)

      expect(result).toEqual(purposeTemplatesListMock)
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call with parameters', async () => {
    //   const params: GetConsumerPurposeTemplatesParams = {
    //     offset: 0,
    //     limit: 10,
    //   }
    //
    //   await PurposeTemplateServices.getConsumerPurposeTemplatesList(params)
    //
    //   expect(axiosInstance.get).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/creators/purposeTemplates`,
    //     { params }
    //   )
    // })
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
      const id = 'test-id'

      await PurposeTemplateServices.getSingle(id)

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}`
      )
    })
  })

  describe('getAnswerDocuments', () => {
    it('should return empty array for documents', async () => {
      const purposeTemplateId = 'test-template-id'
      const answerId = 'test-answer-id'

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
    it('should make correct API call to catalog endpoint with id', async () => {
      await PurposeTemplateServices.getCatalogPurposeTemplates({
        offset: 0,
        limit: 10,
      })

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/catalog/purposeTemplates`,
        { params: { offset: 0, limit: 10 } }
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
        purposeTemplateId: 'test-id',
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
        eserviceId: 'test-eservice-id',
      }

      await PurposeTemplateServices.linkEserviceToPurposeTemplate({
        purposeTemplateId: 'test-template-id',
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
        eserviceId: 'test-eservice-id',
      }

      await PurposeTemplateServices.unlinkEserviceFromPurposeTemplate({
        purposeTemplateId: 'test-template-id',
        ...payload,
      })

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-template-id/unlinkEservice`,
        payload
      )
    })
  })

  describe('addAnnotationToAnswer', () => {
    it('should log annotation addition message', async () => {
      await PurposeTemplateServices.addAnnotationToAnswer({
        purposeTemplateId: 'test-template-id',
        answerId: 'test-answer-id',
      })

      expect(mockConsoleLog).toHaveBeenCalledWith('Added annotation to answer')
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to add annotation', async () => {
    //   await PurposeTemplateServices.addAnnotationToAnswer({
    //     purposeTemplateId: 'test-template-id',
    //     answerId: 'test-answer-id',
    //   })
    //
    //   expect(axiosInstance.patch).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-template-id/riskAnalysis/answers/test-answer-id/annotation`
    //   )
    // })
  })

  describe('addDocumentsToAnnotation', () => {
    it('should log documents addition message', async () => {
      await PurposeTemplateServices.addDocumentsToAnnotation({
        purposeTemplateId: 'test-template-id',
        answerId: 'test-answer-id',
      })

      expect(mockConsoleLog).toHaveBeenCalledWith('Added documents to annotation')
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to add documents', async () => {
    //   await PurposeTemplateServices.addDocumentsToAnnotation({
    //     purposeTemplateId: 'test-template-id',
    //     answerId: 'test-answer-id',
    //   })
    //
    //   expect(axiosInstance.post).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-template-id/riskAnalysis/answers/test-answer-id/annotation/documents`
    //   )
    // })
  })

  describe('publishDraft', () => {
    it('should log draft publication message', async () => {
      await PurposeTemplateServices.publishDraft({ id: 'test-id' })

      expect(mockConsoleLog).toHaveBeenCalledWith('Draft published')
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to publish draft', async () => {
    //   await PurposeTemplateServices.publishDraft({ id: 'test-id' })
    //
    //   expect(axiosInstance.post).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-id/publish`
    //   )
    // })
  })

  describe('deleteDraft', () => {
    it('should log draft deletion message', async () => {
      await PurposeTemplateServices.deleteDraft({ id: 'test-id' })

      expect(mockConsoleLog).toHaveBeenCalledWith('Draft deleted')
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to delete draft', async () => {
    //   await PurposeTemplateServices.deleteDraft({ id: 'test-id' })
    //
    //   expect(axiosInstance.delete).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-id`
    //   )
    // })
  })

  describe('deleteAnnotation', () => {
    it('should log annotation deletion message', async () => {
      await PurposeTemplateServices.deleteAnnotation({
        purposeTemplateId: 'test-template-id',
        answerId: 'test-answer-id',
      })

      expect(mockConsoleLog).toHaveBeenCalledWith('Annotation deleted')
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to delete annotation', async () => {
    //   await PurposeTemplateServices.deleteAnnotation({
    //     purposeTemplateId: 'test-template-id',
    //     answerId: 'test-answer-id',
    //   })
    //
    //   expect(axiosInstance.delete).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-template-id/riskAnalysis/answers/test-answer-id/annotation`
    //   )
    // })
  })

  describe('deleteDocument', () => {
    it('should log document deletion message', async () => {
      await PurposeTemplateServices.deleteDocument({
        purposeTemplateId: 'test-template-id',
        answerId: 'test-answer-id',
        documentId: 'test-document-id',
      })

      expect(mockConsoleLog).toHaveBeenCalledWith('Document deleted')
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to delete document', async () => {
    //   await PurposeTemplateServices.deleteDocument({
    //     purposeTemplateId: 'test-template-id',
    //     answerId: 'test-answer-id',
    //     documentId: 'test-document-id',
    //   })
    //
    //   expect(axiosInstance.delete).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-template-id/riskAnalysis/answers/test-answer-id/annotation/documents/test-document-id`
    //   )
    // })
  })

  describe('suspendPurposeTemplate', () => {
    it('should log suspension message', async () => {
      await PurposeTemplateServices.suspendPurposeTemplate({ id: 'test-id' })

      expect(mockConsoleLog).toHaveBeenCalledWith('Suspended')
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to suspend purpose template', async () => {
    //   await PurposeTemplateServices.suspendPurposeTemplate({ id: 'test-id' })
    //
    //   expect(axiosInstance.post).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-id/suspend`
    //   )
    // })
  })

  describe('reactivatePurposeTemplate', () => {
    it('should log reactivation message', async () => {
      await PurposeTemplateServices.reactivatePurposeTemplate({ id: 'test-id' })

      expect(mockConsoleLog).toHaveBeenCalledWith('Reactivate')
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to reactivate purpose template', async () => {
    //   await PurposeTemplateServices.reactivatePurposeTemplate({ id: 'test-id' })
    //
    //   expect(axiosInstance.post).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-id/unsuspend`
    //   )
    // })
  })

  describe('archivePurposeTemplate', () => {
    it('should log archiving message', async () => {
      await PurposeTemplateServices.archivePurposeTemplate({ id: 'test-id' })

      expect(mockConsoleLog).toHaveBeenCalledWith('Archived!')
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to archive purpose template', async () => {
    //   await PurposeTemplateServices.archivePurposeTemplate({ id: 'test-id' })
    //
    //   expect(axiosInstance.post).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-id/archive`
    //   )
    // })
  })
})
