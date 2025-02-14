import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type {
  AddAgreementConsumerDocumentPayload,
  Agreement,
  AgreementPayload,
  AgreementRejectionPayload,
  Agreements,
  AgreementSubmissionPayload,
  AgreementUpdatePayload,
  CompactEServicesLight,
  CompactOrganizations,
  CreatedResource,
  GetAgreementConsumersParams,
  GetAgreementEServiceConsumersParams,
  GetAgreementEServiceProducersParams,
  GetAgreementProducersParams,
  GetConsumerAgreementsParams,
  GetProducerAgreementsParams,
} from '../api.generatedTypes'
import { waitFor } from '@/utils/common.utils'

async function getProducerAgreementsList(params?: GetProducerAgreementsParams) {
  const response = await axiosInstance.get<Agreements>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/agreements`,
    {
      params,
    }
  )
  return response.data
}

async function getConsumerAgreementsList(params?: GetConsumerAgreementsParams) {
  const response = await axiosInstance.get<Agreements>(
    `${BACKEND_FOR_FRONTEND_URL}/consumers/agreements`,
    {
      params,
    }
  )
  return response.data
}

async function getSingle(agreementId: string) {
  const response = await axiosInstance.get<Agreement>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}`
  )
  return response.data
}

async function getProducers(params?: GetAgreementProducersParams) {
  const response = await axiosInstance.get<CompactOrganizations>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/filter/producers`,
    { params }
  )
  return response.data
}

async function getConsumers(params?: GetAgreementConsumersParams) {
  const response = await axiosInstance.get<CompactOrganizations>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/filter/consumers`,
    { params }
  )
  return response.data
}

async function getProducerEServiceList(params: GetAgreementEServiceProducersParams) {
  const response = await axiosInstance.get<CompactEServicesLight>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/agreements/eservices`,
    { params }
  )
  return response.data
}

async function getConsumerEServiceList(params: GetAgreementEServiceConsumersParams) {
  const response = await axiosInstance.get<CompactEServicesLight>(
    `${BACKEND_FOR_FRONTEND_URL}/consumers/agreements/eservices`,
    { params }
  )
  return response.data
}

async function createDraft({ eserviceId, descriptorId, delegationId }: AgreementPayload) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements`,
    { eserviceId, descriptorId, delegationId }
  )
  return response.data
}

async function submitDraft({
  agreementId,
  consumerNotes,
}: {
  agreementId: string
} & AgreementSubmissionPayload) {
  const response = await axiosInstance.post<Agreement>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/submit`,
    { consumerNotes }
  )
  return response.data
}

/**
 * This is used to subscribe to an e-service that is owned by the subscriber itself.
 * It skips the draft creation and directly submits the agreement.
 */
async function submitToOwnEService({ eserviceId, descriptorId, delegationId }: AgreementPayload) {
  const response = await createDraft({ eserviceId, descriptorId, delegationId })
  //!!! Temporary, in order to avoid eventual consistency issues.
  await waitFor(2000)
  return await submitDraft({ agreementId: response.id })
}

async function deleteDraft({ agreementId }: { agreementId: string }) {
  return axiosInstance.delete<Agreement>(`${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}`)
}

async function updateDraft({
  agreementId,
  consumerNotes,
}: {
  agreementId: string
} & AgreementUpdatePayload) {
  const response = await axiosInstance.post<Agreement>(
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
} & AddAgreementConsumerDocumentPayload) {
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
  const response = await axiosInstance.post<Agreement>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/activate`
  )
  return response.data
}

async function reject({
  agreementId,
  reason,
}: { agreementId: string } & AgreementRejectionPayload) {
  const response = await axiosInstance.post<Agreement>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/reject`,
    { reason }
  )
  return response.data
}

async function suspend({ agreementId }: { agreementId: string }) {
  const response = await axiosInstance.post<Agreement>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/suspend`
  )
  return response.data
}

async function archive({ agreementId }: { agreementId: string }) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/archive`
  )
}

async function upgrade({ agreementId }: { agreementId: string }) {
  const response = await axiosInstance.post<Agreement>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/upgrade`
  )
  return response.data
}

async function clone({ agreementId }: { agreementId: string }) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/clone`
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

export const AgreementServices = {
  getProducerAgreementsList,
  getConsumerAgreementsList,
  getSingle,
  getProducers,
  getConsumers,
  getProducerEServiceList,
  getConsumerEServiceList,
  createDraft,
  submitDraft,
  submitToOwnEService,
  deleteDraft,
  updateDraft,
  downloadDraftDocument,
  uploadDraftDocument,
  deleteDraftDocument,
  activate,
  reject,
  suspend,
  archive,
  upgrade,
  clone,
  downloadContract,
}
