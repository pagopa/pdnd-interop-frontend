import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type {
  CatalogPurposeTemplates,
  CreatedResource,
  CreatorPurposeTemplates,
  EServiceDescriptorPurposeTemplate,
  EServiceDescriptorsPurposeTemplate,
  GetCatalogPurposeTemplatesParams,
  GetPurposeTemplateEServicesParams,
  LinkEServiceToPurposeTemplatePayload,
  PurposeTemplate,
  PurposeTemplateSeed,
  PurposeTemplateWithCompactCreator,
  RiskAnalysisTemplateAnswerAnnotation,
  RiskAnalysisTemplateAnswerAnnotationSeed,
  RiskAnalysisTemplateAnswerRequest,
  RiskAnalysisTemplateAnswerResponse,
  AddRiskAnalysisTemplateAnswerAnnotationDocumentPayload,
  RiskAnalysisTemplateAnswerAnnotationDocument,
  UnlinkEServiceToPurposeTemplatePayload,
  GetCreatorPurposeTemplatesParams,
  UpdateRiskAnalysisTemplateAnswerAnnotationDocumentSeed,
  CompactOrganizations,
} from '../api.generatedTypes'

async function getConsumerPurposeTemplatesList(params: GetCreatorPurposeTemplatesParams) {
  const response = await axiosInstance.get<CreatorPurposeTemplates>(
    `${BACKEND_FOR_FRONTEND_URL}/creators/purposeTemplates`,
    { params }
  )
  return response.data
}

async function getEservicesLinkedToPurposeTemplatesList(
  purposeTemplateId: string,
  params: Omit<GetPurposeTemplateEServicesParams, 'purposeTemplateId'>
) {
  const response = await axiosInstance.get<EServiceDescriptorsPurposeTemplate>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/eservices`,
    { params }
  )
  return response.data
}

async function getSingle(purposeTemplateId: string) {
  const response = await axiosInstance.get<PurposeTemplateWithCompactCreator>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}`
  )
  return response.data
}

async function getAnswerDocuments(purposeTemplateId: string, answerId: string) {
  const response = await axiosInstance.get<Document[]>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/documents`
  )
  return response.data
}

async function getRiskAnalysisTemplateAnswerAnnotationDocument({
  purposeTemplateId,
  answerId,
  documentId,
}: {
  purposeTemplateId: string
  answerId: string
  documentId: string
}) {
  const response = await axiosInstance.get<File>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/annotation/documents/${documentId}`,
    {
      responseType: 'blob',
    }
  )
  return response.data
}

async function getCatalogPurposeTemplates(params: GetCatalogPurposeTemplatesParams) {
  const response = await axiosInstance.get<CatalogPurposeTemplates>(
    `${BACKEND_FOR_FRONTEND_URL}/catalog/purposeTemplates`,
    { params }
  )
  return response.data
}

async function createDraft(payload: PurposeTemplateSeed) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates`,
    payload
  )
  return response.data
}

async function updateDraft({
  purposeTemplateId,
  ...payload
}: {
  purposeTemplateId: string
} & PurposeTemplateSeed) {
  return await axiosInstance.put<PurposeTemplate>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}`,
    payload
  )
}

async function linkEserviceToPurposeTemplate({
  purposeTemplateId,
  ...payload
}: { purposeTemplateId: string } & LinkEServiceToPurposeTemplatePayload) {
  const response = await axiosInstance.post<EServiceDescriptorPurposeTemplate>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/linkEservice`,
    payload
  )
  return response.data
}

async function unlinkEserviceFromPurposeTemplate({
  purposeTemplateId,
  ...payload
}: { purposeTemplateId: string } & UnlinkEServiceToPurposeTemplatePayload) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/unlinkEservice`,
    payload
  )
}

async function addRiskAnalysisAnswer({
  purposeTemplateId,
  answerRequest,
}: {
  purposeTemplateId: string
  answerRequest: RiskAnalysisTemplateAnswerRequest
}) {
  const response = await axiosInstance.post<RiskAnalysisTemplateAnswerResponse>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers`,
    answerRequest
  )
  return response.data
}

async function updateRiskAnalysisAnswerAnnotation({
  purposeTemplateId,
  answerId,
  annotationText,
}: {
  purposeTemplateId: string
  answerId: string
  annotationText: RiskAnalysisTemplateAnswerAnnotationSeed
}) {
  const response = await axiosInstance.put<RiskAnalysisTemplateAnswerAnnotation>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/annotation`,
    annotationText
  )
  return response.data
}

