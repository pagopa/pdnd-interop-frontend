import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import type {
  CreatedResource,
  GetConsumerPurposesParams,
  GetProducerPurposesParams,
  Purpose,
  PurposeAdditionDetailsSeed,
  PurposeEServiceSeed,
  Purposes,
  PurposeSeed,
  PurposeUpdateContent,
  PurposeVersionResource,
  PurposeVersionSeed,
  RiskAnalysisFormConfig,
  WaitingForApprovalPurposeVersionUpdateContentSeed,
} from '../api.generatedTypes'

async function getProducersList(params: GetProducerPurposesParams) {
  const response = await axiosInstance.get<Purposes>(
    `${BACKEND_FOR_FRONTEND_URL}/producer/purposes`,
    {
      params,
    }
  )
  return response.data
}

async function getConsumersList(params: GetConsumerPurposesParams) {
  const response = await axiosInstance.get<Purposes>(
    `${BACKEND_FOR_FRONTEND_URL}/consumer/purposes`,
    {
      params,
    }
  )
  return response.data
}

async function getSingle(purposeId: string) {
  const response = await axiosInstance.get<Purpose>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}`
  )
  return response.data
}

async function getRiskAnalysisLatest() {
  const response = await axiosInstance.get<RiskAnalysisFormConfig>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/riskAnalysis/latest`
  )
  return response.data
}

async function getRiskAnalysisVersion(riskAnalysisVersion: string) {
  const response = await axiosInstance.get<RiskAnalysisFormConfig>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/riskAnalysis/version/${riskAnalysisVersion}`
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

async function createDraftForReceiveEService(payload: PurposeEServiceSeed) {
  const response = await axiosInstance.post<Purpose>(
    `${BACKEND_FOR_FRONTEND_URL}/reverse/purposes`,
    payload
  )
  return response.data
}

async function updateDailyCalls({
  purposeId,
  ...payload
}: { purposeId: string } & PurposeVersionSeed) {
  const response = await axiosInstance.post<PurposeVersionResource>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions`,
    payload
  )
  return response.data
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
  getProducersList,
  getConsumersList,
  getSingle,
  getRiskAnalysisLatest,
  getRiskAnalysisVersion,
  createDraft,
  updateDraft,
  deleteDraft,
  createDraftForReceiveEService,
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
