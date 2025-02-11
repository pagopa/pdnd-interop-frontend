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
  const response = [
    {
      id: 'mock_templateid1',
      name: 'mock_templatename1',
      version: '1',
      state: 'ACTIVE',
    },
    { id: 'mock_templateid2', name: 'mock_templatename2', version: '1', state: 'DRAFT' },
  ]
  return response
}

async function getSingle(eServiceTemplateId: string) {
  /*const response = await axiosInstance.get<EServiceTemplate>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates//${eServiceTemplateId}`
  )
  return response.data*/
  return {
    id: 'mock_templateid1',
    name: 'mock_templatename1',
    versions: [
      {
        id: '1',
        version: '1',
        description: 'mock_versionDescription1',
        state: 'active',
        voucherLifespan: 600,
        dailyCallsPerConsumer: 10,
        dailyCallsTotal: 100,
      },
    ],
    state: 'ACTIVE',
    eserviceDescription: 'mock_description1',
    audienceDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum efficitur viverra egestas. Aenean mollis libero sit amet leo dignissim, vel elementum libero iaculis. Praesent tempus ex et iaculis ultrices. Maecenas faucibus, neque quis vulputate iaculis, purus lacus.',
    creatorId: 'SFDGVDVDGF',
    technology: 'REST',
    mode: 'RECEIVE',
    isSignalHubEnabled: false,
    attributes: [
      {
        certified: [''],
        verified: [''],
        declared: [''],
      },
    ],
  }
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
  eserviceId: string
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
