import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import {
  GetListAgreementQueryParams,
  UploadAgreementDraftDocumentPayload,
} from './agreement.api.types'
import { AgreementSummary } from '@/types/agreement.types'

async function getList(params?: GetListAgreementQueryParams) {
  const response = await axiosInstance.get<Array<AgreementSummary>>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements`,
    { params }
  )
  return response.data
}

async function getSingle(agreementId: string) {
  const response = await axiosInstance.get<AgreementSummary>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}`
  )
  return response.data
}

async function createDraft({
  eserviceId,
  descriptorId,
}: {
  eserviceName: string
  eserviceVersion: string | undefined
  eserviceId: string
  descriptorId: string
}) {
  const response = await axiosInstance.post<{ id: string }>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements`,
    { eserviceId, descriptorId }
  )
  return response.data
}

async function submitDraft({
  agreementId,
  consumerNotes,
}: {
  agreementId: string
  consumerNotes: string
}) {
  const response = await axiosInstance.post<AgreementSummary>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/submit`,
    { consumerNotes }
  )
  return response.data
}

async function deleteDraft({ agreementId }: { agreementId: string }) {
  return axiosInstance.delete<AgreementSummary>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}`
  )
}

async function updateDraft({
  agreementId,
  consumerNotes,
}: {
  agreementId: string
  consumerNotes: string
}) {
  const response = await axiosInstance.post<AgreementSummary>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/update`,
    { consumerNotes }
  )
  return response.data
}

async function downloadDraftDocument({
  agreementId,
  documentId,
}: {
  agreementId: string
  documentId: string
}) {
  const response = await axiosInstance.get(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/consumer-documents/${documentId}`,
    { responseType: 'arraybuffer' }
  )
  return response.data
}

function uploadDraftDocument({
  agreementId,
  ...payload
}: {
  agreementId: string
} & UploadAgreementDraftDocumentPayload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, data]) => formData.append(key, data))

  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/consumer-documents`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
}

function deleteDraftDocument({
  agreementId,
  documentId,
}: {
  agreementId: string
  documentId: string
}) {
  return axiosInstance.delete(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/consumer-documents/${documentId}`
  )
}

async function activate({ agreementId }: { agreementId: string }) {
  const response = await axiosInstance.post<AgreementSummary>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/activate`
  )
  return response.data
}

async function reject({ agreementId, reason }: { agreementId: string; reason: string }) {
  const response = await axiosInstance.post<AgreementSummary>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/reject`,
    { reason }
  )
  return response.data
}

async function suspend({ agreementId }: { agreementId: string }) {
  const response = await axiosInstance.post<AgreementSummary>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/suspend`
  )
  return response.data
}

async function upgrade({ agreementId }: { agreementId: string }) {
  const response = await axiosInstance.post<AgreementSummary>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/upgrade`
  )
  return response.data
}

async function downloadContract({ agreementId }: { agreementId: string }) {
  const response = await axiosInstance.get(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/contract`,
    { responseType: 'arraybuffer' }
  )
  return response.data
}

const AgreementServices = {
  getList,
  getSingle,
  createDraft,
  submitDraft,
  deleteDraft,
  updateDraft,
  downloadDraftDocument,
  uploadDraftDocument,
  deleteDraftDocument,
  activate,
  reject,
  suspend,
  upgrade,
  downloadContract,
}

export default AgreementServices
