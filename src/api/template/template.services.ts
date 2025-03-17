import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type {
  CreatedEServiceDescriptor,
  DescriptorAttributesSeed,
  EServiceTemplateDescriptionUpdateSeed,
  EServiceTemplateDetails,
  EServiceTemplateInstances,
  EServiceTemplateNameUpdateSeed,
  EServiceTemplateSeed,
  EServiceTemplateVersionDetails,
  EServiceTemplateVersionQuotasUpdateSeed,
  InstanceEServiceSeed,
  GetEServiceTemplatesCatalogParams,
  ProducerEServiceTemplates,
  UpdateEServiceTemplateSeed,
  UpdateEServiceTemplateVersionSeed,
  GetEServiceTemplateCreatorsParams,
  GetProducerEServicesParams,
  CreateEServiceTemplateDocumentPayload,
  UpdateEServiceTemplateVersionDocumentSeed,
  CreatedEServiceTemplateVersion,
  CatalogEServiceTemplates,
  GetEServiceTemplateInstancesParams,
  EServiceTemplateRiskAnalysisSeed,
  CreatedResource,
  EServiceDoc,
  CompactOrganizations,
  UpdateEServiceTemplateInstanceSeed,
} from '../api.generatedTypes'
import type { AttributeKey } from '@/types/attribute.types'

async function getProviderTemplatesList(params: GetProducerEServicesParams) {
  const response = await axiosInstance.get<ProducerEServiceTemplates>(
    `${BACKEND_FOR_FRONTEND_URL}/creators/eservices/templates`,
    { params }
  )
  return response.data
  // const response: ProducerEServiceTemplates = {
  //   results: [
  //     {
  //       id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //       name: 'Mock template 1',
  //       mode: 'DELIVER',
  //       activeVersion: {
  //         id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //         version: 1,
  //         state: 'PUBLISHED',
  //       },
  //       draftVersion: {
  //         id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //         version: 2,
  //         state: 'DRAFT',
  //       },
  //     },
  //     {
  //       id: 'd9e1f34f-2c74-423f-9235-b56e9b99b3bf',
  //       name: 'Mock template 2',
  //       mode: 'RECEIVE',
  //       activeVersion: {
  //         id: 'd9e1f34f-2c74-423f-9235-b56e9b99b3bf',
  //         version: 1,
  //         state: 'DRAFT',
  //       },
  //       draftVersion: {
  //         id: 'd9e1f34f-2c74-423f-9235-b56e9b99b3bf',
  //         version: 1,
  //         state: 'DRAFT',
  //       },
  //     },
  //     {
  //       id: '29a8a7f8-6f93-4d47-a63d-6f31e54762f9',
  //       name: 'Mock template 3',
  //       mode: 'DELIVER',
  //       activeVersion: {
  //         id: '29a8a7f8-6f93-4d47-a63d-6f31e54762f9',
  //         version: 2,
  //         state: 'PUBLISHED',
  //       },
  //       draftVersion: {
  //         id: '29a8a7f8-6f93-4d47-a63d-6f31e54762f9',
  //         version: 3,
  //         state: 'DRAFT',
  //       },
  //     },
  //   ],
  //   pagination: {
  //     offset: 0,
  //     limit: 3,
  //     totalCount: 3,
  //   },
  // }
  // return response
}

async function getSingle(eServiceTemplateId: string, eServiceTemplateVersionId: string) {
  const response = await axiosInstance.get<EServiceTemplateVersionDetails>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}`
  )

  return response.data
}

async function updateEServiceTemplateName({
  eServiceTemplateId,
  ...payload
}: { eServiceTemplateId: string } & EServiceTemplateNameUpdateSeed) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/name/update`,
    payload
  )

  return
}

async function updateEServiceTemplateIntendedTarget({
  eServiceTemplateId,
  ...payload
}: {
  eServiceTemplateId: string
  intendedTarget: string
}) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/intendedTarget/update`,
    payload
  )
}

async function updateEServiceTemplateDescription({
  eServiceTemplateId,
  ...payload
}: { eServiceTemplateId: string } & EServiceTemplateDescriptionUpdateSeed) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/description/update`,
    payload
  )
}

