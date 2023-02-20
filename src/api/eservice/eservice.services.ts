import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL, CATALOG_PROCESS_URL } from '@/config/env'
import {
  EServiceGetListFlatResponse,
  EServiceGetListFlatUrlParams,
  EServiceDraftPayload,
  EServiceVersionDraftPayload,
  PostEServiceVersionDraftDocumentPayload,
  UpdateEServiceVersionDraftDocumentPayload,
  EServiceGetCatalogListUrlParams,
  EServiceGetProviderListUrlParams,
  EServiceGetConsumersUrlParams,
  EServiceGetProducersUrlParams,
} from './eservice.api.types'
import {
  EServiceCatalog,
  EServiceConsumer,
  EServiceDescriptorCatalog,
  EServiceDescriptorProvider,
  EServiceProducer,
  EServiceProvider,
  EServiceRead,
  EServiceReadType,
} from '@/types/eservice.types'
import { DocumentRead } from '@/types/common.types'
import { Paginated } from '../react-query-wrappers/react-query-wrappers.types'

/** @deprecated TO BE REMOVED */
async function getListFlat(params: EServiceGetListFlatUrlParams) {
  const response = await axiosInstance.get<EServiceGetListFlatResponse>(
    `${CATALOG_PROCESS_URL}/flatten/eservices`,
    { params }
  )
  return response.data
}

async function getCatalogList(params: EServiceGetCatalogListUrlParams) {
  const response = await axiosInstance.get<Paginated<EServiceCatalog>>(
    `${BACKEND_FOR_FRONTEND_URL}/catalog`,
    { params }
  )
  return response.data
}

async function getProviderList(params: EServiceGetProviderListUrlParams) {
  const response = await axiosInstance.get<Paginated<EServiceProvider>>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/eservices`,
    { params }
  )
  return response.data
}

async function getSingle(eserviceId: string) {
  const response = await axiosInstance.get<EServiceRead>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/eservices/${eserviceId}`
  )
  return response.data
}

async function getDescriptorCatalog(eserviceId: string, descriptorId: string) {
  const response = await axiosInstance.get<EServiceDescriptorCatalog>(
    `${BACKEND_FOR_FRONTEND_URL}/catalog/eservices/${eserviceId}/descriptor/${descriptorId}`
  )
  return response.data
}

async function getDescriptorProvider(eserviceId: string, descriptorId: string) {
  const response = await axiosInstance.get<EServiceDescriptorProvider>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/eservices/${eserviceId}/descriptors/${descriptorId}`
  )
  return response.data
}

async function getConsumers(params: EServiceGetConsumersUrlParams) {
  const response = await axiosInstance.get<Paginated<EServiceConsumer>>(
    `${BACKEND_FOR_FRONTEND_URL}/consumers`,
    { params }
  )
  return response.data
}

async function getProducers(params: EServiceGetProducersUrlParams) {
  const response = await axiosInstance.get<Paginated<EServiceProducer>>(
    `${BACKEND_FOR_FRONTEND_URL}/producers`,
    { params }
  )
  return response.data
}

async function createDraft(payload: EServiceDraftPayload) {
  const response = await axiosInstance.post<{ id: string }>(
    `${CATALOG_PROCESS_URL}/eservices`,
    payload
  )
  return response.data
}

async function updateDraft({
  eserviceId,
  ...payload
}: {
  eserviceId: string
} & EServiceDraftPayload) {
  const response = await axiosInstance.put<EServiceReadType>(
    `${CATALOG_PROCESS_URL}/eservices/${eserviceId}`,
    payload
  )
  return response.data
}

function deleteDraft({ eserviceId }: { eserviceId: string }) {
  return axiosInstance.delete(`${CATALOG_PROCESS_URL}/eservices/${eserviceId}`)
}

async function cloneFromVersion({
  eserviceId,
  descriptorId,
}: {
  eserviceId: string
  descriptorId: string
}) {
  const response = await axiosInstance.post<EServiceReadType>(
    `${CATALOG_PROCESS_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/clone`
  )
  return response.data
}

async function createVersionDraft({
  eserviceId,
  ...payload
}: {
  eserviceId: string
} & EServiceVersionDraftPayload) {
  const response = await axiosInstance.post<{ id: string }>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors`,
    payload
  )
  return response.data
}

async function updateVersionDraft({
  eserviceId,
  descriptorId,
  ...payload
}: {
  eserviceId: string
  descriptorId: string
} & EServiceVersionDraftPayload) {
  const response = await axiosInstance.put<{ id: string }>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}`,
    payload
  )
  return response.data
}

function publishVersionDraft({
  eserviceId,
  descriptorId,
}: {
  eserviceId: string
  descriptorId: string
}) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/publish`
  )
}

function suspendVersion({
  eserviceId,
  descriptorId,
}: {
  eserviceId: string
  descriptorId: string
}) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/suspend`
  )
}

function reactivateVersion({
  eserviceId,
  descriptorId,
}: {
  eserviceId: string
  descriptorId: string
}) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/activate`
  )
}

function deleteVersionDraft({
  eserviceId,
  descriptorId,
}: {
  eserviceId: string
  descriptorId: string
}) {
  return axiosInstance.delete(
    `${CATALOG_PROCESS_URL}/eservices/${eserviceId}/descriptors/${descriptorId}`
  )
}

async function postVersionDraftDocument({
  eserviceId,
  descriptorId,
  ...payload
}: {
  eserviceId: string
  descriptorId: string
} & PostEServiceVersionDraftDocumentPayload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, data]) => formData.append(key, data))

  const response = await axiosInstance.post<{ id: string }>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return response.data
}

function deleteVersionDraftDocument({
  eserviceId,
  descriptorId,
  documentId,
}: {
  eserviceId: string
  descriptorId: string
  documentId: string
}) {
  return axiosInstance.delete(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents/${documentId}`
  )
}

async function updateVersionDraftDocumentDescription({
  eserviceId,
  descriptorId,
  documentId,
  ...payload
}: {
  eserviceId: string
  descriptorId: string
  documentId: string
} & UpdateEServiceVersionDraftDocumentPayload) {
  const response = await axiosInstance.post<DocumentRead>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents/${documentId}/update`,
    payload
  )
  return response.data
}

async function downloadVersionDraftDocument({
  eserviceId,
  descriptorId,
  documentId,
}: {
  eserviceId: string
  descriptorId: string
  documentId: string
}) {
  const response = await axiosInstance.get(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents/${documentId}`,
    { responseType: 'arraybuffer' }
  )
  return response.data
}

const EServiceServices = {
  getListFlat,
  getCatalogList,
  getProviderList,
  getSingle,
  getDescriptorCatalog,
  getDescriptorProvider,
  getConsumers,
  getProducers,
  createDraft,
  updateDraft,
  deleteDraft,
  cloneFromVersion,
  createVersionDraft,
  updateVersionDraft,
  publishVersionDraft,
  suspendVersion,
  reactivateVersion,
  deleteVersionDraft,
  postVersionDraftDocument,
  deleteVersionDraftDocument,
  updateVersionDraftDocumentDescription,
  downloadVersionDraftDocument,
}

export default EServiceServices
