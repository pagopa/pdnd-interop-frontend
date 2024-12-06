import { createMockEServiceProvider } from '@/../__mocks__/data/eservice.mocks'
import { useGetProviderEServiceActions } from '../useGetProviderEServiceActions'
import { mockUseJwt, renderHookWithApplicationContext } from '@/utils/testing.utils'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { act } from 'react-dom/test-utils'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import type { CompactDelegation, ProducerEService } from '@/api/api.generatedTypes'
import * as hooks from '@/hooks/useGetDelegationUserRole'

mockUseJwt({ isAdmin: true })

const mockUseGetDelegationUserRole = ({
  isDelegator = false,
  isDelegate = false,
  producerDelegations = [],
}: {
  isDelegator?: boolean
  isDelegate?: boolean
  producerDelegations?: CompactDelegation[]
}) => {
  vi.spyOn(hooks, 'useGetDelegationUserRole').mockReturnValue({
    isDelegator,
    isDelegate,
    producerDelegations,
  })
}

const server = setupServer(
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/ad474d35-7939-4bee-bde9-4e469cca1030/descriptors/test-1/clone`,
    (_, res, ctx) => {
      return res(
        ctx.json({
          id: '6dbb7416-8315-4970-a6be-393a03d0a79d',
          descriptorId: 'fd09a069-81f8-4cb5-a302-64320e83a033',
        })
      )
    }
  ),
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/ad474d35-7939-4bee-bde9-4e469cca1030/descriptors`,
    (_, res, ctx) => {
      return res(ctx.json({ id: 'test-id' }))
    }
  )
)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

function renderUseGetProviderEServiceTableActionsHook(descriptorMock: ProducerEService) {
  return renderHookWithApplicationContext(
    () =>
      useGetProviderEServiceActions(
        descriptorMock.id,
        descriptorMock.activeDescriptor?.state,
        descriptorMock.draftDescriptor?.state,
        descriptorMock.activeDescriptor?.id,
        descriptorMock.draftDescriptor?.id,
        descriptorMock.mode
      ),
    {
      withReactQueryContext: true,
      withRouterContext: true,
    }
  )
}

