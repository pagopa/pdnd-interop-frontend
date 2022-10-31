import { PURPOSE_PROCESS_URL } from '@/config/env'
import axiosInstance from '@/lib/axios'
import { Purpose, PurposeVersion } from '@/types/purpose.types'
import { downloadFile } from '@/utils/common.utils'
import {
  PurposeCreateDraftPayload,
  PurposeGetAllUrlParams,
  PurposeUpdateDraftPayload,
} from './purpose.api.types'
import { decoratePurposeWithMostRecentVersion } from './purpose.api.utils'

async function getAll(params: PurposeGetAllUrlParams) {
  const response = await axiosInstance.get<{ purposes: Array<Purpose> }>(
    `${PURPOSE_PROCESS_URL}/purposes`,
    {
      params,
    }
  )
  return response.data.purposes.map(decoratePurposeWithMostRecentVersion)
}

async function getSingle(purposeId: string) {
  const response = await axiosInstance.get<Purpose>(`${PURPOSE_PROCESS_URL}/purposes/${purposeId}`)
  return decoratePurposeWithMostRecentVersion(response.data)
}

async function createDraft({ payload }: { payload: PurposeCreateDraftPayload }) {
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
  return axiosInstance.delete(`${PURPOSE_PROCESS_URL}/purposes/${purposeId}`)
}

async function createVersionDraft({
  purposeId,
  ...payload
}: { purposeId: string } & { dailyCalls: number }) {
  const response = await axiosInstance.post<PurposeVersion>(
    `${PURPOSE_PROCESS_URL}/purposes/${purposeId}/versions`,
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
    `${PURPOSE_PROCESS_URL}/purposes/${purposeId}/versions/${versionId}/update/waitingForApproval`,
    payload
  )
  return response.data
}

async function downloadRiskAnalysis({
  purposeId,
  versionId,
  documentId,
  filename,
}: {
  purposeId: string
  versionId: string
  documentId: string
  filename: string
}) {
  const response = await axiosInstance.get<string>(
    `${PURPOSE_PROCESS_URL}/purposes/${purposeId}/versions/${versionId}/documents/${documentId}`,
    { responseType: 'arraybuffer' }
  )

  downloadFile(response.data, filename)
}

async function suspendVersion({ purposeId, versionId }: { purposeId: string; versionId: string }) {
  const response = await axiosInstance.post<PurposeVersion>(
    `${PURPOSE_PROCESS_URL}/purposes/${purposeId}/versions/${versionId}/suspend`
  )
  return response.data
}

async function activateVersion({ purposeId, versionId }: { purposeId: string; versionId: string }) {
  const response = await axiosInstance.post<PurposeVersion>(
    `${PURPOSE_PROCESS_URL}/purposes/${purposeId}/versions/${versionId}/activate`
  )
  return response.data
}

async function archiveVersion({ purposeId, versionId }: { purposeId: string; versionId: string }) {
  const response = await axiosInstance.post<PurposeVersion>(
    `${PURPOSE_PROCESS_URL}/purposes/${purposeId}/versions/${versionId}/archive`
  )
  return response.data
}

function deleteVersion({ purposeId, versionId }: { purposeId: string; versionId: string }) {
  return axiosInstance.delete(`${PURPOSE_PROCESS_URL}/purposes/${purposeId}/versions/${versionId}`)
}

const PurposeServices = {
  getAll,
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
}

export default PurposeServices
