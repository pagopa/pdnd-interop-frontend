import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import {
  EServiceTemplateDescriptionUpdateSeed,
  EServiceTemplateNameUpdateSeed,
  EServiceTemplateVersionQuotasUpdateSeed,
} from '../api.generatedTypes'

async function getProviderTemplatesList() {
  //TODO params: GetProducerTemplatesParams
  /*const response = await axiosInstance.get<EServiceTemplates>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates`,
    { params }
  )
  return response.data*/
  const response = {
    results: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'Object One',
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
        name: 'Object Two',
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
        name: 'Object Three',
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

async function getSingle(eServiceTemplateId: string) {
  /*const response = await axiosInstance.get<EServiceTemplate>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}`
  )
  return response.data*/
  const response = {
    id: "b7a5c9d2-7d91-4f39-8baf-c214de60b707",
    version: 1,
    description: "Test description for the service",
    voucherLifespan: 365,
    dailyCallsPerConsumer: 5,
    dailyCallsTotal: 100,
    interface: {
      id: "d2a9cbd0-9b4e-4c60-bf8d-980b5367d5f9",
      name: "Sample Interface",
      contentType: "application/json",
      prettyName: "Sample JSON Interface"
    },
    docs: [
      {
        id: "a5f98e62-4b56-40d3-933f-29246630bb71",
        name: "API Documentation",
        contentType: "application/pdf",
        prettyName: "API Docs"
      }
    ],
    state: "PUBLISHED",
    agreementApprovalPolicy: "MANUAL",
    attributes: {
      certified: [
        [
          {
            id: "b6a5f2bc-81e0-4b8b-b8b5-8f9845be2c2a",
            name: "Certification Status",
            description: "Indicates if the service is certified",
            explicitAttributeVerification: true
          }
        ]
      ],
      declared: [
        [
          {
            id: "c1b3f0d2-c6b3-4926-906b-c84ef9a9d92b",
            name: "Service Description",
            description: "Description of the service functionality",
            explicitAttributeVerification: false
          }
        ]
      ],
      verified: [
        [
          {
            id: "e7d537bb-53b3-4671-bc3b-9801fd592be3",
            name: "Verification Status",
            description: "Indicates whether the service is verified",
            explicitAttributeVerification: true
          }
        ]
      ]
    },
    eserviceTemplate: {
      id: "f64bd7b7-fc36-4bff-9be0-8db1c9c16e27",
      creator: {
        id: "7fa86fd1-bba3-4b6e-98b7-0fcf53f5b89d",
        name: "John Doe",
        kind: "PA",
        contactMail: {
          address: "johndoe@example.com",
          description: "Primary contact email for support"
        }
      },
      name: "Sample eService",
      audienceDescription: "A sample eService for testing purposes",
      eserviceDescription: "This service allows users to test various API features",
      technology: "REST",
      versions: [
        {
          id: "a92b154d-7439-493b-bd8b-bd1fbb8a2e32",
          version: 1,
          state: "DRAFT"
        }
      ],
      riskAnalysis: [
        {
          id: "e85c4701-b586-4319-b083-184f37d87769",
          name: "Security Risk Analysis",
          riskAnalysisForm: {
            version: "1.0",
            answers: {
              additionalProp1: [
                "High risk of data breach"
              ],
              additionalProp2: [
                "Low risk of service downtime"
              ],
              additionalProp3: [
                "Medium risk of unauthorized access"
              ]
            },
            riskAnalysisId: "e85c4701-b586-4319-b083-184f37d87769"
          },
          createdAt: "2025-02-13T16:20:00.169Z"
        }
      ],
      mode: "DELIVER",
      isSignalHubEnabled: false
    }
  }
  
  return response

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
  templateId,
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
  templateId,
  documentId,
}: {
  templateId: string
  documentId: string
}) {
  /* return axiosInstance.delete(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/documents/${documentId}`
  )*/
  return console.log('deleted doc')
}

async function updateVersionDraftDocumentDescription({
  templateId,
  documentId,
  ...payload
}: {
  templateId: string
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
  templateId,
  documentId,
}: {
  templateId: string
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
  eserviceTemplateId: string
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
  ...payload
}: {
  eServiceTemplateId: string
  descriptorId: string
} & UpdateEServiceDescriptorSeed) {
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
}
