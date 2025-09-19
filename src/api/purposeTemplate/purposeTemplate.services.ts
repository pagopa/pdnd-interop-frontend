import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type {
  GetConsumerPurposeTemplatesParams,
  PurposeTemplateUpdateContent,
  RiskAnalysisFormTemplateSeed,
} from './mockedResponses'
import {
  eservicesLinkedToPurposeTemplatesMock,
  purposeTemplateEservicesMock,
  purposeTemplateMock,
  purposeTemplatesListMock,
} from './mockedResponses'
import {
  LinkEServiceToPurposeTemplatePayload,
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

async function getConsumerCatalogPurposeTemplates() {
  //   const response = await axiosInstance.get<ConsumerPurposeTemplates>(
  //     `${BACKEND_FOR_FRONTEND_URL}/creators/purposeTemplates/catalog`
  //   )
  //   return response.data
  return purposeTemplatesListMock
}

async function getEservicesLinkedToPurposeTemplatesList() {
  //   const response = await axiosInstance.get<ProducerPurposeTemplates>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/eservices`,
  //     { params }
  //   )
  //   return response.data
  return eservicesLinkedToPurposeTemplatesMock
}

async function getPurposeTemplateEservices(id: string) {
  //   const response = await axiosInstance.get<ConsumerPurposeTemplates>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/eservices`,
  //     { params }
  //   )
  //   return response.data
  return purposeTemplateEservicesMock
}

async function getSingle(id: string) {
  //   const response = await axiosInstance.get<PurposeTemplate>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}`
  //   )
  //   return response.data
  return purposeTemplateMock
}

async function getAnswerDocuments(purposeTemplateId: string, answerId: string) {
  //   const response = await axiosInstance.get<Document[]>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/documents`
  //   )
  //   return response.data
  return []
}

async function updatePurposeTemplateRiskAnalysis({
  id,
  ...payload
}: { id: string } & RiskAnalysisFormTemplateSeed) {
  //   return await axiosInstance.post<void>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/riskAnalysis`,
  //     payload
  //   )
  return console.log('risk analysis updated!')
}

async function createDraft(payload: PurposeTemplatePayload) {
  //   const response = await axiosInstance.post<CreatedPurposeTemplate>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates`,
  //     payload
  //   )
  //   return response.data
  return console.log('Draft created')
}

async function updateDraft({
  purposeTemplateId,
  ...payload
}: {
  purposeTemplateId: string
} & PurposeTemplateUpdateContent) {
  //   return await axiosInstance.post<void>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}`,
  //     payload
  //   )
  return console.log('Draft updated!')
}

async function addEserviceToPurposeTemplate({
  purposeTemplateId,
  ...payload
}: { purposeTemplateId: string } & LinkEServiceToPurposeTemplatePayload) {
  //TODO TO FIX PARAMETERS
  //   const response = await axiosInstance.post<LinkEServiceToPurposeTemplatePayload>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/linkEservice`,
  //      payload
  //   )
  //   return response.data
  return console.log('Added eservice')
}

async function removeEserviceToPurposeTemplate({
  purposeTemplateId,
  ...payload
}: { purposeTemplateId: string } & UnlinkEServiceToPurposeTemplatePayload) {
  //TODO TO FIX PARAMETERS
  //   const response = await axiosInstance.post<CreatedPurposeTemplate>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/unlinkEservice`,
  //      payload
  //   )
  //   return response.data
  return console.log('removed eservice')
}

async function addAnnotationToAnswer({
  purposeTemplateId,
  answerId,
}: {
  purposeTemplateId: string
  answerId: string
}) {
  //   const response = await axiosInstance.patch<void>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/annotation`,
  //   )
  //   return response.data
  return console.log('Added annotation to answer')
}

async function addDocumentsToAnswer({
  purposeTemplateId,
  answerId,
}: {
  purposeTemplateId: string
  answerId: string
}) {
  //   const response = await axiosInstance.posth<void>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${purposeTemplateId}/riskAnalysis/answers/${answerId}/annotation/documents`,
  //   )
  //   return response.data
  return console.log('Added documents to answer')
}

async function publishDraft({ id }: { id: string }) {
  //return await axiosInstance.post<void>(`${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/publish`)
  return console.log('Draft published')
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
  getPurposeTemplateEservices,
  getSingle,
  getAnswerDocuments,
  updatePurposeTemplateRiskAnalysis,
  updateDraft,
  addEserviceToPurposeTemplate,
  removeEserviceToPurposeTemplate,
  addAnnotationToAnswer,
  addDocumentsToAnswer,
  createDraft,
  publishDraft,
  deleteDraft,
  deleteAnnotation,
  deleteDocument,
  suspendPurposeTemplate,
  reactivatePurposeTemplate,
  archivePurposeTemplate,
}
