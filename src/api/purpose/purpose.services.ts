import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import type {
  CreatedResource,
  DelegationRef,
  GetConsumerPurposesParams,
  GetProducerPurposesParams,
  Purpose,
  PurposeAdditionDetailsSeed,
  PurposeCloneSeed,
  PurposeEServiceSeed,
  Purposes,
  PurposeSeed,
  PurposeUpdateContent,
  PurposeVersionResource,
  PurposeVersionSeed,
  RejectPurposeVersionPayload,
  RetrieveLatestRiskAnalysisConfigurationParams,
  RetrieveRiskAnalysisConfigurationByVersionParams,
  ReversePurposeUpdateContent,
  RiskAnalysisFormConfig,
} from '../api.generatedTypes'

/**
 * This logic should be ported in the BFF.
 * When a provider tries to activate a suspended purpose whom e-service is overquota,
 * backend side a new waiting for approval version is created. For this case, in order
 * to the frontend to function properly, we remove the current version.
 */
function REMOVE_ME_remapPurpose(purpose: Purpose): Purpose {
  if (
    purpose.waitingForApprovalVersion &&
    purpose.currentVersion &&
    purpose.suspendedByConsumer &&
    purpose.currentVersion.dailyCalls === purpose.waitingForApprovalVersion.dailyCalls
  ) {
    return {
      ...purpose,
      currentVersion: undefined,
    }
  }

  return purpose
}

async function getProducersList(params: GetProducerPurposesParams) {
  const response = await axiosInstance.get<Purposes>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/purposes`,
    {
      params,
    }
  )
  return { ...response.data, results: response.data.results.map(REMOVE_ME_remapPurpose) }
}

async function getConsumersList(params: GetConsumerPurposesParams) {
  const response = await axiosInstance.get<Purposes>(
    `${BACKEND_FOR_FRONTEND_URL}/consumers/purposes`,
    {
      params,
    }
  )
  return { ...response.data, results: response.data.results.map(REMOVE_ME_remapPurpose) }
}

async function getSingle(purposeId: string) {
  const response = await axiosInstance.get<Purpose>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}`
  )
  return REMOVE_ME_remapPurpose(response.data)
}

async function getRiskAnalysisLatest(params?: RetrieveLatestRiskAnalysisConfigurationParams) {
  const response = await axiosInstance.get<RiskAnalysisFormConfig>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/riskAnalysis/latest`,
    { params }
  )
  return response.data
}

async function getRiskAnalysisVersion({
  riskAnalysisVersion,
  ...params
}: RetrieveRiskAnalysisConfigurationByVersionParams) {
  const response = await axiosInstance.get<RiskAnalysisFormConfig>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/riskAnalysis/version/${riskAnalysisVersion}`,
    { params }
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
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/reverse/purposes`,
    payload
  )
  return response.data
}

async function updateDraftForReceiveEService({
  purposeId,
  ...payload
}: { purposeId: string } & ReversePurposeUpdateContent) {
  const response = await axiosInstance.post<PurposeVersionResource>(
    `${BACKEND_FOR_FRONTEND_URL}/reverse/purposes/${purposeId}`,
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

async function suspendVersion({
  purposeId,
  versionId,
  ...params
}: { purposeId: string; versionId: string } & DelegationRef) {
  const response = await axiosInstance.post<PurposeVersionResource>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions/${versionId}/suspend`,
    {
      params,
    }
  )
  return response.data
}

async function activateVersion({
  purposeId,
  versionId,
  ...params
}: { purposeId: string; versionId: string } & DelegationRef) {
  const response = await axiosInstance.post<PurposeVersionResource>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions/${versionId}/activate`,
    {
      params,
    }
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

function rejectVersion({
  purposeId,
  versionId,
  ...payload
}: { purposeId: string; versionId: string } & RejectPurposeVersionPayload) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/versions/${versionId}/reject`,
    payload
  )
}

async function clone({ purposeId, ...payload }: { purposeId: string } & PurposeCloneSeed) {
  const response = await axiosInstance.post<PurposeVersionResource>(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purposeId}/clone`,
    payload
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

export const PurposeServices = {
  getProducersList,
  getConsumersList,
  getSingle,
  getRiskAnalysisLatest,
  getRiskAnalysisVersion,
  createDraft,
  updateDraft,
  deleteDraft,
  createDraftForReceiveEService,
  updateDraftForReceiveEService,
  updateDailyCalls,
  downloadRiskAnalysis,
  suspendVersion,
  activateVersion,
  archiveVersion,
  deleteVersion,
  rejectVersion,
  clone,
  addClient,
  removeClient,
}
