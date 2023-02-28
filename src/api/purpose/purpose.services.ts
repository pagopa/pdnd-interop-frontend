import {
  AUTHORIZATION_PROCESS_URL,
  BACKEND_FOR_FRONTEND_URL,
  PURPOSE_PROCESS_URL,
} from '@/config/env'
import axiosInstance from '@/config/axios'
import type { Purpose, PurposeListingItem, PurposeVersion } from '@/types/purpose.types'
import type {
  PurposeCreateDraftPayload,
  PurposeGetListUrlParams,
  PurposeUpdateDraftPayload,
} from './purpose.api.types'
import { decoratePurposeWithMostRecentVersion } from './purpose.api.utils'
import type { Paginated } from '../react-query-wrappers/react-query-wrappers.types'

async function getList(params: PurposeGetListUrlParams) {
  const response = await axiosInstance.get<Paginated<PurposeListingItem>>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes`,
    { params }
  )
  return response.data
}

async function getSingle(purposeId: string) {
  const response = await axiosInstance.get<Purpose>(`${PURPOSE_PROCESS_URL}/purposes/${purposeId}`)
  return decoratePurposeWithMostRecentVersion(response.data)
}

async function createDraft(payload: PurposeCreateDraftPayload) {
  const response = await axiosInstance.post<Purpose>(`${PURPOSE_PROCESS_URL}/purposes`, payload)
  return response.data
}

async function updateDraft({
  purposeId,
  ...payload
}: { purposeId: string } & PurposeUpdateDraftPayload) {
  const response = await axiosInstance.post<Purpose>(
    `${PURPOSE_PROCESS_URL}/purposes/${purposeId}`,
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
}: { purposeId: string } & { dailyCalls: number }) {
  const response = await axiosInstance.post<PurposeVersion>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions`,
    payload
  )
  return response.data
}

async function updateVersionDraft({
  purposeId,
  versionId,
  ...payload
}: { purposeId: string; versionId: string } & { dailyCalls: number }) {
  const response = await axiosInstance.post<PurposeVersion>(
    `${PURPOSE_PROCESS_URL}/purposes/${purposeId}/versions/${versionId}/update/draft`,
    payload
  )
  return response.data
}

async function updateDailyCalls(data: { purposeId: string; dailyCalls: number }) {
  const newPurposeVersion = await createVersionDraft(data)
  return activateVersion({ purposeId: data.purposeId, versionId: newPurposeVersion.id })
}

async function updateVersionWaitingForApproval({
  purposeId,
  versionId,
  ...payload
}: { purposeId: string; versionId: string } & { expectedApprovalDate: Date }) {
  const response = await axiosInstance.post<PurposeVersion>(
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
  const response = await axiosInstance.get<string>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions/${versionId}/documents/${documentId}`,
    { responseType: 'arraybuffer' }
  )

  return response.data
}

async function suspendVersion({ purposeId, versionId }: { purposeId: string; versionId: string }) {
  const response = await axiosInstance.post<PurposeVersion>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions/${versionId}/suspend`
  )
  return response.data
}

async function activateVersion({ purposeId, versionId }: { purposeId: string; versionId: string }) {
  const response = await axiosInstance.post<PurposeVersion>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions/${versionId}/activate`
  )
  return response.data
}

async function archiveVersion({ purposeId, versionId }: { purposeId: string; versionId: string }) {
  const response = await axiosInstance.post<PurposeVersion>(
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
  const response = await axiosInstance.post<{ purposeId: string; versionId: string }>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/clone`
  )
  return response.data
}

function addClient({ clientId, purposeId }: { clientId: string; purposeId: string }) {
  return axiosInstance.post(`${AUTHORIZATION_PROCESS_URL}/clients/${clientId}/purposes`, {
    purposeId,
  })
}

function removeClient({ clientId, purposeId }: { clientId: string; purposeId: string }) {
  return axiosInstance.delete(
    `${AUTHORIZATION_PROCESS_URL}/clients/${clientId}/purposes/${purposeId}`
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
