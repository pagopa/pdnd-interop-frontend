import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type {
  CatalogEServiceDescriptor,
  CatalogEServices,
  CompactOrganizations,
  CreatedEServiceDescriptor,
  CreatedResource,
  CreateEServiceDocumentPayload,
  DescriptorAttributesSeed,
  EServiceDescriptionUpdateSeed,
  EServiceDoc,
  EServiceNameUpdateSeed,
  EServiceRiskAnalysis,
  EServiceRiskAnalysisSeed,
  EServiceSeed,
  FileResource,
  GetConsumersParams,
  GetEServicesCatalogParams,
  GetProducerEServicesParams,
  GetProducersParams,
  PresignedUrl,
  ProducerEServiceDescriptor,
  ProducerEServiceDetails,
  ProducerEServices,
  UpdateEServiceDescriptorAgreementApprovalPolicySeed,
  UpdateEServiceDescriptorDocumentSeed,
  UpdateEServiceDescriptorQuotas,
  UpdateEServiceDescriptorSeed,
  UpdateEServiceDescriptorTemplateInstanceSeed,
  UpdateEServiceTemplateInstanceDescriptorQuotas,
  UpdateEServiceSeed,
  RejectDelegatedEServiceDescriptorSeed,
  TemplateInstanceInterfaceRESTSeed,
  TemplateInstanceInterfaceSOAPSeed,
  EServiceSignalhubActivateSeed,
} from '../api.generatedTypes'
import type { AttributeKey } from '@/types/attribute.types'
import { waitFor } from '@/utils/common.utils'

async function getCatalogList(params: GetEServicesCatalogParams) {
  const response = await axiosInstance.get<CatalogEServices>(
    `${BACKEND_FOR_FRONTEND_URL}/catalog`,
    { params }
  )
  return response.data
}

async function getProviderList(params: GetProducerEServicesParams) {
  const response = await axiosInstance.get<ProducerEServices>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/eservices`,
    { params }
  )
  return response.data
}

async function getSingle(eserviceId: string) {
  const response = await axiosInstance.get<ProducerEServiceDetails>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/eservices/${eserviceId}`
  )
  return response.data
}

async function getDescriptorCatalog(eserviceId: string, descriptorId: string) {
  const response = await axiosInstance.get<CatalogEServiceDescriptor>(
    `${BACKEND_FOR_FRONTEND_URL}/catalog/eservices/${eserviceId}/descriptor/${descriptorId}`
  )
  return response.data
}

async function getDescriptorProvider(eserviceId: string, descriptorId: string) {
  const response = await axiosInstance.get<ProducerEServiceDescriptor>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/eservices/${eserviceId}/descriptors/${descriptorId}`
  )
  return response.data
}

async function getConsumers(params: GetConsumersParams) {
  const response = await axiosInstance.get<CompactOrganizations>(
    `${BACKEND_FOR_FRONTEND_URL}/consumers`,
    { params }
  )
  return response.data
}

async function getProducers(params: GetProducersParams) {
  const response = await axiosInstance.get<CompactOrganizations>(
    `${BACKEND_FOR_FRONTEND_URL}/producers`,
    { params }
  )
  return response.data
}

async function createDraft(payload: EServiceSeed) {
  const response = await axiosInstance.post<CreatedEServiceDescriptor>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices`,
    payload
  )
  return response.data
}

async function updateDraft({
  eserviceId,
  ...payload
}: {
  eserviceId: string
} & UpdateEServiceSeed) {
  const response = await axiosInstance.put<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}`,
    payload
  )
  return response.data
}

function deleteDraft({ eserviceId }: { eserviceId: string }) {
  return axiosInstance.delete(`${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}`)
}

async function cloneFromVersion({
  eserviceId,
  descriptorId,
}: {
  eserviceId: string
  descriptorId: string
}) {
  const response = await axiosInstance.post<CreatedEServiceDescriptor>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/clone`
  )
  return response.data
}

async function createVersionDraft({ eserviceId }: { eserviceId: string }) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors`
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
} & UpdateEServiceDescriptorSeed) {
  const response = await axiosInstance.put<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}`,
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
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/publish`
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
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/suspend`
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
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/activate`
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
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}`
  )
}

function updateVersion({
  eserviceId,
  descriptorId,
  ...payload
}: {
  eserviceId: string
  descriptorId: string
} & UpdateEServiceDescriptorQuotas) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/update`,
    payload
  )
}

function updateInstanceVersion({
  eserviceId,
  descriptorId,
  ...payload
}: {
  eserviceId: string
  descriptorId: string
} & UpdateEServiceTemplateInstanceDescriptorQuotas) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/templates/eservices/${eserviceId}/descriptors/${descriptorId}/update`,
    payload
  )
}

