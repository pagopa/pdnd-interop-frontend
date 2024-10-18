// TODO

// import axiosInstance from '@/config/axios'
import type {
  CompactDelegations,
  CreatedResource,
  Delegation,
  DelegationSeed,
  GetProducerDelegationsParams,
  RejectDelegationPayload,
} from '../api.generatedTypes'
// import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'

async function getProducerDelegations(params: GetProducerDelegationsParams) {
  // const response = await axiosInstance.get<CompactDelegations>(
  //   `${BACKEND_FOR_FRONTEND_URL}/producer/delegations`,
  //   { params }
  // )

  // return response.data

  const response: CompactDelegations = {
    results: [
      {
        delegatedName: 'delegatedName',
        delegatorName: 'delegatorName',
        eserviceName: 'eserviceName',
        id: 'id',
        state: 'ACTIVE',
      },
    ],
    pagination: {
      limit: params.limit,
      offset: params.offset,
      totalCount: 2,
    },
  }
  return response
}

async function getSingle({ delegationId }: { delegationId: string }) {
  // const response = await axiosInstance.get<Delegation>(
  //   `${BACKEND_FOR_FRONTEND_URL}/producer/delegations/${delegationId}`
  // )

  // return response.data

  const response: Delegation = {
    delegate: {
      id: 'delegateId',
      name: 'delegateName',
    },
    delegator: {
      id: 'delegatorId',
      name: 'delegatorName',
    },
    id: delegationId,
    eservice: {
      id: 'eserviceId',
      name: 'eserviceName',
      description: 'eserviceDescription',
    },
    state: 'ACTIVE',
    submittedAt: '2022-01-01T00:00:00.000Z',
    rejectionReason: undefined,
  }
  return response
}

async function createProducerDelegation(payload: DelegationSeed) {
  // const response = await axiosInstance.post<CreatedResource>(
  //   `${BACKEND_FOR_FRONTEND_URL}/producer/delegations`,
  //   payload
  // )
  // return response.data

  console.log('TODO new delegation created with payload', payload)

  const response: CreatedResource = {
    id: 'id',
  }
  return response
}

async function approveProducerDelegation({ delegationId }: { delegationId: string }) {
  // return axiosInstance.post(
  //   `${BACKEND_FOR_FRONTEND_URL}/producer/delegations/${delegationId}/approve`
  // )

  return console.log('approve delegation with id', delegationId)
}

async function rejectProducerDelegation({
  delegationId,
  ...payload
}: { delegationId: string } & RejectDelegationPayload) {
  // return axiosInstance.post(
  //   `${BACKEND_FOR_FRONTEND_URL}/producer/delegations/${delegationId}/reject`
  // )

  return console.log('approve delegation with id', delegationId, 'and payload', payload)
}

async function revokeProducerDelegation({ delegationId }: { delegationId: string }) {
  // return axiosInstance.delete(`${BACKEND_FOR_FRONTEND_URL}/producer/delegations/${delegationId}`)

  return console.log('revoked delegation with id', delegationId)
}

export const DelegationServices = {
  getProducerDelegations,
  getSingle,
  createProducerDelegation,
  approveProducerDelegation,
  rejectProducerDelegation,
  revokeProducerDelegation,
}
