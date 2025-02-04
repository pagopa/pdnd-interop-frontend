import axiosInstance from '@/config/axios'
import { waitFor } from '@/utils/common.utils'
import type {
  CompactDelegations,
  CompactEServices,
  CreatedResource,
  Delegation,
  DelegationSeed,
  DelegationTenants,
  EServiceSeed,
  GetConsumerDelegatorsParams,
  GetConsumerDelegatedEservicesParams,
  GetConsumerDelegatorsWithAgreementsParams,
  GetDelegationsParams,
  RejectDelegationPayload,
} from '../api.generatedTypes'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { EServiceServices } from '../eservice'

async function getList(params: GetDelegationsParams) {
  const response = await axiosInstance.get<CompactDelegations>(
    `${BACKEND_FOR_FRONTEND_URL}/delegations`,
    { params }
  )

  return response.data
}

async function getSingle({ delegationId }: { delegationId: string }) {
  const response = await axiosInstance.get<Delegation>(
    `${BACKEND_FOR_FRONTEND_URL}/delegations/${delegationId}`
  )

  return response.data
}

async function createProducerDelegation(payload: DelegationSeed) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/producer/delegations`,
    payload
  )
  return response.data
}

async function approveProducerDelegation({ delegationId }: { delegationId: string }) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/producer/delegations/${delegationId}/approve`
  )
}

async function rejectProducerDelegation({
  delegationId,
  ...payload
}: { delegationId: string } & RejectDelegationPayload) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/producer/delegations/${delegationId}/reject`,
    payload
  )
}

async function revokeProducerDelegation({ delegationId }: { delegationId: string }) {
  return axiosInstance.delete(`${BACKEND_FOR_FRONTEND_URL}/producer/delegations/${delegationId}`)
}

async function approveConsumerDelegation({ delegationId }: { delegationId: string }) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/consumer/delegations/${delegationId}/approve`
  )
}

async function rejectConsumerDelegation({
  delegationId,
  ...payload
}: { delegationId: string } & RejectDelegationPayload) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/consumer/delegations/${delegationId}/reject`,
    payload
  )
}

async function downloadDelegationContract({
  delegationId,
  contractId,
}: {
  delegationId: string
  contractId: string
}) {
  const response = await axiosInstance.get<File>(
    `${BACKEND_FOR_FRONTEND_URL}/delegations/${delegationId}/contracts/${contractId}`,
    { responseType: 'arraybuffer' }
  )
  return response.data
}

async function createProducerDelegationAndEservice({
  delegateId,
  ...crateDraftPayload
}: EServiceSeed & { delegateId: string }) {
  const response = await EServiceServices.createDraft(crateDraftPayload)
  //!!! Temporary, in order to avoid eventual consistency issues.
  await waitFor(4000)
  const delegationParams = {
    eserviceId: response.id,
    delegateId,
  }
  return await createProducerDelegation(delegationParams)
}

async function createConsumerDelegation(payload: DelegationSeed) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/consumer/delegations`,
    payload
  )

  return response.data
}
async function getConsumerDelegators(params: GetConsumerDelegatorsParams) {
  const response = await axiosInstance.get<DelegationTenants>(
    `${BACKEND_FOR_FRONTEND_URL}/consumer/delegations/delegators`,
    { params }
  )

  return response.data
}
async function getConsumerDelegatorsWithAgreements(
  params: GetConsumerDelegatorsWithAgreementsParams
) {
  const response = await axiosInstance.get<DelegationTenants>(
    `${BACKEND_FOR_FRONTEND_URL}/consumer/delegations/delegatorsWithAgreements`,
    { params }
  )

  return response.data
}

async function getConsumerDelegatedEservices(params: GetConsumerDelegatedEservicesParams) {
  const response = await axiosInstance.get<CompactEServices>(
    `${BACKEND_FOR_FRONTEND_URL}/consumer/delegations/eservices`,
    { params }
  )

  return response.data
}

async function revokeConsumerDelegation({ delegationId }: { delegationId: string }) {
  return axiosInstance.delete(`${BACKEND_FOR_FRONTEND_URL}/consumer/delegations/${delegationId}`)
}

export const DelegationServices = {
  getList,
  getSingle,
  createProducerDelegation,
  approveProducerDelegation,
  rejectProducerDelegation,
  revokeProducerDelegation,
  approveConsumerDelegation,
  rejectConsumerDelegation,
  downloadDelegationContract,
  createProducerDelegationAndEservice,
  createConsumerDelegation,
  getConsumerDelegators,
  getConsumerDelegatorsWithAgreements,
  getConsumerDelegatedEservices,
  revokeConsumerDelegation,
}
