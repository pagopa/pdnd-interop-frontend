import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import {
  CatalogEServiceTemplates,
  DescriptorAttributesSeed,
  EServiceRiskAnalysisSeed,
  EServiceTemplateDescriptionUpdateSeed,
  EServiceTemplateInstances,
  EServiceTemplateNameUpdateSeed,
  EServiceTemplateSeed,
  EServiceTemplateVersionDetails,
  EServiceTemplateVersionQuotasUpdateSeed,
  GetEServiceTemplatesCatalogParams,
  GetProducerEServices2Params,
  ProducerEServiceTemplates,
  UpdateEServiceTemplateSeed,
  UpdateEServiceTemplateVersionSeed,
} from '../api.generatedTypes'
import { AttributeKey } from '@/types/attribute.types'

async function getProviderTemplatesList(params: GetProducerEServices2Params) {
  /*const response = await axiosInstance.get<EServiceTemplates>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates`,
    { params }
  )
  return response.data*/
  const response: ProducerEServiceTemplates = {
    results: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'Mock template 1',
        activeVersion: {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          version: 1,
          state: 'PUBLISHED',
        },
        draftVersion: {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          version: 2,
          state: 'DRAFT',
        },
      },
      {
        id: 'd9e1f34f-2c74-423f-9235-b56e9b99b3bf',
        name: 'Mock template 2',
        activeVersion: {
          id: 'd9e1f34f-2c74-423f-9235-b56e9b99b3bf',
          version: 1,
          state: 'DRAFT',
        },
        draftVersion: {
          id: 'd9e1f34f-2c74-423f-9235-b56e9b99b3bf',
          version: 1,
          state: 'DRAFT',
        },
      },
      {
        id: '29a8a7f8-6f93-4d47-a63d-6f31e54762f9',
        name: 'Mock template 3',
        activeVersion: {
          id: '29a8a7f8-6f93-4d47-a63d-6f31e54762f9',
          version: 2,
          state: 'PUBLISHED',
        },
        draftVersion: {
          id: '29a8a7f8-6f93-4d47-a63d-6f31e54762f9',
          version: 3,
          state: 'DRAFT',
        },
      },
    ],
    pagination: {
      offset: 0,
      limit: 3,
      totalCount: 3,
    },
  }
  return response
}

async function getSingle(eServiceTemplateId: string, eServiceTemplateVersionId: string) {
  /*const response = await axiosInstance.get<GetEServiceTemplateVersion>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/{eServiceTemplateId}/versions/{eServiceTemplateVersionId}`
  )
  return response.data*/
  const response: EServiceTemplateVersionDetails = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    version: 1,
    description: 'This is a sample e-service template version.',
    voucherLifespan: 30,
    dailyCallsPerConsumer: 1000,
    dailyCallsTotal: 5000,
    interface: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Sample API',
      contentType: 'application/json',
      prettyName: 'Sample API Interface',
    },
    docs: [
      {
        id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'API Documentation',
        contentType: 'application/pdf',
        prettyName: 'API Documentation File',
      },
    ],
    state: 'PUBLISHED',
    agreementApprovalPolicy: 'AUTOMATIC',
    attributes: {
      certified: [
        [
          {
            id: '123e4567-e89b-12d3-a456-426614174010',
            name: 'Certified Attribute 1',
            description: 'Description for certified attribute 1.',
            explicitAttributeVerification: true,
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174011',
            name: 'Certified Attribute 2',
            description: 'Description for certified attribute 2.',
            explicitAttributeVerification: false,
          },
        ],
      ],
      declared: [
        [
          {
            id: '123e4567-e89b-12d3-a456-426614174012',
            name: 'Declared Attribute 1',
            description: 'Description for declared attribute 1.',
            explicitAttributeVerification: false,
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174013',
            name: 'Declared Attribute 2',
            description: 'Description for declared attribute 2.',
            explicitAttributeVerification: true,
          },
        ],
      ],
      verified: [
        [
          {
            id: '123e4567-e89b-12d3-a456-426614174014',
            name: 'Verified Attribute 1',
            description: 'Description for verified attribute 1.',
            explicitAttributeVerification: true,
          },
        ],
      ],
    },
    eserviceTemplate: {
      id: '123e4567-e89b-12d3-a456-426614174003',
      creator: {
        id: 'org-123',
        name: 'Sample Organization',
      },
      name: 'Sample E-Service Template',
      audienceDescription: 'Targeted at developers and API consumers.',
      eserviceDescription: 'This is a sample e-service template for testing purposes.',
      technology: 'REST',
      versions: [
        {
          id: '123e4567-e89b-12d3-a456-426614174004',
          version: 1,
          state: 'PUBLISHED',
        },
      ],
      riskAnalysis: [
        {
          id: '123e4567-e89b-12d3-a456-426614174005',
          name: 'Sample Risk Analysis',
          riskAnalysisForm: {
            version: '1.0',
            answers: { risk1: 'high', risk2: 'medium' },
          },
          createdAt: '2025-02-14T10:00:00Z',
        },
      ],
      mode: 'DELIVER',
      isSignalHubEnabled: true,
    },
  }

  return response
}

