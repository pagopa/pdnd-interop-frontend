import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { CatalogEServiceTemplates, GetEServiceTemplatesCatalogParams } from '../api.generatedTypes'

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

async function getSingle(eserviceTemplateId: string) {
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
  eserviceTemplateId,
  ...payload
}: { eserviceTemplateId: string } & EServiceTemplateNameUpdateSeed) {
  /*const response = await axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eserviceTemplateId}/name/update`,
    payload
  )
  return response.data*/
  return console.log('name template updated') //TODO
}

async function updateEServiceTemplateAudience({
  eserviceTemplateId,
  ...payload
}: { eserviceTemplateId: string } & EServiceTemplateAudienceUpdateSeed) {
  /*const response = await axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/audienceDescription/update`,
    payload
  )
  return response.data*/
  return console.log('audience description template updated') //TODO
}

async function updateTemplateEServiceDescription({
  eserviceTemplateId,
  ...payload
}: { eserviceTemplateId: string } & TemplateEServiceDescriptionUpdateSeed) {
  /*const response = await axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/eserviceDescription/update`,
    payload
  )
  return response.data*/
  return console.log('template eservice description updated') //TODO
}

async function updateEServiceTemplateQuotas({
  eserviceTemplateId,
  voucherLifespan,
  dailyCallsPerConsumer,
  dailyCallsTotal,
  ...payload
}: {
  eserviceTemplateId: string
  voucherLifespan: number
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
}) {
  /*const response = await axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/{eServiceTemplateVersionId}/quotas/update`,
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
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents`,
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
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents/${documentId}`
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
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents/${documentId}/update`,
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
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents/${documentId}`,
    { responseType: 'arraybuffer' }
  )
  return response.data*/
  return console.log('downloaded file')
}

async function getProviderTemplatesCatalogList(params: GetEServiceTemplatesCatalogParams) {
  const response = await axiosInstance.get<CatalogEServiceTemplates>(
    `http://localhost:8080/backend-for-frontend/0.0/catalog/eservices/templates`,
    { params }
  )

  return response.data
}

export const TemplateServices = {
  getProviderTemplatesCatalogList,
  getProviderTemplatesList,
  getSingle,
  updateEServiceTemplateName,
  updateEServiceTemplateAudience,
  updateTemplateEServiceDescription,
  updateEServiceTemplateQuotas,
  postVersionDraftDocument,
  deleteVersionDraftDocument,
  updateVersionDraftDocumentDescription,
  downloadVersionDraftDocument,
}
