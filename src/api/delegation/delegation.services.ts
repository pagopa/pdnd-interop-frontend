// TODO

import axiosInstance from '@/config/axios'
import { waitFor } from '@/utils/common.utils'
import type {
  CompactDelegations,
  CreatedResource,
  Delegation,
  DelegationSeed,
  GetDelegationsParams,
  RejectDelegationPayload,
} from '../api.generatedTypes'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type { FormParams } from '@/pages/DelegationCreatePage/components/DelegationCreateForm'
import { EServiceServices } from '../eservice'

async function getProducerDelegations(params: GetDelegationsParams) {
  // const response = await axiosInstance.get<CompactDelegations>(
  //   `${BACKEND_FOR_FRONTEND_URL}/producer/delegations`,
  //   { params }
  // )

  // return response.data

  const response: CompactDelegations = {
    results: [
      {
        delegate: {
          id: 'delegateId',
          name: 'PagoPA S.p.A.',
        },
        delegator: {
          id: 'delegatorId',
          name: 'delegatorName',
        },
        kind: 'DELEGATED_PRODUCER',
        eserviceName: 'eserviceName',
        id: 'id1',
        state: 'REJECTED',
      },
      {
        delegate: {
          id: 'delegateId',
          name: 'PagoPA S.p.A.',
        },
        delegator: {
          id: 'delegatorId',
          name: 'delegatorName',
        },
        kind: 'DELEGATED_PRODUCER',
        eserviceName: 'eserviceName',
        id: 'id2',
        state: 'REVOKED',
      },
      {
        delegate: {
          id: 'delegateId',
          name: 'PagoPA S.p.A.',
        },
        delegator: {
          id: 'delegatorId',
          name: 'delegatorName',
        },
        kind: 'DELEGATED_PRODUCER',
        eserviceName: 'eserviceName',
        id: 'id3',
        state: 'WAITING_FOR_APPROVAL',
      },
      {
        delegate: {
          id: 'delegateId',
          name: 'PagoPA S.p.A.',
        },
        delegator: {
          id: 'delegatorId',
          name: 'delegatorName',
        },
        kind: 'DELEGATED_PRODUCER',
        eserviceName: 'eserviceName',
        id: 'id4',
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
      name: 'PagoPA S.p.A.',
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
      producerId: 'producerId',
      producerName: 'producerName',
      descriptors: [
        {
          id: 'descriptorId',
          version: 'descriptorVersion',
          state: 'PUBLISHED',
          audience: ['test'],
        },
      ],
    },
    state: 'REJECTED',
    submittedAt: '2022-01-01T00:00:00.000Z',
    rejectionReason: undefined,
    kind: 'DELEGATED_PRODUCER',
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

async function createProducerDelegationAndEservice(params: FormParams) {
  const eserviceParams = {
    name: params.eserviceName,
    description: params.eserviceDescription,
    technology: params.eserviceTechnology,
    mode: params.eserviceMode,
  }
  const response = await EServiceServices.createDraft(eserviceParams)
  //!!! Temporary, in order to avoid eventual consistency issues.
  await waitFor(2000)
  const delegationParams = {
    eserviceId: response.id,
    delegateId: params.delegateId,
  }
  return await createProducerDelegation(delegationParams)
}

export const DelegationServices = {
  getProducerDelegations,
  getSingle,
  createProducerDelegation,
  approveProducerDelegation,
  rejectProducerDelegation,
  revokeProducerDelegation,
  downloadDelegationContract,
  createProducerDelegationAndEservice,
}