function updateAgreementApprovalPolicy({
  eserviceId,
  descriptorId,
  ...payload
}: {
  eserviceId: string
  descriptorId: string
} & UpdateEServiceDescriptorAgreementApprovalPolicySeed) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/agreementApprovalPolicy/update`,
    payload
  )
}

function addEServiceRiskAnalysis({
  eserviceId,
  ...payload
}: {
  eserviceId: string
} & EServiceRiskAnalysisSeed) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/riskAnalysis`,
    payload
  )
}

async function getEServiceRiskAnalysis({
  eserviceId,
  riskAnalysisId,
}: {
  eserviceId: string
  riskAnalysisId: string
}) {
  const response = await axiosInstance.get<EServiceRiskAnalysis>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/riskAnalysis/${riskAnalysisId}`
  )
  return response.data
}

function updateEServiceRiskAnalysis({
  eserviceId,
  riskAnalysisId,
  ...payload
}: {
  eserviceId: string
  riskAnalysisId: string
} & EServiceRiskAnalysisSeed) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/riskAnalysis/${riskAnalysisId}`,
    payload
  )
}

function deleteEServiceRiskAnalysis({
  eserviceId,
  riskAnalysisId,
}: {
  eserviceId: string
  riskAnalysisId: string
}) {
  return axiosInstance.delete(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/riskAnalysis/${riskAnalysisId}`
  )
}

async function postVersionDraftDocument({
  eserviceId,
  descriptorId,
  ...payload
}: {
  eserviceId: string
  descriptorId: string
} & CreateEServiceDocumentPayload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, data]) => formData.append(key, data))

  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents`,
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
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents/${documentId}`
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
} & UpdateEServiceDescriptorDocumentSeed) {
  const response = await axiosInstance.post<EServiceDoc>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents/${documentId}/update`,
    payload
  )
  return response.data
}

async function downloadVersionDraftDocument({
  eserviceId,
  descriptorId,
  documentId,
}: {
  eserviceId: string
  descriptorId: string
  documentId: string
}) {
  const response = await axiosInstance.get<File>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/documents/${documentId}`,
    { responseType: 'arraybuffer' }
  )
  return response.data
}

async function downloadConsumerList({ eserviceId }: { eserviceId: string }) {
  const response = await axiosInstance.get<File>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/consumers`,
    { responseType: 'arraybuffer' }
  )
  return response.data
}

async function updateEServiceDescription({
  eserviceId,
  ...payload
}: { eserviceId: string } & EServiceDescriptionUpdateSeed) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/description/update`,
    payload
  )
  return response.data
}

async function exportVersion({
  eserviceId,
  descriptorId,
}: {
  eserviceId: string
  descriptorId: string
}) {
  const response = await axiosInstance.get<FileResource>(
    `${BACKEND_FOR_FRONTEND_URL}/export/eservices/${eserviceId}/descriptors/${descriptorId}`
  )

  const file = await axiosInstance.get<File>(response.data.url, {
    transformRequest: (data, headers) => {
      delete headers['Authorization']
      return data
    },
    responseType: 'arraybuffer',
  })

  return { file: file.data, filename: response.data.filename }
}

async function importVersion({ eserviceFile }: { eserviceFile: File }) {
  const fileName = eserviceFile.name
  const { data: presignedUrl } = await axiosInstance.get<PresignedUrl>(
    `${BACKEND_FOR_FRONTEND_URL}/import/eservices/presignedUrl`,
    { params: { fileName } }
  )

  return await axiosInstance
    .put(presignedUrl.url, eserviceFile, {
      transformRequest: (data, headers) => {
        delete headers['Authorization']
        return data
      },
    })
    .then(async () => {
      const eserviceFileResource: FileResource = {
        filename: fileName,
        url: presignedUrl.url,
      }

      const responseImport = await axiosInstance.post<CreatedEServiceDescriptor>(
        `${BACKEND_FOR_FRONTEND_URL}/import/eservices`,
        eserviceFileResource
      )

      return responseImport.data
    })
}

async function updateDescriptorAttributes({
  eserviceId,
  descriptorId,
  attributeKey: _attributeKey,
  ...payload
}: {
  eserviceId: string
  descriptorId: string
  attributeKey: AttributeKey
} & DescriptorAttributesSeed) {
  return axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/attributes/update`,
    payload
  )
}

async function approveDelegatedVersionDraft({
  eserviceId,
  descriptorId,
}: {
  eserviceId: string
  descriptorId: string
}) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/approve`
  )
  return response.data
}

async function rejectDelegatedVersionDraft({
  eserviceId,
  descriptorId,
  ...payload
}: {
  eserviceId: string
  descriptorId: string
} & RejectDelegatedEServiceDescriptorSeed) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/descriptors/${descriptorId}/reject`,
    payload
  )
  return response.data
}

