import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type {
  GetConsumerPurposeTemplatesParams,
  PurposeTemplateSeed,
  RiskAnalysisFormTemplateSeed,
  UpdateEServiceDescriptorPurposeTemplateSeed,
} from './mockedResponses'
import {
  eservicesLinkedToPurposeTemplatesMock,
  purposeTemplateEservicesMock,
  purposeTemplateMock,
  purposeTemplatesListMock,
} from './mockedResponses'

async function getConsumerPurposeTemplatesList(params: GetConsumerPurposeTemplatesParams) {
  //   const response = await axiosInstance.get<ProducerPurposeTemplates>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates`,
  //     { params }
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
  //   const response = await axiosInstance.get<ProducerPurposeTemplates>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/{id}/eservices`,
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

async function createDraft(payload: PurposeTemplateSeed) {
  //   const response = await axiosInstance.post<CreatedPurposeTemplate>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates`,
  //     payload
  //   )
  //   return response.data
  return console.log('Draft created')
}

async function updateDraft({
  id,
  ...payload
}: {
  id: string
} & UpdateEServiceDescriptorPurposeTemplateSeed) {
  //   return await axiosInstance.post<void>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}`,
  //     payload
  //   )
  return console.log('Draft updated!')
}

async function addEserviceToPurposeTemplate({
  id,
  ...payload
}: { id: string } & UpdateEServiceDescriptorPurposeTemplateSeed) {
  //TODO TO FIX PARAMETERS
  //   const response = await axiosInstance.post<CreatedPurposeTemplate>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/eservices`,
  //     payload
  //   )
  //   return response.data
  return console.log('Added eservice')
}

async function removeEserviceToPurposeTemplate({
  id,
  ...payload
}: { id: string } & UpdateEServiceDescriptorPurposeTemplateSeed) {
  //TODO TO FIX PARAMETERS
  //   const response = await axiosInstance.post<CreatedPurposeTemplate>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}/eservices`,
  //     payload
  //   )
  //   return response.data
  return console.log('removed eservice')
}

async function publishDraft({ id }: { id: string }) {
  //return await axiosInstance.post<void>(`${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/{id}/publish`)
  return console.log('Draft published')
}

async function deleteDraft({ id }: { id: string }) {
  //   return await axiosInstance.delete<void>(
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${id}
  // `
  //   )
  return console.log('Draft deleted')
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
  //     `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/{id}/archive`
  //   )
  return console.log('Archived!')
}

export const PurposeTemplateServices = {
  getConsumerPurposeTemplatesList,
  getEservicesLinkedToPurposeTemplatesList,
  getPurposeTemplateEservices,
  getSingle,
  updatePurposeTemplateRiskAnalysis,
  updateDraft,
  addEserviceToPurposeTemplate,
  removeEserviceToPurposeTemplate,
  createDraft,
  publishDraft,
  deleteDraft,
  suspendPurposeTemplate,
  reactivatePurposeTemplate,
  archivePurposeTemplate,
}