async function updateEServiceTemplateName({
  eServiceTemplateId,
  ...payload
}: { eServiceTemplateId: string } & EServiceTemplateNameUpdateSeed) {
  /*const response = await axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/name/update`,
    payload
  )
  return response.data*/
  return console.log('name template updated') //TODO
}

async function updateEServiceTemplateAudienceDescription({
  eServiceTemplateId,
  ...payload
}: {
  eServiceTemplateId: string
}) {
  /*const response = await axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/audienceDescription/update`,
    payload
  )
  return response.data*/
  return console.log('audience description template updated') //TODO
}

async function updateEServiceTemplateDescription({
  eServiceTemplateId,
  ...payload
}: { eServiceTemplateId: string } & EServiceTemplateDescriptionUpdateSeed) {
  /*const response = await axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/eserviceDescription/update`,
    payload
  )
  return response.data*/
  return console.log('template eservice description updated') //TODO
}

async function updateEServiceTemplateQuotas({
  eServiceTemplateId,
  eServiceTemplateVersionId,
  ...payload
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
} & EServiceTemplateVersionQuotasUpdateSeed) {
  /*const response = await axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/quotas/update`,
    payload
  )
  return response.data*/
  return console.log('template eservice quotas updated') //TODO
}

async function postVersionDraftDocument({
  eServiceTemplateId,
  ...payload
}: {
  eserviceId: string
  descriptorId: string
} & CreateEServiceDocumentPayload) {
  /*const formData = new FormData()
  Object.entries(payload).forEach(([key, data]) => formData.append(key, data))

  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/documents`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return response.data*/
  return console.log('uploaded doc')
}

function deleteVersionDraftDocument({
  eServiceTemplateId,
  eServiceTemplateVersionId,
  documentId,
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
  documentId: string
}) {
  /* return axiosInstance.delete(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/documents/${documentId}`
  )*/
  return console.log('deleted doc')
}

async function updateVersionDraftDocumentDescription({
  eServiceTemplateId,
  eServiceTemplateVersionId,
  documentId,
  ...payload
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
  documentId: string
} & UpdateEServiceDescriptorDocumentSeed) {
  /*const response = await axiosInstance.post<EServiceDoc>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/documents/${documentId}/update`,
    payload
  )
  return response.data*/
  return console.log('updated doc')
}

async function downloadVersionDraftDocument({
  eServiceTemplateId,
  eServiceTemplateVersionId,
  documentId,
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
  documentId: string
}) {
  /*const response = await axiosInstance.get<File>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/documents/${documentId}`,
    { responseType: 'arraybuffer' }
  )
  return response.data*/
  return console.log('downloaded file')
}

async function createDraft(payload: EServiceTemplateSeed) {
  /*const response = await axiosInstance.post<CreatedEServiceTemplateDescriptor>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates`,
    payload
  )
  return response.data*/
  return console.log('Draft created')
}

async function updateDraft({
  eServiceTemplateId,
  ...payload
}: {
  eServiceTemplateId: string
} & UpdateEServiceTemplateSeed) {
  /*const response = await axiosInstance.put<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/{eServiceTemplateId}`,
    payload
  )
  return response.data*/
  return console.log('Draft updated')
}

async function updateVersionDraft({
  eServiceTemplateId,
  eServiceTemplateVersionId,
  ...payload
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
} & UpdateEServiceTemplateVersionSeed) {
  /*const response = await axiosInstance.put<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/{eServiceTemplateId}/versions/{eServiceTemplateVersionId}`,
    payload
  )
  return response.data*/
  return console.log('version draft updated')
}

function addTemplateRiskAnalysis({
  eServiceTemplateId,
  ...payload
}: {
  eServiceTemplateId: string
} & EServiceRiskAnalysisSeed) {
  /*return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/{eServiceTemplateId}/riskAnalysis`,
    payload
  )*/
  return console.log('added template risk analysis')
}

function updateTemplateRiskAnalysis({
  eServiceTemplateId,
  riskAnalysisId,
  ...payload
}: {
  eServiceTemplateId: string
  riskAnalysisId: string
} & EServiceRiskAnalysisSeed) {
  /*return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/riskAnalysis/{riskAnalysisId}`,
    payload
  )*/
  return console.log('template risk analysis updated')
}

