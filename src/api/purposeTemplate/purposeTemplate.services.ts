import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type { GetConsumerPurposeTemplatesParams } from './mockedResponses'
import { mockCatalogPurposeTemplates, purposeTemplatesListMock } from './mockedResponses'
import type {
  CatalogPurposeTemplates,
  CreatedResource,
  EServiceDescriptorsPurposeTemplate,
  GetCatalogPurposeTemplatesParams,
  GetPurposeTemplateEServicesParams,
  LinkEServiceToPurposeTemplatePayload,
  PurposeTemplate,
  PurposeTemplateSeed,
  PurposeTemplateWithCompactCreator,
  UnlinkEServiceToPurposeTemplatePayload,
} from '../api.generatedTypes'

async function getConsumerPurposeTemplatesList(params: GetConsumerPurposeTemplatesParams) {
  //   const response = await axiosInstance.get<ConsumerPurposeTemplates>(
  //     `${BACKEND_FOR_FRONTEND_URL}/creators/purposeTemplates`,
  //     { params }
  //   )
  //   return response.data
  return purposeTemplatesListMock
}

async function getConsumerCatalogPurposeTemplates(params: GetCatalogPurposeTemplatesParams) {
  //   const response = await axiosInstance.get<CatalogPurposeTemplates>(
  //     `${BACKEND_FOR_FRONTEND_URL}/catalog/purposeTemplates`
  //      {params}
  //   )
  //   return response.data
  return mockCatalogPurposeTemplates
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
  //   const response = await axiosInstance.get<Document[]>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/documents`
  //   )
  //   return response.data
  return []
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
  const response = await axiosInstance.post<LinkEServiceToPurposeTemplatePayload>(
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

async function addAnnotationToAnswer({
  purposeTemplateId,
  answerId,
}: {
  purposeTemplateId: string
  answerId: string
}) {
  //   const response = await axiosInstance.put<RiskAnalysisAnswerAnnotationText>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/annotation`,
  //   )
  //   return response.data
  return console.log('Added annotation to answer')
}

async function addDocumentsToAnnotation({
  purposeTemplateId,
  answerId,
}: {
  purposeTemplateId: string
  answerId: string
}) {
  //   const response = await axiosInstance.post<void>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/annotation/documents`,
  //   )
  //   return response.data
  return console.log('Added documents to annotation')
}

async function publishDraft({ id }: { id: string }) {
  const response = await axiosInstance.post<PurposeTemplate>(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/publish`
  )
  return response.data
}

async function deleteDraft({ id }: { id: string }) {
  //   return await axiosInstance.delete<void>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}
  // `
  //   )
  return console.log('Draft deleted')
}

async function deleteAnnotation({
  purposeTemplateId,
  answerId,
}: {
  purposeTemplateId: string
  answerId: string
}) {
  //   return await axiosInstance.delete<void>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/riskAnalysis/answers/${answerId}/annotation`
  //   )
  return console.log('Annotation deleted')
}

async function deleteDocument({
  purposeTemplateId,
  answerId,
  documentId,
}: {
  purposeTemplateId: string
  answerId: string
  documentId: string
}) {
  //   return await axiosInstance.delete<void>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/riskAnalysis/answers/${answerId}/annotation/documents/${documentId}`
  //   )
  return console.log('Document deleted')
}

async function suspendPurposeTemplate({ id }: { id: string }) {
  //   return await axiosInstance.post<void>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/suspend`
  //   )
  return console.log('Suspended')
}

async function reactivatePurposeTemplate({ id }: { id: string }) {
  //   return await axiosInstance.post<void>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/unsuspend`
  //   )
  return console.log('Reactivate')
}

async function archivePurposeTemplate({ id }: { id: string }) {
  //   return await axiosInstance.post<void>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/archive`
  //   )
  return console.log('Archived!')
}

export const PurposeTemplateServices = {
  getConsumerPurposeTemplatesList,
  getConsumerCatalogPurposeTemplates,
  getEservicesLinkedToPurposeTemplatesList,
  getSingle,
  getAnswerDocuments,
  updateDraft,
  linkEserviceToPurposeTemplate,
  unlinkEserviceFromPurposeTemplate,
  addAnnotationToAnswer,
  addDocumentsToAnnotation,
  createDraft,
  publishDraft,
  deleteDraft,
  deleteAnnotation,
  deleteDocument,
  suspendPurposeTemplate,
  reactivatePurposeTemplate,
  archivePurposeTemplate,
  getCatalogPurposeTemplates,
}
