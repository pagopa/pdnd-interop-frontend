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
  // EServiceTemplateRiskAnalysisSeed,
  CreatedResource,
  EServiceDoc,
  CompactOrganizations,
  UpdateEServiceTemplateInstanceSeed,
  EServiceTemplateRiskAnalysisSeed,
} from '../api.generatedTypes'
import type { AttributeKey } from '@/types/attribute.types'

async function getProviderEServiceTemplatesList(params: GetProducerEServicesParams) {
  const response = await axiosInstance.get<ProducerEServiceTemplates>(
    `${BACKEND_FOR_FRONTEND_URL}/creators/eservices/templates`,
    { params }
  )
  return response.data
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

async function getProducersEServiceTemplateList(params: GetEServiceTemplateCreatorsParams) {
  const response = await axiosInstance.get<CompactOrganizations>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/filter/creators`,
    { params }
  )
  return response.data
}

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

async function createNewVersionDraft(eServiceTemplateId: string) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/versions`
  )
  return response.data
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

async function addEServiceTemplateRiskAnalysis({
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

async function updateEServiceTemplateRiskAnalysis({
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

async function deleteEServiceTemplateRiskAnalysis({
  eServiceTemplateId,
  riskAnalysisId,
}: {
  eServiceTemplateId: string
  riskAnalysisId: string
}) {
  return await axiosInstance.delete<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eServiceTemplateId}/riskAnalysis/${riskAnalysisId} `
  )
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
}

async function getProviderEServiceTemplateInstancesList({
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

async function getProviderEServiceTemplatesCatalogList(params: GetEServiceTemplatesCatalogParams) {
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
  return response.data
}

export const EServiceTemplateServices = {
  getProviderEServiceTemplatesList,
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
  addEServiceTemplateRiskAnalysis,
  updateEServiceTemplateRiskAnalysis,
  deleteEServiceTemplateRiskAnalysis,
  updateAttributes,
  publishVersionDraft,
  deleteVersionDraft,
  suspendVersion,
  reactivateVersion,
  getProviderEServiceTemplateInstancesList,
  createInstanceFromEServiceTemplate,
  getSingleByEServiceTemplateId,
  getProviderEServiceTemplatesCatalogList,
  getProducersEServiceTemplateList,
  updateInstanceFromEServiceTemplate,
}
