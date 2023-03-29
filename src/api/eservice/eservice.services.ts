import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL, CATALOG_PROCESS_URL } from '@/config/env'
import type {
  EServiceGetListFlatResponse,
  EServiceGetListFlatUrlParams,
} from './eservice.api.types'
import type {
  CatalogEServiceDescriptor,
  CatalogEServices,
  CompactOrganizations,
  CreatedEServiceDescriptor,
  CreatedResource,
  CreateEServiceDocumentPayload,
  EServiceDescriptorSeed,
  EServiceDoc,
  EServiceSeed,
  GetConsumersParams,
  GetEServicesCatalogParams,
  GetProducerEServicesParams,
  GetProducersParams,
  ProducerEServiceDescriptor,
  ProducerEServiceDetails,
  ProducerEServices,
  UpdateEServiceDescriptorDocumentSeed,
  UpdateEServiceDescriptorSeed,
  UpdateEServiceSeed,
} from '../api.generatedTypes'

/** @deprecated TO BE REMOVED */
async function getListFlat(params: EServiceGetListFlatUrlParams) {
  const response = await axiosInstance.get<EServiceGetListFlatResponse>(
    `${CATALOG_PROCESS_URL}/flatten/eservices`,
    { params }
  )
  return response.data
}

async function getCatalogList(params: GetEServicesCatalogParams) {
  const response = await axiosInstance.get<CatalogEServices>(
    `${BACKEND_FOR_FRONTEND_URL}/catalog`,
    { params }
  )
  return response.data
}

async function getProviderList(params: GetProducerEServicesParams) {
  const response = await axiosInstance.get<ProducerEServices>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/eservices`,
    { params }
  )
  return response.data
}

async function getSingle(eserviceId: string) {
  const response = await axiosInstance.get<ProducerEServiceDetails>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/eservices/${eserviceId}`
  )
  return response.data
}

async function getDescriptorCatalog(eserviceId: string, descriptorId: string) {
  const response = await axiosInstance.get<CatalogEServiceDescriptor>(
    `${BACKEND_FOR_FRONTEND_URL}/catalog/eservices/${eserviceId}/descriptor/${descriptorId}`
  )
  return response.data
}

async function getDescriptorProvider(eserviceId: string, descriptorId: string) {
  const response = await axiosInstance.get<ProducerEServiceDescriptor>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/eservices/${eserviceId}/descriptors/${descriptorId}`
  )
  return response.data
}

async function getConsumers(params: GetConsumersParams) {
  const response = await axiosInstance.get<CompactOrganizations>(
    `${BACKEND_FOR_FRONTEND_URL}/consumers`,
    { params }
  )
  return response.data
}

async function getProducers(params: GetProducersParams) {
  const response = await axiosInstance.get<CompactOrganizations>(
    `${BACKEND_FOR_FRONTEND_URL}/producers`,
    { params }
  )
  return response.data
}

async function createDraft(payload: EServiceSeed) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices`,
    payload
  )
  return response.data
}

async function updateDraft({
  eserviceId,
  ...payload
}: {
  eserviceId: string
} & UpdateEServiceSeed) {
  const response = await axiosInstance.put<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}`,
    payload
  )
  return response.data
}

function deleteDraft({ eserviceId }: { eserviceId: string }) {
  return axiosInstance.delete(`${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}`)
}

async function cloneFromVersion({
  eserviceId,
  descriptorId,
}: {
  eserviceId: string
  descriptorId: string
}) {
  const response = await axiosInstance.post<CreatedEServiceDescriptor>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/clone`
  )
  return response.data
}

async function createVersionDraft({
  eserviceId,
  ...payload
}: {
  eserviceId: string
} & EServiceDescriptorSeed) {
  const response = await axiosInstance.post<CreatedResource>(
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
} & UpdateEServiceDescriptorSeed) {
  const response = await axiosInstance.put<CreatedResource>(
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
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}`
  )
}

async function postVersionDraftDocument({
  eserviceId,
  descriptorId,
  ...payload
}: {
  eserviceId: string
  descriptorId: string
} & CreateEServiceDocumentPayload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, data]) => formData.append(key, data))

  const response = await axiosInstance.post<CreatedResource>(
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
} & UpdateEServiceDescriptorDocumentSeed) {
  const response = await axiosInstance.post<EServiceDoc>(
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
  const response = await axiosInstance.get<File>(
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