async function deleteRiskAnalysisAnswerAnnotation({
  purposeTemplateId,
  answerId,
}: {
  purposeTemplateId: string
  answerId: string
}) {
  await axiosInstance.delete<void>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/annotation`
  )
}

async function addDocumentToAnnotation({
  purposeTemplateId,
  answerId,
  documentPayload,
}: {
  purposeTemplateId: string
  answerId: string
  documentPayload: AddRiskAnalysisTemplateAnswerAnnotationDocumentPayload
}) {
  const formData = new FormData()
  formData.append('prettyName', documentPayload.prettyName)
  formData.append('doc', documentPayload.doc)

  const response = await axiosInstance.post<RiskAnalysisTemplateAnswerAnnotationDocument>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/annotation/documents`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

async function publishDraft({ id }: { id: string }) {
  const response = await axiosInstance.post<PurposeTemplate>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/publish`
  )
  return response.data
}

async function deleteDraft({ id }: { id: string }) {
  return await axiosInstance.delete<void>(`${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}`)
}

async function deleteAnnotation({
  purposeTemplateId,
  answerId,
}: {
  purposeTemplateId: string
  answerId: string
}) {
  return await axiosInstance.delete<void>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/annotation`
  )
}

async function deleteDocumentFromAnnotation({
  purposeTemplateId,
  answerId,
  documentId,
}: {
  purposeTemplateId: string
  answerId: string
  documentId: string
}) {
  await axiosInstance.delete<void>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/annotation/documents/${documentId}`
  )
}

async function downloadDocumentFromAnnotation({
  purposeTemplateId,
  answerId,
  documentId,
}: {
  purposeTemplateId: string
  answerId: string
  documentId: string
}) {
  const response = await axiosInstance.get<File>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/annotation/documents/${documentId}`,
    {
      responseType: 'arraybuffer',
    }
  )
  return response.data
}

async function suspendPurposeTemplate({ id }: { id: string }) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/suspend`
  )
}

async function reactivatePurposeTemplate({ id }: { id: string }) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/unsuspend`
  )
}

async function archivePurposeTemplate({ id }: { id: string }) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/archive`
  )
}

async function getPublishedPurposeTemplateCreators(params: {
  q?: string
  offset: number
  limit: number
}) {
  return await axiosInstance.get<CompactOrganizations>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/filter/creators`,
    { params }
  )
}

async function updatePrettyNameAnnotationAssociatedDocument({
  purposeTemplateId,
  answerId,
  documentId,
  ...payload
}: {
  purposeTemplateId: string
  answerId: string
  documentId: string
} & UpdateRiskAnalysisTemplateAnswerAnnotationDocumentSeed) {
  const response = await axiosInstance.post<RiskAnalysisTemplateAnswerAnnotationDocument>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/annotation/documents/${documentId}/update`,
    payload
  )

  return response.data
}

export const PurposeTemplateServices = {
  getConsumerPurposeTemplatesList,
  getEservicesLinkedToPurposeTemplatesList,
  getSingle,
  getAnswerDocuments,
  updateDraft,
  linkEserviceToPurposeTemplate,
  unlinkEserviceFromPurposeTemplate,
  addRiskAnalysisAnswer,
  updateRiskAnalysisAnswerAnnotation,
  deleteRiskAnalysisAnswerAnnotation,
  addDocumentToAnnotation,
  createDraft,
  publishDraft,
  deleteDraft,
  deleteAnnotation,
  getRiskAnalysisTemplateAnswerAnnotationDocument,
  deleteDocumentFromAnnotation,
  downloadDocumentFromAnnotation,
  suspendPurposeTemplate,
  reactivatePurposeTemplate,
  archivePurposeTemplate,
  getCatalogPurposeTemplates,
  updatePrettyNameAnnotationAssociatedDocument,
  getPublishedPurposeTemplateCreators,
}
