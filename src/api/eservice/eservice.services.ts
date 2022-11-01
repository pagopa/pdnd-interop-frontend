import axiosInstance from '@/lib/axios'
import { CATALOG_PROCESS_URL } from '@/config/env'
import {
  EServiceGetAllFlatResponse,
  EServiceGetAllFlatUrlParams,
  EServiceDraftPayload,
  EServiceVersionDraftPayload,
  PostEServiceVersionDraftDocumentPayload,
  UpdateEServiceVersionDraftDocumentPayload,
} from './eservice.api.types'
import { EServiceDescriptorRead, EServiceReadType } from '@/types/eservice.types'
import {
  decorateEServiceWithCurrentViewingDescriptor,
  getDownloadDocumentName,
} from '@/utils/eservice.utils'
import { downloadFile } from '@/utils/common.utils'
import { DocumentRead } from '@/types/common.types'

async function getAllFlat(params: EServiceGetAllFlatUrlParams) {
  const response = await axiosInstance.get<EServiceGetAllFlatResponse>(
    `${CATALOG_PROCESS_URL}/flatten/eservices`,
    { params }
  )
  return response.data
}

async function getSingle(eserviceId: string, descriptorId: string) {
  const response = await axiosInstance.get<EServiceReadType>(
    `${CATALOG_PROCESS_URL}/eservices/${eserviceId}`
  )
  return decorateEServiceWithCurrentViewingDescriptor(descriptorId, response.data)
}

async function upsertDraft({
  eserviceId,
  ...payload
}: {
  eserviceId?: string
} & EServiceDraftPayload) {
  if (eserviceId) {
    const response = await axiosInstance.put<EServiceReadType>(
      `${CATALOG_PROCESS_URL}/eservices/${eserviceId}`,
      payload
    )
    return response.data
  }
  const response = await axiosInstance.post<EServiceReadType>(
    `${CATALOG_PROCESS_URL}/eservices`,
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

async function upsertVersionDraft({
  eserviceId,
  descriptorId,
  ...payload
}: {
  eserviceId: string
  descriptorId?: string
} & EServiceVersionDraftPayload) {
  if (descriptorId) {
    const response = await axiosInstance.put<EServiceDescriptorRead>(
      `${CATALOG_PROCESS_URL}/eservices/${eserviceId}/descriptors/${descriptorId}`,
      payload
    )
    return response.data
  }
  const response = await axiosInstance.post<EServiceDescriptorRead>(
    `${CATALOG_PROCESS_URL}/eservices/${eserviceId}/descriptors`,
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
  getAllFlat,
  getSingle,
  upsertDraft,
  deleteDraft,
  cloneFromVersion,
  upsertVersionDraft,
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
