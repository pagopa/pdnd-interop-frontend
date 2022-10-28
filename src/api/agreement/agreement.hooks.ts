import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import { GetAllAgreementQueryParams } from './agreement.api.types'
import AgreementServices from './agreement.services'

export enum AgreementQueryKeys {
  GetAll = 'AgreementGetAll',
  GetSingle = 'AgreementGetSingle',
}

function useGetAll(params: GetAllAgreementQueryParams) {
  return useQueryWrapper([AgreementQueryKeys.GetAll, params], () =>
    AgreementServices.getAll(params)
  )
}

function useGetSingle(agreementId: string) {
  return useQueryWrapper([AgreementQueryKeys.GetSingle, agreementId], () =>
    AgreementServices.getSingle(agreementId)
  )
}

// function useSubmitDraft() {
//   const { t } = useTranslation('mutations-feedback')
//   return useMutationWrapper(AgreementServices.submitDraft, {})
// }
// async function submitDraft({
//   agreementId,
//   consumerNotes,
// }: {
//   agreementId: string
//   consumerNotes: string
// }) {
//   const response = await axiosInstance.post<AgreementSummary>(
//     `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/submit`,
//     { consumerNotes }
//   )
//   return response.data
// }

// async function deleteDraft({ agreementId }: { agreementId: string }) {
//   return axiosInstance.delete<AgreementSummary>(
//     `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}`
//   )
// }

// async function downloadDraftDocument({
//   agreementId,
//   documentId,
// }: {
//   agreementId: string
//   documentId: string
// }) {
//   const response = await axiosInstance.get<string>(
//     `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/consumer-documents/${documentId}`,
//     {
//       responseType: 'arraybuffer',
//     }
//   )

//   return response.data
// }

// function uploadDraftDocument({
//   agreementId,
//   documentId,
//   ...payload
// }: {
//   agreementId: string
//   documentId: string
// } & UploadAgreementDraftDocumentPayload) {
//   const formData = new FormData()
//   Object.entries(payload).forEach(([key, data]) => formData.append(key, data))

//   return axiosInstance.post(
//     `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/consumer-documents/${documentId}`,
//     formData,
//     {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     }
//   )
// }

// function deleteDraftDocument({
//   agreementId,
//   documentId,
// }: {
//   agreementId: string
//   documentId: string
// }) {
//   return axiosInstance.delete(
//     `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/consumer-documents/${documentId}`
//   )
// }

// async function activate({ agreementId }: { agreementId: string }) {
//   const response = await axiosInstance.post<AgreementSummary>(
//     `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/activate`
//   )
//   return response.data
// }

// async function reject({ agreementId, reason }: { agreementId: string; reason: string }) {
//   const response = await axiosInstance.post<AgreementSummary>(
//     `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/reject`,
//     { reason }
//   )
//   return response.data
// }

// async function suspend({ agreementId }: { agreementId: string }) {
//   const response = await axiosInstance.post<AgreementSummary>(
//     `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/suspend`
//   )
//   return response.data
// }

// async function upgrade({ agreementId }: { agreementId: string }) {
//   const response = await axiosInstance.post<AgreementSummary>(
//     `${BACKEND_FOR_FRONTEND_URL}/agreements/${agreementId}/upgrade`
//   )
//   return response.data
// }

export const AgreementQueries = {}

export const AgreementMutations = {}
