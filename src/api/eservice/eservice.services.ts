import axiosInstance from '@/lib/axios'
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
} from './eservice.api.types'
import {
  EServiceCatalog,
  EServiceDescriptorCatalog,
  EServiceDescriptorProvider,
  EServiceDescriptorRead,
  EServiceProvider,
  EServiceRead,
  EServiceReadType,
} from '@/types/eservice.types'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { downloadFile } from '@/utils/common.utils'
import { DocumentRead } from '@/types/common.types'
import { Paginated } from '../comon.api.types'

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
    `${BACKEND_FOR_FRONTEND_URL}/producer/eservices`,
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

async function createDraft(
  payload: {
    producerId: string
  } & EServiceDraftPayload
) {
  const response = await axiosInstance.post<EServiceReadType>(
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
  const response = await axiosInstance.post<EServiceDescriptorRead>(
    `${CATALOG_PROCESS_URL}/eservices/${eserviceId}/descriptors`,
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
  const response = await axiosInstance.put<EServiceDescriptorRead>(
    `${CATALOG_PROCESS_URL}/eservices/${eserviceId}/descriptors/${descriptorId}`,
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
    `${CATALOG_PROCESS_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/publish`
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
    `${CATALOG_PROCESS_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/suspend`
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
    `${CATALOG_PROCESS_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/activate`
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

  const response = await axiosInstance.post<EServiceReadType>(
    `${CATALOG_PROCESS_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents`,
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
    `${CATALOG_PROCESS_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents/${documentId}`
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
    `${CATALOG_PROCESS_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents/${documentId}/update`,
    payload
  )
  return response.data
}

async function downloadVersionDraftDocument({
  eserviceId,
  descriptorId,
  document,
}: {
  eserviceId: string
  descriptorId: string
  document: DocumentRead
}) {
  const response = await axiosInstance.get(
    `${CATALOG_PROCESS_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents/${document.id}`,
    { responseType: 'arraybuffer' }
  )
  const filename = getDownloadDocumentName(document)
  downloadFile(response.data, filename)
}

const EServiceServices = {
  getListFlat,
  getCatalogList,
  getProviderList,
  getSingle,
  getDescriptorCatalog,
  getDescriptorProvider,
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