async function updateEServiceTemplateQuotas({
  eServiceTemplateId,
  eServiceTemplateVersionId,
  ...payload
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
} & EServiceTemplateVersionQuotasUpdateSeed) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/quotas/update`,
    payload
  )

  return
}

async function postVersionDraftDocument({
  eServiceTemplateId,
  eServiceTemplateVersionId,
  ...payload
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
} & CreateEServiceTemplateDocumentPayload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, data]) => formData.append(key, data))

  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/documents`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return response.data
  return
}

async function deleteVersionDraftDocument({
  eServiceTemplateId,
  eServiceTemplateVersionId,
  documentId,
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
  documentId: string
}) {
  return await axiosInstance.delete<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/documents/${documentId}`
  )

  return
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
} & UpdateEServiceTemplateVersionDocumentSeed) {
  const response = await axiosInstance.post<EServiceDoc>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/documents/${documentId}/update`,
    payload
  )
  return response.data
  return
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
  const response = await axiosInstance.get<File>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/documents/${documentId}`,
    { responseType: 'arraybuffer' }
  )
  return response.data
}

async function getProducersTemplateEserviceList(params: GetEServiceTemplateCreatorsParams) {
  const response = await axiosInstance.get<CompactOrganizations>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/filter/creators`,
    { params }
  )

  // const mockResponse = {
  //   pagination: {
  //     offset: 0,
  //     limit: 6,
  //     totalCount: 1,
  //   },
  //   results: [
  //     {
  //       creator: {
  //         kind: 'PA',
  //         name: 'name',
  //         id: '046b6c7f-0b8a-43b9-b35d-6489e6daee91',
  //         contactMail: {
  //           address: 'address',
  //           description: 'description',
  //         },
  //       },
  //       publishedVersion: {
  //         id: '046b6c7f-0b8a-43b9-b35d-6489e6daee91',
  //         version: 5,
  //       },
  //       name: 'name',
  //       description: 'description',
  //       id: '046b6c7f-0b8a-43b9-b35d-6489e6daee91',
  //     },
  //     {
  //       creator: {
  //         kind: 'PA',
  //         name: 'name',
  //         id: '046b6c7f-0b8a-43b9-b35d-6489e6daee91',
  //         contactMail: {
  //           address: 'address',
  //           description: 'description',
  //         },
  //       },
  //       publishedVersion: {
  //         id: '046b6c7f-0b8a-43b9-b35d-6489e6daee91',
  //         version: 5,
  //       },
  //       name: 'name',
  //       description: 'description',
  //       id: '046b6c7f-0b8a-43b9-b35d-6489e6daee91',
  //     },
  //   ],
  // }
  return response.data
}

// TODO: To be filled
async function downloadConsumerList({ eServiceTemplateId }: { eServiceTemplateId: string }) {
  const response = await axiosInstance.get<File>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/instances`,
    { responseType: 'arraybuffer' }
  )
  return response.data
}

async function createDraft(payload: EServiceTemplateSeed) {
  const response = await axiosInstance.post<CreatedEServiceTemplateVersion>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates`,
    payload
  )
  return response.data
}

//TODO: is still in review
async function createNewVersionDraft(eServiceTemplateId: string) {
  // const response = await axiosInstance.post<CreatedResource>(
  //   `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions`,
  //   payload
  // )
  // return response.data
  return
}

async function updateDraft({
  eServiceTemplateId,
  ...payload
}: {
  eServiceTemplateId: string
} & UpdateEServiceTemplateSeed) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}`,
    payload
  )

  return
}

async function updateVersionDraft({
  eServiceTemplateId,
  eServiceTemplateVersionId,
  ...payload
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
} & UpdateEServiceTemplateVersionSeed) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}`,
    payload
  )
}

async function addTemplateRiskAnalysis({
  eServiceTemplateId,
  ...payload
}: {
  eServiceTemplateId: string
} & EServiceTemplateRiskAnalysisSeed) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/riskAnalysis`,
    payload
  )
}

async function updateTemplateRiskAnalysis({
  eServiceTemplateId,
  riskAnalysisId,
  ...payload
}: {
  eServiceTemplateId: string
  riskAnalysisId: string
} & EServiceTemplateRiskAnalysisSeed) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/riskAnalysis/${riskAnalysisId}`,
    payload
  )
}