async function updateEServiceName({
  eserviceId,
  ...payload
}: { eserviceId: string } & EServiceNameUpdateSeed) {
  const response = await axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/name/update`,
    payload
  )
  return response.data
}

async function deleteDocAndUpdateEServiceInterfaceRESTInfo({
  eserviceId,
  descriptorId,
  documentId,
  ...payload
}: {
  eserviceId: string
  descriptorId: string
  documentId: string | undefined
} & TemplateInstanceInterfaceRESTSeed) {
  // Need to Delete document and wait before to update interface's data
  if (documentId) {
    await deleteVersionDraftDocument({ eserviceId, descriptorId, documentId })
    await waitFor(4000)
  }
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/templates/eservices/${eserviceId}/descriptors/${descriptorId}/interface/rest`,
    payload
  )

  return response.data
}

async function deleteDocAndUpdateEServiceInterfaceSOAPInfo({
  eserviceId,
  descriptorId,
  documentId,
  ...payload
}: {
  eserviceId: string
  descriptorId: string
  documentId: string | undefined
} & TemplateInstanceInterfaceSOAPSeed) {
  // Need to Delete document and wait before to update interface's data
  if (documentId) {
    await deleteVersionDraftDocument({ eserviceId, descriptorId, documentId })
    await waitFor(4000)
  }
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/templates/eservices/${eserviceId}/descriptors/${descriptorId}/interface/soap`,
    payload
  )

  return response.data
}

/**
 * This API allow to upgrade an an EService inherit from template
 * @param eServiceID
 * @returns
 */
async function upgradeEService({ eserviceId }: { eserviceId: string }) {
  const response = await axiosInstance.post<CreatedEServiceDescriptor>(
    `${BACKEND_FOR_FRONTEND_URL}/templates/eservices/${eserviceId}/upgrade`
  )

  return response.data
}

async function updateInstanceVersionDraft({
  eserviceId,
  descriptorId,
  ...payload
}: {
  eserviceId: string
  descriptorId: string
} & UpdateEServiceDescriptorTemplateInstanceSeed) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/templates/eservices/${eserviceId}/descriptors/${descriptorId}`,
    payload
  )
  return response.data
}

async function deleteDraftAndUpgradeEService({
  eserviceId,
  descriptorId,
}: {
  eserviceId: string
  descriptorId: string
}) {
  await EServiceServices.deleteVersionDraft({ eserviceId, descriptorId })
  //!!! Temporary, in order to avoid eventual consistency issues.
  await waitFor(4000)
  return await EServiceServices.upgradeEService({ eserviceId })
}

async function getIsEServiceNameAvailable({ eserviceName }: { eserviceName: string }) {
  const response = await axiosInstance.get<boolean>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/names/availability`,
    { params: { name: eserviceName } }
  )
  return response.data
}

async function updateEServiceSignalHub({
  eserviceId,
  ...payload
}: { eserviceId: string } & EServiceSignalhubActivateSeed) {
  const response = await axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/${eserviceId}/signalhub/update`,
    payload
  )
  return response.data
}

export const EServiceServices = {
  getCatalogList,
  getProviderList,
  getSingle,
  getDescriptorCatalog,
  getDescriptorProvider,
  getConsumers,
  getProducers,
  createDraft,
  updateDraft,
  deleteDraft,
  cloneFromVersion,
  createVersionDraft,
  updateVersionDraft,
  publishVersionDraft,
  suspendVersion,
  updateVersion,
  updateInstanceVersion,
  updateAgreementApprovalPolicy,
  reactivateVersion,
  deleteVersionDraft,
  addEServiceRiskAnalysis,
  getEServiceRiskAnalysis,
  updateEServiceRiskAnalysis,
  deleteEServiceRiskAnalysis,
  postVersionDraftDocument,
  deleteVersionDraftDocument,
  updateVersionDraftDocumentDescription,
  downloadVersionDraftDocument,
  downloadConsumerList,
  updateEServiceDescription,
  exportVersion,
  importVersion,
  updateDescriptorAttributes,
  approveDelegatedVersionDraft,
  rejectDelegatedVersionDraft,
  updateEServiceName,
  deleteDocAndUpdateEServiceInterfaceRESTInfo,
  deleteDocAndUpdateEServiceInterfaceSOAPInfo,
  upgradeEService,
  updateInstanceVersionDraft,
  deleteDraftAndUpgradeEService,
  getIsEServiceNameAvailable,
  updateEServiceSignalHub,
}
