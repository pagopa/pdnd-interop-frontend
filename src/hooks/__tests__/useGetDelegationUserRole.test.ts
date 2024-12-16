import type { Mock } from 'vitest'
import type { CompactDelegation } from '@/api/api.generatedTypes'

mockUseJwt({ isAdmin: true })

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQuery: vi.fn(),
  useQueries: vi.fn(),
}))

import { useQuery } from '@tanstack/react-query'
import { mockUseJwt } from '@/utils/testing.utils'
import { renderHook } from '@testing-library/react'
import { useGetDelegationUserRole } from '../useGetDelegationUserRole'

const mockUseGetProducerDelegationsList = (data: Array<CompactDelegation> | undefined) =>
  (useQuery as Mock).mockReturnValue({
    data,
  } as never)

describe('useGetDelegationUserRole tests', () => {
  it('should return the isDelegator true and isDelegate false if there is a delegation with the organization as delegator', () => {
    mockUseGetProducerDelegationsList([
      {
        id: '1',
        delegator: { id: 'organizationId', name: 'delegator' },
        delegate: { id: 'delegateId', name: 'delegate' },
        state: 'ACTIVE',
        kind: 'DELEGATED_PRODUCER',
        eservice: { id: 'eserviceId', name: 'eservice' },
      },
    ])
    const { result } = renderHook(() =>
      useGetDelegationUserRole({ eserviceId: 'eserviceId', organizationId: 'organizationId' })
    )
    expect(result.current.isDelegator).toBe(true)
    expect(result.current.isDelegate).toBe(false)
    expect(result.current.producerDelegations?.length).toBe(1)
  })

  it('should return the isDelegator false and isDelegate true if there is a delegation with the organization as delegate', () => {
    mockUseGetProducerDelegationsList([
      {
        id: '1',
        delegator: { id: 'delegatorId', name: 'delegator' },
        delegate: { id: 'organizationId', name: 'delegate' },
        state: 'ACTIVE',
        kind: 'DELEGATED_PRODUCER',
        eservice: { id: 'eserviceId', name: 'eservice' },
      },
    ])
    const { result } = renderHook(() =>
      useGetDelegationUserRole({ eserviceId: 'eserviceId', organizationId: 'organizationId' })
    )
    expect(result.current.isDelegator).toBe(false)
    expect(result.current.isDelegate).toBe(true)
    expect(result.current.producerDelegations?.length).toBe(1)
  })

  it('should return the isDelegator false and isDelegate false if there are no delegations for the eservice', () => {
    mockUseGetProducerDelegationsList([])
    const { result } = renderHook(() =>
      useGetDelegationUserRole({ eserviceId: 'eserviceId', organizationId: 'organizationId' })
    )
    expect(result.current.isDelegator).toBe(false)
    expect(result.current.isDelegate).toBe(false)
    expect(result.current.producerDelegations?.length).toBe(0)
  })
})
