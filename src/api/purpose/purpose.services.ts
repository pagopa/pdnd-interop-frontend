import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import type {
  CreatedResource,
  DraftPurposeVersionUpdateContent,
  GetPurposesParams,
  Purpose,
  PurposeAdditionDetailsSeed,
  Purposes,
  PurposeSeed,
  PurposeUpdateContent,
  PurposeVersionResource,
  PurposeVersionSeed,
  WaitingForApprovalPurposeVersionUpdateContentSeed,
} from '../api.generatedTypes'

async function getList(params: GetPurposesParams) {
  const response = await axiosInstance.get<Purposes>(`${BACKEND_FOR_FRONTEND_URL}/purposes`, {
    params,
  })
  return response.data
}

async function getSingle(purposeId: string) {
  const response = await axiosInstance.get<Purpose>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}`
  )
  return response.data
}

async function createDraft(payload: PurposeSeed) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes`,
    payload
  )
  return response.data
}

async function updateDraft({
  purposeId,
  ...payload
}: { purposeId: string } & PurposeUpdateContent) {
  const response = await axiosInstance.post<PurposeVersionResource>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}`,
    payload
  )
  return response.data
}

function deleteDraft({ purposeId }: { purposeId: string }) {
  return axiosInstance.delete(`${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}`)
}

async function createVersionDraft({
  purposeId,
  ...payload
}: { purposeId: string } & PurposeVersionSeed) {
  const response = await axiosInstance.post<PurposeVersionResource>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions`,
    payload
  )
  return response.data
}

async function updateVersionDraft({
  purposeId,
  versionId,
  ...payload
}: { purposeId: string; versionId: string } & DraftPurposeVersionUpdateContent) {
  const response = await axiosInstance.post<PurposeVersionResource>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions/${versionId}/update/draft`,
    payload
  )
  return response.data
}

async function updateDailyCalls(data: { purposeId: string; dailyCalls: number }) {
  const newPurposeVersion = await createVersionDraft(data)
  return activateVersion({ purposeId: data.purposeId, versionId: newPurposeVersion.versionId })
}

async function updateVersionWaitingForApproval({
  purposeId,
  versionId,
  ...payload
}: { purposeId: string; versionId: string } & WaitingForApprovalPurposeVersionUpdateContentSeed) {
  const response = await axiosInstance.post<PurposeVersionResource>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions/${versionId}/update/waitingForApproval`,
    payload
  )
  return response.data
}

async function downloadRiskAnalysis({
  purposeId,
  versionId,
  documentId,
}: {
  purposeId: string
  versionId: string
  documentId: string
}) {
  const response = await axiosInstance.get<File>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions/${versionId}/documents/${documentId}`,
    { responseType: 'arraybuffer' }
  )

  return response.data
}

async function suspendVersion({ purposeId, versionId }: { purposeId: string; versionId: string }) {
  const response = await axiosInstance.post<PurposeVersionResource>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions/${versionId}/suspend`
  )
  return response.data
}

async function activateVersion({ purposeId, versionId }: { purposeId: string; versionId: string }) {
  const response = await axiosInstance.post<PurposeVersionResource>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions/${versionId}/activate`
  )
  return response.data
}

async function archiveVersion({ purposeId, versionId }: { purposeId: string; versionId: string }) {
  const response = await axiosInstance.post<PurposeVersionResource>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions/${versionId}/archive`
  )
  return response.data
}

function deleteVersion({ purposeId, versionId }: { purposeId: string; versionId: string }) {
  return axiosInstance.delete(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions/${versionId}`
  )
}

async function clone({ purposeId }: { purposeId: string }) {
  const response = await axiosInstance.post<PurposeVersionResource>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/clone`
  )
  return response.data
}

function addClient({ clientId, purposeId }: { clientId: string } & PurposeAdditionDetailsSeed) {
  return axiosInstance.post(`${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/purposes`, {
    purposeId,
  })
}

function removeClient({ clientId, purposeId }: { clientId: string; purposeId: string }) {
  return axiosInstance.delete(
    `${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/purposes/${purposeId}`
  )
}

const PurposeServices = {
  getList,
  getSingle,
  createDraft,
  updateDraft,
  deleteDraft,
  createVersionDraft,
  updateVersionDraft,
  updateVersionWaitingForApproval,
  updateDailyCalls,
  downloadRiskAnalysis,
  suspendVersion,
  activateVersion,
  archiveVersion,
  deleteVersion,
  clone,
  addClient,
  removeClient,
}

export default PurposeServices