describe('useGetProviderEServiceTableActions tests', () => {
  it('should return the correct actions if the user is admin and e-service is DRAFT with no active descriptors', () => {
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'DRAFT', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('publishDraft')
    expect(result.current.actions[1].label).toBe('delete')
  })

  it('should not return actions if user is admin and delegator, e-service is DRAFT with no active descriptors', () => {
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'DRAFT', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if user is admin and delegate, e-service is DRAFT with no active descriptors', () => {
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'DRAFT', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('publishDraft')
  })

  it('should not return actions if user is admin and e-service is WAITING_FOR_APPROVAL with no active descriptors', () => {
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'WAITING_FOR_APPROVAL', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if user is admin and delegator, e-service is WAITING_FOR_APPROVAL with no active descriptors', () => {
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'WAITING_FOR_APPROVAL', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('approve')
    expect(result.current.actions[1].label).toBe('reject')
  })

  it('should not return actions if user is admin and delegate, e-service is WAITING_FOR_APPROVAL with no active descriptors', () => {
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'WAITING_FOR_APPROVAL', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should not return actions if user is admin and e-service is ARCHIVED', () => {
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should not return actions if user is admin and delegator, e-service is ARCHIVED', () => {
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should not return actions if user is admin and delegate, e-service is ARCHIVED', () => {
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if user is admin and e-service is DEPRECATED', () => {
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('should not return actions if user is admin and delegator, e-service is DEPRECATED', () => {
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if user is admin and delegate, e-service is DEPRECATED', () => {
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('should return the correct actions if user is admin and e-service is PUBLISHED with no draft descriptors', () => {
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('clone')
    expect(result.current.actions[1].label).toBe('createNewDraft')
    expect(result.current.actions[2].label).toBe('suspend')
  })

  it('should return the correct actions if user is admin and e-service is PUBLISHED with a draft descriptor in state DRAFT', () => {
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(4)
    expect(result.current.actions[0].label).toBe('clone')
    expect(result.current.actions[1].label).toBe('manageDraft')
    expect(result.current.actions[2].label).toBe('deleteDraft')
    expect(result.current.actions[3].label).toBe('suspend')
  })

  it('should not return actions if user is admin and delegator, e-service is PUBLISHED with no draft descriptors', () => {
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should not return actions if user is admin and delegator, e-service is PUBLISHED with a draft descriptor in state DRAFT', () => {
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if user is admin and delegator, e-service is PUBLISHED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('approve')
    expect(result.current.actions[1].label).toBe('reject')
  })

  it('should return the correct actions if user is admin and delegate, e-service is PUBLISHED with no draft descriptors', () => {
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('createNewDraft')
    expect(result.current.actions[1].label).toBe('suspend')
  })

  it('should return the correct actions if user is admin and delegate, e-service is PUBLISHED with a draft descriptor in state DRAFT', () => {
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('manageDraft')
    expect(result.current.actions[1].label).toBe('deleteDraft')
    expect(result.current.actions[2].label).toBe('suspend')
  })

  it('should return the correct actions if user is admin and delegate, e-service is PUBLISHED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('should return the correct actions if user is admin and e-service is SUSPENDED with no draft descriptors', () => {
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('activate')
    expect(result.current.actions[1].label).toBe('clone')
    expect(result.current.actions[2].label).toBe('createNewDraft')
  })

  it('should return the correct actions if user is admin and e-service is SUSPENDED with a draft descriptor in state DRAFT', () => {
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(4)
    expect(result.current.actions[0].label).toBe('activate')
    expect(result.current.actions[1].label).toBe('clone')
    expect(result.current.actions[2].label).toBe('manageDraft')
    expect(result.current.actions[3].label).toBe('deleteDraft')
  })

  it('should not return actions if user is admin and delegator, e-service is SUSPENDED with no draft descriptors', () => {
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should not return actions if user is admin and delegator, e-service is SUSPENDED with a draft descriptor in state DRAFT', () => {
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if user is admin and delegator, e-service is SUSPENDED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('approve')
    expect(result.current.actions[1].label).toBe('reject')
  })

  it('should return the correct actions if user is admin and delegate, e-service is SUSPENDED with no draft descriptors', () => {
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('activate')
    expect(result.current.actions[1].label).toBe('createNewDraft')
  })

  it('should return the correct actions if user is admin and delegate, e-service is SUSPENDED with a draft descriptor in state DRAFT', () => {
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('activate')
    expect(result.current.actions[1].label).toBe('manageDraft')
    expect(result.current.actions[2].label).toBe('deleteDraft')
  })

  it('should return the correct actions if user is admin and delegate, e-service is SUSPENDED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('activate')
  })

  it('should return the correct actions if user is an api operator and e-service is DRAFT with no active descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'DRAFT', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('publishDraft')
    expect(result.current.actions[1].label).toBe('delete')
  })

  it('should not return actions if user is an api operator and delegator, e-service is DRAFT with no active descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'DRAFT', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if user is an api operator and delegate, e-service is DRAFT with no active descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'DRAFT', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('publishDraft')
  })

  it('should not return actions if user is an api operator and e-service is WAITING_FOR_APPROVAL with no active descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'WAITING_FOR_APPROVAL', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if user is an api operator and delegator, e-service is WAITING_FOR_APPROVAL with no active descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'WAITING_FOR_APPROVAL', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('approve')
    expect(result.current.actions[1].label).toBe('reject')
  })

  it('should not return actions if user is an api operator and delegate, e-service is WAITING_FOR_APPROVAL with no active descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'WAITING_FOR_APPROVAL', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and e-service is ARCHIVED', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and delegator, e-service is ARCHIVED', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and delegate, e-service is ARCHIVED', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and e-service is DEPRECATED', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and delegator, e-service is DEPRECATED', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and delegate, e-service is DEPRECATED', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if user is an api operator and e-service is PUBLISHED with no draft descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('clone')
    expect(result.current.actions[1].label).toBe('createNewDraft')
  })

  it('should return the correct actions if user is an api operator and e-service is PUBLISHED with a draft descriptor in state DRAFT', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('clone')
    expect(result.current.actions[1].label).toBe('manageDraft')
    expect(result.current.actions[2].label).toBe('deleteDraft')
  })

  it('should not return actions if user is an api operator and delegator, e-service is PUBLISHED with no draft descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and delegator, e-service is PUBLISHED with a draft descriptor in state DRAFT', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if user is an api operator and delegator, e-service is PUBLISHED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('approve')
    expect(result.current.actions[1].label).toBe('reject')
  })

  it('should return the correct actions if user is an api operator and delegate, e-service is PUBLISHED with no draft descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('createNewDraft')
  })

  it('should return the correct actions if user is an api operator and delegate, e-service is PUBLISHED with a draft descriptor in state DRAFT', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('manageDraft')
    expect(result.current.actions[1].label).toBe('deleteDraft')
  })

  it('should not return actions if user is an api operator and delegate, e-service is PUBLISHED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if user is an api operator and e-service is SUSPENDED with no draft descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('clone')
    expect(result.current.actions[1].label).toBe('createNewDraft')
  })

  it('should return the correct actions if user is an api operator and e-service is SUSPENDED with a draft descriptor in state DRAFT', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('clone')
    expect(result.current.actions[1].label).toBe('manageDraft')
    expect(result.current.actions[2].label).toBe('deleteDraft')
  })

  it('should not return actions if user is an api operator and delegator, e-service is SUSPENDED with no draft descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and delegator, e-service is SUSPENDED with a draft descriptor in state DRAFT', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if user is an api operator and delegator, e-service is SUSPENDED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegator: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('approve')
    expect(result.current.actions[1].label).toBe('reject')
  })

  it('should return the correct actions if user is an api operator and delegate, e-service is SUSPENDED with no draft descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('createNewDraft')
  })

  it('should return the correct actions if user is an api operator and delegate, e-service is SUSPENDED with a draft descriptor in state DRAFT', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('manageDraft')
    expect(result.current.actions[1].label).toBe('deleteDraft')
  })

  it('should not return actions if user is an api operator and delegate, e-service is SUSPENDED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    mockUseGetDelegationUserRole({ isDelegate: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should navigate to PROVIDE_ESERVICE_EDIT page on clone action success', async () => {
    mockUseJwt({ isAdmin: true })
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result, history } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)

    const cloneAction = result.current.actions[1]

    expect(cloneAction.label).toBe('clone')

    act(() => {
      cloneAction.action()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toBe(
        '/it/erogazione/e-service/6dbb7416-8315-4970-a6be-393a03d0a79d/fd09a069-81f8-4cb5-a302-64320e83a033/modifica'
      )
    })
  })

  it('should navigate to PROVIDE_ESERVICE_EDIT page on create new draft action success', async () => {
    mockUseJwt({ isAdmin: true })
    mockUseGetDelegationUserRole({})
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
    })
    const { result, history } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)

    const cloneAction = result.current.actions[2]

    expect(cloneAction.label).toBe('createNewDraft')

    act(() => {
      cloneAction.action()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toBe(
        '/it/erogazione/e-service/ad474d35-7939-4bee-bde9-4e469cca1030/test-id/modifica'
      )
    })
  })

  it('should not return actions if the user is a security operator', () => {
    mockUseGetDelegationUserRole({})
    mockUseJwt({ isAdmin: false, isOperatorSecurity: true })

    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })
})
