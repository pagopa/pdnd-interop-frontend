import { PurposeTemplateServices } from '../purposeTemplate.services'
import {
  purposeTemplatesListMock,
  purposeTemplateMock,
  eservicesLinkedToPurposeTemplatesMock,
  purposeTemplateEservicesMock,
  mockCatalogPurposeTemplates,
} from '../mockedResponses'
import type {
  GetConsumerPurposeTemplatesParams,
  PurposeTemplateUpdateContent,
  RiskAnalysisFormTemplateSeed,
} from '../mockedResponses'
import type {
  GetCatalogPurposeTemplatesParams,
  LinkEServiceToPurposeTemplatePayload,
  UnlinkEServiceToPurposeTemplatePayload,
  PurposeTemplateSeed,
} from '../../api.generatedTypes'

import { vi } from 'vitest'

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

  describe('getConsumerCatalogPurposeTemplates', () => {
    it('should return mocked catalog purpose templates', async () => {
      const params: GetCatalogPurposeTemplatesParams = {
        offset: 0,
        limit: 10,
      }

      const result = await PurposeTemplateServices.getConsumerCatalogPurposeTemplates(params)

      expect(result).toEqual(mockCatalogPurposeTemplates)
      expect(result.results).toHaveLength(3)
      expect(result.pagination.totalCount).toBe(3)
    })

    it('should handle different catalog query parameters', async () => {
      const params: GetCatalogPurposeTemplatesParams = {
        creatorIds: ['88e8b9c5-81c2-4e49-ae88-b1d1d6b848c3'],
        targetTenantKind: 'PA',
        offset: 0,
        limit: 5,
      }

      const result = await PurposeTemplateServices.getConsumerCatalogPurposeTemplates(params)

      expect(result).toEqual(mockCatalogPurposeTemplates)
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to catalog endpoint', async () => {
    //   const params: GetCatalogPurposeTemplatesParams = {
    //     offset: 0,
    //     limit: 10,
    //   }
    //
    //   await PurposeTemplateServices.getConsumerCatalogPurposeTemplates(params)
    //
    //   expect(axiosInstance.get).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/catalog/purposeTemplates`,
    //     { params }
    //   )
    // })
  })

  describe('getEservicesLinkedToPurposeTemplatesList', () => {
    it('should return mocked eservices linked to purpose templates', async () => {
      const id = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      const result = await PurposeTemplateServices.getEservicesLinkedToPurposeTemplatesList(id, {
        offset: 0,
        limit: 10,
      })

      expect(result).toEqual(eservicesLinkedToPurposeTemplatesMock)
      expect(result).toHaveLength(5)
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to eservices endpoint', async () => {
    //   await PurposeTemplateServices.getEservicesLinkedToPurposeTemplatesList()
    //
    //   expect(axiosInstance.get).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/eservices`
    //   )
    // })
  })

  describe('getSingle', () => {
    it('should return mocked single purpose template', async () => {
      const id = '55555555-5555-5555-5555-555555555555'

      const result = await PurposeTemplateServices.getSingle(id)

      expect(result).toEqual(purposeTemplateMock)
      expect(result.id).toBe('55555555-5555-5555-5555-555555555555')
    })

    it('should handle different purpose template ids', async () => {
      const id = '11111111-1111-1111-1111-111111111111'

      const result = await PurposeTemplateServices.getSingle(id)

      expect(result).toEqual(purposeTemplateMock)
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call with purpose template id', async () => {
    //   const id = 'test-id'
    //
    //   await PurposeTemplateServices.getSingle(id)
    //
    //   expect(axiosInstance.get).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}`
    //   )
    // })
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
    it('should return mocked catalog purpose templates for given id', async () => {
      const result = await PurposeTemplateServices.getConsumerCatalogPurposeTemplates({
        offset: 0,
        limit: 10,
      })

      expect(result).toEqual(mockCatalogPurposeTemplates)
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to catalog endpoint with id', async () => {
    //   const id = 'test-id'
    //
    //   await PurposeTemplateServices.getConsumerCatalogPurposeTemplates({
    //     offset: 0,
    //     limit: 10,
    //   })
    //
    //   expect(axiosInstance.get).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/catalog/purposeTemplates`
    //   )
    // })
  })

  describe('createDraft', () => {
    it('should log draft creation message', async () => {
      const payload: PurposeTemplateSeed = {
        targetDescription: 'Test target description',
        targetTenantKind: 'PA',
        purposeTitle: 'Test Purpose',
        purposeDescription: 'Test purpose description',
        purposeIsFreeOfCharge: true,
        purposeDailyCalls: 1000,
      }

      await PurposeTemplateServices.createDraft(payload)

      expect(mockConsoleLog).toHaveBeenCalledWith('Draft created')
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to create draft', async () => {
    //   const payload: PurposeTemplateSeed = {
    //     targetDescription: 'Test target description',
    //     targetTenantKind: 'PA',
    //     purposeTitle: 'Test Purpose',
    //     purposeDescription: 'Test purpose description',
    //     purposeIsFreeOfCharge: true,
    //     purposeDailyCalls: 1000,
    //   }
    //
    //   await PurposeTemplateServices.createDraft(payload)
    //
    //   expect(axiosInstance.post).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates`,
    //     payload
    //   )
    // })
  })

  describe('updateDraft', () => {
    it('should log draft update message', async () => {
      const payload: PurposeTemplateSeed = {
        targetDescription: 'Updated target description',
        targetTenantKind: 'GSP',
        purposeTitle: 'Updated Purpose Title',
        purposeDescription: 'Updated purpose description',
        purposeIsFreeOfCharge: false,
      }

      await PurposeTemplateServices.updateDraft({
        purposeTemplateId: 'test-id',
        ...payload,
      })

      expect(mockConsoleLog).toHaveBeenCalledWith('Draft updated!')
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to update draft', async () => {
    //   const payload: PurposeTemplateUpdateContent = {
    //     title: 'Updated Title',
    //     description: 'Updated description',
    //     isFreeOfCharge: false,
    //     freeOfChargeReason: 'Paid service',
    //     dailyCalls: 2000,
    //   }
    //
    //   await PurposeTemplateServices.updateDraft({
    //     purposeTemplateId: 'test-id',
    //     ...payload,
    //   })
    //
    //   expect(axiosInstance.post).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-id`,
    //     payload
    //   )
    // })
  })

  describe('addEserviceToPurposeTemplate', () => {
    it('should log eservice addition message', async () => {
      const payload: LinkEServiceToPurposeTemplatePayload = {
        eserviceId: 'test-eservice-id',
      }

      await PurposeTemplateServices.linkEserviceToPurposeTemplate({
        purposeTemplateId: 'test-template-id',
        ...payload,
      })

      expect(mockConsoleLog).toHaveBeenCalledWith('Added eservice')
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to link eservice', async () => {
    //   const payload: LinkEServiceToPurposeTemplatePayload = {
    //     eserviceId: 'test-eservice-id',
    //     descriptorId: 'test-descriptor-id',
    //   }
    //
    //   await PurposeTemplateServices.addEserviceToPurposeTemplate({
    //     purposeTemplateId: 'test-template-id',
    //     ...payload,
    //   })
    //
    //   expect(axiosInstance.post).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-template-id/linkEservice`,
    //     payload
    //   )
    // })
  })

  describe('removeEserviceToPurposeTemplate', () => {
    it('should log eservice removal message', async () => {
      const payload: UnlinkEServiceToPurposeTemplatePayload = {
        eserviceId: 'test-eservice-id',
      }

      await PurposeTemplateServices.unlinkEserviceFromPurposeTemplate({
        purposeTemplateId: 'test-template-id',
        ...payload,
      })

      expect(mockConsoleLog).toHaveBeenCalledWith('removed eservice')
    })

    // TODO: Update this test when real API calls are implemented
    // it('should make correct API call to unlink eservice', async () => {
    //   const payload: UnlinkEServiceToPurposeTemplatePayload = {
    //     eserviceId: 'test-eservice-id',
    //     descriptorId: 'test-descriptor-id',
    //   }
    //
    //   await PurposeTemplateServices.removeEserviceToPurposeTemplate({
    //     purposeTemplateId: 'test-template-id',
    //     ...payload,
    //   })
    //
    //   expect(axiosInstance.post).toHaveBeenCalledWith(
    //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/test-template-id/unlinkEservice`,
    //     payload
    //   )
    // })
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