async function deleteTemplateRiskAnalysis({
  eServiceTemplateId,
  riskAnalysisId,
}: {
  eServiceTemplateId: string
  riskAnalysisId: string
}) {
  return await axiosInstance.delete<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/riskAnalysis/${riskAnalysisId} `
  )
  return
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
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/attributes/update`,
    payload
  )
}

async function publishVersionDraft({
  eServiceTemplateId,
  eServiceTemplateVersionId,
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
}) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/publish`
  )
  return
}

async function deleteVersionDraft({
  eServiceTemplateId,
  eServiceTemplateVersionId,
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
}) {
  return await axiosInstance.delete<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}`
  )
  return
}

async function suspendVersion({
  eServiceTemplateId,
  eServiceTemplateVersionId,
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
}) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/suspend`
  )
  return
}

async function reactivateVersion({
  eServiceTemplateId,
  eServiceTemplateVersionId,
}: {
  eServiceTemplateId: string
  eServiceTemplateVersionId: string
}) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions/${eServiceTemplateVersionId}/activate`
  )
  return
}
// TODO: To fix
async function getProviderTemplateInstancesList({
  eServiceTemplateId,
  ...params
}: GetEServiceTemplateInstancesParams & { eServiceTemplateId: string }) {
  const response = await axiosInstance.get<EServiceTemplateInstances>(
    `${BACKEND_FOR_FRONTEND_URL}/templates/${eServiceTemplateId}/eservices`,
    { params }
  )
  return response.data
}

async function createInstanceFromEServiceTemplate({
  eServiceTemplateId,
  ...payload
}: {
  eServiceTemplateId: string
} & InstanceEServiceSeed) {
  const response = await axiosInstance.post<CreatedEServiceDescriptor>(
    `${BACKEND_FOR_FRONTEND_URL}/templates/${eServiceTemplateId}/eservices`,
    payload
  )
  return response.data
}

async function updateInstanceFromEServiceTemplate({
  eServiceId,
  ...payload
}: UpdateEServiceTemplateInstanceSeed & { eServiceId: string }) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/templates/eservices/${eServiceId}`,
    payload
  )
  return response.data
}

async function getProviderTemplatesCatalogList(params: GetEServiceTemplatesCatalogParams) {
  const response = await axiosInstance.get<CatalogEServiceTemplates>(
    `${BACKEND_FOR_FRONTEND_URL}/catalog/eservices/templates`,
    { params }
  )

  return response.data
}

async function getSingleByEServiceTemplateId(eserviceTemplateId: string) {
  const response = await axiosInstance.get<EServiceTemplateDetails>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eserviceTemplateId}`
  )
  // return response;
  // const response: EServiceTemplateDetails = {
  //   id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //   creator: {
  //     id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //     name: 'Template di prova',
  //     kind: 'PA',
  //     contactMail: {
  //       address: 'string',
  //       description: 'string',
  //     },
  //   },
  //   name: 'Template di prova',
  //   audienceDescription: 'string',
  //   eserviceDescription: 'questa è una descrizione di prova',
  //   technology: 'REST',
  //   versions: [
  //     {
  //       id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //       version: 0,
  //       state: 'PUBLISHED',
  //     },
  //   ],
  //   riskAnalysis: [
  //     {
  //       id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //       name: 'string',
  //       riskAnalysisForm: {
  //         version: 'string',
  //         answers: {},
  //         riskAnalysisId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //       },
  //       createdAt: '2025-02-25T11:38:40.778Z',
  //     },
  //   ],
  //   mode: 'DELIVER',
  //   isSignalHubEnabled: true,
  // }
  return response.data
}

export const TemplateServices = {
  getProviderTemplatesList,
  getSingle,
  updateEServiceTemplateName,
  updateEServiceTemplateIntendedTarget,
  updateEServiceTemplateDescription,
  updateEServiceTemplateQuotas,
  postVersionDraftDocument,
  deleteVersionDraftDocument,
  updateVersionDraftDocumentDescription,
  downloadVersionDraftDocument,
  downloadConsumerList,
  createDraft,
  createNewVersionDraft,
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
  createInstanceFromEServiceTemplate,
  getSingleByEServiceTemplateId,
  getProviderTemplatesCatalogList,
  getProducersTemplateEserviceList,
  updateInstanceFromEServiceTemplate,
}