function deleteTemplateRiskAnalysis({
  eServiceTemplateId,
  riskAnalysisId,
}: {
  eServiceTemplateId: string
  riskAnalysisId: string
}) {
  /*return axiosInstance.delete(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/riskAnalysis/{riskAnalysisId} `
  )*/
  return console.log('template risk analysis deleted')
}

async function updateAttributes({
  eServiceTemplateId,
  eServiceTemplateVersionId,
  attributeKey: _attributeKey,
  ...payload
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
  attributeKey: AttributeKey
} & DescriptorAttributesSeed) {
  /* axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/attributes/update`,
    payload
  )*/
  return console.log('attributes updated')
}

function publishVersionDraft({
  eServiceTemplateId,
  eServiceTemplateVersionId,
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
}) {
  /*return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/publish`
  )*/
  return console.log('draft published')
}

function deleteVersionDraft({
  eServiceTemplateId,
  eServiceTemplateVersionId,
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
}) {
  //return axiosInstance.delete(`${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}`)
  return console.log('deleted draft version')
}

function suspendVersion({
  eServiceTemplateId,
  eServiceTemplateVersionId,
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
}) {
  /*return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/${eServiceTemplateVersionId}/suspend`
  )*/
  return console.log('version suspended')
}

function reactivateVersion({
  eServiceTemplateId,
  eServiceTemplateVersionId,
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
}) {
  /*return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/${eServiceTemplateVersionId}/activate`
  )*/
  return console.log('version activated')
}

async function getProviderTemplateInstancesList(eServiceTemplateId: string) {
  /*const response = await axiosInstance.post<CreatedEServiceDescriptor>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/instances`
  )
  return response.data*/

  const response: EServiceTemplateInstances = {
    results: [
      {
        id: 'd3e7b88d-7a2b-4b56-9872-85fc5c7a4399',
        producerName: 'Producer One',
        state: 'PUBLISHED',
        instanceId: 'instance-001',
        version: 1,
      },
      {
        id: 'a9f23b1d-36fd-4570-81a0-7a423d15f928',
        producerName: 'Producer Two',
        state: 'DRAFT',
        instanceId: 'instance-002',
        version: 2,
      },
      {
        id: 'fbe3ad6c-875d-4c32-b88e-287bc0a2fcbb',
        producerName: 'Producer Three',
        state: 'SUSPENDED',
        instanceId: 'instance-003',
        version: 3,
      },
    ],
    totalCount: 3,
  }

  return response
}

async function getProviderTemplatesCatalogList(params: GetEServiceTemplatesCatalogParams) {
  /*const response = await axiosInstance.get<CatalogEServiceTemplates>(
    `${BACKEND_FOR_FRONTEND_URL}/catalog/eservices/templates`,
    { params }
  )

  return response.data*/
  const response = {
    results: [
      {
        id: 'b92f23d1-72b3-4b87-bf2f-5278657cb123',
        name: 'Template A',
        description: 'A description of Template A.',
        creator: {
          id: 'c0b24d89-26fe-496b-9901-13348f5f9f0a',
          name: 'Organization A',
          kind: 'PA',
          contactMail: {
            address: 'contact@orgA.com',
            description: 'Main contact email',
          },
        },
        publishedVersion: {
          id: 'a1c4ef23-6359-4f0f-93f4-7a9c2830e2b5',
          version: 1,
          state: 'PUBLISHED',
        },
      },
      {
        id: '7ad55c3b-bde3-4f75-bb68-8d5d036f865d',
        name: 'Template B',
        description: 'A description of Template B.',
        creator: {
          id: 'f123bb38-d5a1-43b5-b590-0c64c47f901e',
          name: 'Organization B',
          kind: 'PRIVATE',
          contactMail: {
            address: 'support@orgB.com',
          },
        },
        publishedVersion: {
          id: '3f8e7b6b-4707-47c0-95a4-b6b1a2cc87f7',
          version: 2,
          state: 'DRAFT',
        },
      },
    ],
    pagination: {
      offset: 0,
      limit: 2,
      totalCount: 10,
    },
  }

  return response
}

export const TemplateServices = {
  getProviderTemplatesList,
  getSingle,
  updateEServiceTemplateName,
  updateEServiceTemplateAudienceDescription,
  updateEServiceTemplateDescription,
  updateEServiceTemplateQuotas,
  postVersionDraftDocument,
  deleteVersionDraftDocument,
  updateVersionDraftDocumentDescription,
  downloadVersionDraftDocument,
  createDraft,
  updateDraft,
  updateVersionDraft,
  addTemplateRiskAnalysis,
  updateTemplateRiskAnalysis,
  deleteTemplateRiskAnalysis,
  updateAttributes,
  publishVersionDraft,
  deleteVersionDraft,
  suspendVersion,
  reactivateVersion,
  getProviderTemplateInstancesList,
  getProviderTemplatesCatalogList,
}
