import { createMockEServiceProvider } from '@/../__mocks__/data/eservice.mocks'
import { createMockDelegationWithCompactTenants } from '@/../__mocks__/data/delegation.mocks'
import { useGetProviderEServiceActions } from '../useGetProviderEServiceActions'
import { mockUseJwt, renderHookWithApplicationContext } from '@/utils/testing.utils'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { act } from 'react-dom/test-utils'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import type { ArchivingSchedule, ProducerEService } from '@/api/api.generatedTypes'

mockUseJwt({ isAdmin: true })

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
        descriptorMock.mode,
        descriptorMock.name,
        descriptorMock.isNewTemplateVersionAvailable ?? false,
        descriptorMock.isTemplateInstance,
        descriptorMock.delegation
      ),
    {
      withReactQueryContext: true,
      withRouterContext: true,
    }
  )
}

describe('useGetProviderEServiceTableActions tests', () => {
  it('should return the correct actions if the user is admin and e-service is DRAFT with no active descriptors', () => {
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'DRAFT', version: '1' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(1)
    expect(result.current.menuActions[0].label).toBe('delete')
  })

  it('should not return actions if user is admin and delegator, e-service is DRAFT with no active descriptors', () => {
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'DRAFT', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should return the correct actions if user is admin and delegate, e-service is DRAFT with no active descriptors', () => {
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'DRAFT', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is admin and e-service is WAITING_FOR_APPROVAL with no active descriptors', () => {
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'WAITING_FOR_APPROVAL', version: '1' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should return the correct actions if user is admin and delegator, e-service is WAITING_FOR_APPROVAL with no active descriptors', () => {
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'WAITING_FOR_APPROVAL', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(2)
    expect(result.current.menuActions[0].label).toBe('approve')
    expect(result.current.menuActions[1].label).toBe('reject')
  })

  it('should not return actions if user is admin and delegate, e-service is WAITING_FOR_APPROVAL with no active descriptors', () => {
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'WAITING_FOR_APPROVAL', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is admin and e-service is ARCHIVED', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is admin and delegator, e-service is ARCHIVED', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is admin and delegate, e-service is ARCHIVED', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should return the correct actions if user is admin and e-service is DEPRECATED', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(1)
    expect(result.current.menuActions[0].label).toBe('suspendVersion')
  })

  it('should not return actions if user is admin and delegator, e-service is DEPRECATED', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should return the correct actions if user is admin and delegate, e-service is DEPRECATED', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(1)
    expect(result.current.menuActions[0].label).toBe('suspendVersion')
  })

  it('should return the correct actions if user is admin and e-service is PUBLISHED with no draft descriptors', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(3)
    expect(result.current.menuActions[0].label).toBe('cloneEservice')
    expect(result.current.menuActions[1].label).toBe('createNewVersion')
    expect(result.current.menuActions[2].label).toBe('suspendVersion')
  })

  it('should return the correct actions if user is admin and e-service is PUBLISHED with a draft descriptor in state DRAFT', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(4)
    expect(result.current.menuActions[0].label).toBe('cloneEservice')
    expect(result.current.menuActions[1].label).toBe('manageDraft')
    expect(result.current.menuActions[2].label).toBe('deleteDraft')
    expect(result.current.menuActions[3].label).toBe('suspendVersion')
  })

  it('should not return actions if user is admin and delegator, e-service is PUBLISHED with no draft descriptors', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is admin and delegator, e-service is PUBLISHED with a draft descriptor in state DRAFT', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(1)
    expect(result.current.menuActions[0].label).toBe('manageDraft')
  })

  it('should return the correct actions if user is admin and delegator, e-service is PUBLISHED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(1)
    expect(result.current.menuActions[0].label).toBe('manageDraft')
  })

  it('should return the correct actions if user is admin and delegate, e-service is PUBLISHED with no draft descriptors', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(2)
    expect(result.current.menuActions[0].label).toBe('createNewVersion')
    expect(result.current.menuActions[1].label).toBe('suspendVersion')
  })

  it('should return the correct actions if user is admin and delegate, e-service is PUBLISHED with a draft descriptor in state DRAFT', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(3)
    expect(result.current.menuActions[0].label).toBe('manageDraft')
    expect(result.current.menuActions[1].label).toBe('deleteDraft')
    expect(result.current.menuActions[2].label).toBe('suspendVersion')
  })

  it('should return the correct actions if user is admin and delegate, e-service is PUBLISHED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(1)
    expect(result.current.menuActions[0].label).toBe('suspendVersion')
  })

  it('should return the correct actions if user is admin and e-service is SUSPENDED with no draft descriptors', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(3)
    expect(result.current.menuActions[0].label).toBe('reactivateVersion')
    expect(result.current.menuActions[1].label).toBe('cloneEservice')
    expect(result.current.menuActions[2].label).toBe('createNewVersion')
  })

  it('should return the correct actions if user is admin and e-service is SUSPENDED with a draft descriptor in state DRAFT', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(4)
    expect(result.current.menuActions[0].label).toBe('reactivateVersion')
    expect(result.current.menuActions[1].label).toBe('cloneEservice')
    expect(result.current.menuActions[2].label).toBe('manageDraft')
    expect(result.current.menuActions[3].label).toBe('deleteDraft')
  })

  it('should not return actions if user is admin and delegator, e-service is SUSPENDED with no draft descriptors', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is admin and delegator, e-service is SUSPENDED with a draft descriptor in state DRAFT', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should return the correct actions if user is admin and delegator, e-service is SUSPENDED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(1)
    expect(result.current.menuActions[0].label).toBe('manageDraft')
  })

  it('should return the correct actions if user is admin and delegate, e-service is SUSPENDED with no draft descriptors', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(2)
    expect(result.current.menuActions[0].label).toBe('reactivateVersion')
    expect(result.current.menuActions[1].label).toBe('createNewVersion')
  })

  it('should return the correct actions if user is admin and delegate, e-service is SUSPENDED with a draft descriptor in state DRAFT', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(3)
    expect(result.current.menuActions[0].label).toBe('reactivateVersion')
    expect(result.current.menuActions[1].label).toBe('manageDraft')
    expect(result.current.menuActions[2].label).toBe('deleteDraft')
  })

  it('should return the correct actions if user is admin and delegate, e-service is SUSPENDED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(1)
    expect(result.current.menuActions[0].label).toBe('reactivateVersion')
  })

  it('should return the correct actions if user is an api operator and e-service is DRAFT with no active descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'DRAFT', version: '1' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(1)
    expect(result.current.menuActions[0].label).toBe('delete')
  })

  it('should not return actions if user is an api operator and delegator, e-service is DRAFT with no active descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'DRAFT', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should return the correct actions if user is an api operator and delegate, e-service is DRAFT with no active descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'DRAFT', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and e-service is WAITING_FOR_APPROVAL with no active descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'WAITING_FOR_APPROVAL', version: '1' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should return the correct actions if user is an api operator and delegator, e-service is WAITING_FOR_APPROVAL with no active descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'WAITING_FOR_APPROVAL', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(2)
    expect(result.current.menuActions[0].label).toBe('approve')
    expect(result.current.menuActions[1].label).toBe('reject')
  })

  it('should not return actions if user is an api operator and delegate, e-service is WAITING_FOR_APPROVAL with no active descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'WAITING_FOR_APPROVAL', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and e-service is ARCHIVED', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and delegator, e-service is ARCHIVED', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and delegate, e-service is ARCHIVED', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and e-service is DEPRECATED', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and delegator, e-service is DEPRECATED', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and delegate, e-service is DEPRECATED', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should return the correct actions if user is an api operator and e-service is PUBLISHED with no draft descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(3)
    expect(result.current.menuActions[0].label).toBe('cloneEservice')
    expect(result.current.menuActions[1].label).toBe('createNewVersion')
    expect(result.current.menuActions[2].label).toBe('suspendVersion')
  })

  it('should return the correct actions if user is an api operator and e-service is PUBLISHED with a draft descriptor in state DRAFT', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(4)
    expect(result.current.menuActions[0].label).toBe('cloneEservice')
    expect(result.current.menuActions[1].label).toBe('manageDraft')
    expect(result.current.menuActions[2].label).toBe('deleteDraft')
    expect(result.current.menuActions[3].label).toBe('suspendVersion')
  })

  it('should not return actions if user is an api operator and delegator, e-service is PUBLISHED with no draft descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and delegator, e-service is PUBLISHED with a draft descriptor in state DRAFT', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(1)
    expect(result.current.menuActions[0].label).toBe('manageDraft')
  })

  it('should return the correct actions if user is an api operator and delegator, e-service is PUBLISHED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(1)
    expect(result.current.menuActions[0].label).toBe('manageDraft')
  })

  it('should return the correct actions if user is an api operator and delegate, e-service is PUBLISHED with no draft descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(2)
    expect(result.current.menuActions[0].label).toBe('createNewVersion')
    expect(result.current.menuActions[1].label).toBe('suspendVersion')
  })

  it('should return the correct actions if user is an api operator and delegate, e-service is PUBLISHED with a draft descriptor in state DRAFT', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(3)
    expect(result.current.menuActions[0].label).toBe('manageDraft')
    expect(result.current.menuActions[1].label).toBe('deleteDraft')
    expect(result.current.menuActions[2].label).toBe('suspendVersion')
  })

  it('should return the correct actions if user is an api operator and delegate, e-service is PUBLISHED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(1)
    expect(result.current.menuActions[0].label).toBe('suspendVersion')
  })

  it('should return suspend action if user is an api operator and template instance e-service is PUBLISHED', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      isTemplateInstance: true,
      isNewTemplateVersionAvailable: false,
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions.map((a) => a.label)).toContain('suspendVersion')
  })

  it('should return the correct actions if user is an api operator and e-service is SUSPENDED with no draft descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(3)
    expect(result.current.menuActions[0].label).toBe('reactivateVersion')
    expect(result.current.menuActions[1].label).toBe('cloneEservice')
    expect(result.current.menuActions[2].label).toBe('createNewVersion')
  })

  it('should return the correct actions if user is an api operator and e-service is SUSPENDED with a draft descriptor in state DRAFT', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(4)
    expect(result.current.menuActions[0].label).toBe('reactivateVersion')
    expect(result.current.menuActions[1].label).toBe('cloneEservice')
    expect(result.current.menuActions[2].label).toBe('manageDraft')
    expect(result.current.menuActions[3].label).toBe('deleteDraft')
  })

  it('should not return actions if user is an api operator and delegator, e-service is SUSPENDED with no draft descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should not return actions if user is an api operator and delegator, e-service is SUSPENDED with a draft descriptor in state DRAFT', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should return the correct actions if user is an api operator and delegator, e-service is SUSPENDED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(1)
    expect(result.current.menuActions[0].label).toBe('manageDraft')
  })

  it('should return the correct actions if user is an api operator and delegate, e-service is SUSPENDED with no draft descriptors', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(2)
    expect(result.current.menuActions[0].label).toBe('reactivateVersion')
    expect(result.current.menuActions[1].label).toBe('createNewVersion')
  })

  it('should return the correct actions if user is an api operator and delegate, e-service is SUSPENDED with a draft descriptor in state DRAFT', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(3)
    expect(result.current.menuActions[0].label).toBe('reactivateVersion')
    expect(result.current.menuActions[1].label).toBe('manageDraft')
    expect(result.current.menuActions[2].label).toBe('deleteDraft')
  })

  it('should return the correct actions if user is an api operator and delegate, e-service is SUSPENDED with a draft descriptor in state WAITING_FOR_APPROVAL', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'WAITING_FOR_APPROVAL', version: '2' },
      delegation: createMockDelegationWithCompactTenants({
        delegate: {
          id: 'organizationId',
          name: 'delegator-name',
        },
      }),
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(1)
    expect(result.current.menuActions[0].label).toBe('reactivateVersion')
  })

  it('should return reactivate action if user is an api operator and template instance e-service is SUSPENDED', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      isTemplateInstance: true,
      isNewTemplateVersionAvailable: false,
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions.map((a) => a.label)).toContain('reactivateVersion')
  })

  it('should navigate to PROVIDE_ESERVICE_EDIT page on clone action success', async () => {
    mockUseJwt({ isAdmin: true })
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
      delegation: undefined,
    })
    const { result, history } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)

    const cloneAction = result.current.menuActions[1]

    expect(cloneAction.label).toBe('cloneEservice')

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
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      delegation: undefined,
    })
    const { result, history } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)

    const cloneAction = result.current.menuActions[2]

    expect(cloneAction.label).toBe('createNewVersion')

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
    mockUseJwt({ isAdmin: false, isOperatorSecurity: true })

    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.menuActions).toHaveLength(0)
  })
})

function renderDetailsPageHook(
  descriptorMock: ProducerEService,
  options: {
    archivingSchedule?: ArchivingSchedule
    latestDescriptorId?: string
    isActiveDescriptor?: boolean
    isEServiceBeingArchived?: boolean
    hasMultipleVersions?: boolean
  } = {}
) {
  const hasMultipleVersions = options.hasMultipleVersions ?? true
  return renderHookWithApplicationContext(
    () =>
      useGetProviderEServiceActions(
        descriptorMock.id,
        descriptorMock.activeDescriptor?.state,
        descriptorMock.draftDescriptor?.state,
        descriptorMock.activeDescriptor?.id,
        descriptorMock.draftDescriptor?.id,
        descriptorMock.mode,
        descriptorMock.name,
        descriptorMock.isNewTemplateVersionAvailable ?? false,
        descriptorMock.isTemplateInstance,
        descriptorMock.delegation,
        undefined,
        'detailsPage',
        options.archivingSchedule,
        options.latestDescriptorId,
        hasMultipleVersions ? () => {} : undefined,
        options.isActiveDescriptor,
        options.isEServiceBeingArchived
      ),
    {
      withReactQueryContext: true,
      withRouterContext: true,
    }
  )
}

describe('useGetProviderEServiceActions slot split (where=detailsPage, admin happy path)', () => {
  beforeEach(() => {
    mockUseJwt({ isAdmin: true })
  })

  it('PUBLISHED: suspend and createNewVersion in header, clone+archiveEservice+viewAllVersions in menu, no primary', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock)
    expect(result.current.primaryAction).toBeUndefined()
    expect(result.current.secondaryAction).toBeUndefined()
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual([
      'suspendVersion',
      'createNewVersion',
    ])
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'cloneEservice',
      'archiveEservice',
      'viewAllVersions',
    ])
  })

  it('viewAllVersions is omitted when the caller passes no onViewAllVersions (e-service with a single version)', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, { hasMultipleVersions: false })
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'cloneEservice',
      'archiveEservice',
    ])
  })

  it('DEPRECATED: suspend and archiveVersion in header, createNewVersion+clone+archiveEservice+viewAllVersions in menu', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock)
    expect(result.current.primaryAction).toBeUndefined()
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual([
      'suspendVersion',
      'archiveVersion',
    ])
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'createNewVersion',
      'cloneEservice',
      'archiveEservice',
      'viewAllVersions',
    ])
  })

  it('SUSPENDED on the active descriptor: reactivate and createNewVersion in header, clone+archiveEservice+viewAllVersions in menu (active version is never archivable as single descriptor)', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, { isActiveDescriptor: true })
    expect(result.current.primaryAction).toBeUndefined()
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual([
      'reactivateVersion',
      'createNewVersion',
    ])
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'cloneEservice',
      'archiveEservice',
      'viewAllVersions',
    ])
  })

  it('SUSPENDED on a non-active descriptor (e.g. suspended deprecated): reactivate and archiveVersion in header, full menu', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, { isActiveDescriptor: false })
    expect(result.current.primaryAction).toBeUndefined()
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual([
      'reactivateVersion',
      'archiveVersion',
    ])
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'createNewVersion',
      'cloneEservice',
      'archiveEservice',
      'viewAllVersions',
    ])
  })

  it('ARCHIVED with a newer descriptor (e-service still active): viewLatestVersion in header, full menu with createNewVersion+archiveEservice', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, { latestDescriptorId: 'newer-id' })
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual(['viewLatestVersion'])
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'createNewVersion',
      'cloneEservice',
      'archiveEservice',
      'viewAllVersions',
    ])
  })

  it('ARCHIVED with no newer descriptor (whole e-service archived): no header actions, clone+viewAllVersions in menu', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock)
    expect(result.current.headerInfoActions).toHaveLength(0)
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'cloneEservice',
      'viewAllVersions',
    ])
  })

  it('ARCHIVING with DESCRIPTOR scope: suspend and cancelArchivingVersion in header, no primary', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVING', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, {
      archivingSchedule: { scope: 'DESCRIPTOR' },
    })
    expect(result.current.primaryAction).toBeUndefined()
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual([
      'suspendVersion',
      'cancelArchivingVersion',
    ])
  })

  it('ARCHIVING with ESERVICE scope: cancelArchivingEservice as primary, only suspend in header', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVING', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, {
      archivingSchedule: { scope: 'ESERVICE' },
    })
    expect(result.current.primaryAction?.label).toBe('cancelArchivingEservice')
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual(['suspendVersion'])
  })

  it('ARCHIVING_SUSPENDED with DESCRIPTOR scope: reactivate and cancelArchivingVersion in header', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVING_SUSPENDED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, {
      archivingSchedule: { scope: 'DESCRIPTOR' },
    })
    expect(result.current.primaryAction).toBeUndefined()
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual([
      'reactivateVersion',
      'cancelArchivingVersion',
    ])
  })

  it('ARCHIVING_SUSPENDED with ESERVICE scope: cancelArchivingEservice as primary, only reactivate in header', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVING_SUSPENDED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, {
      archivingSchedule: { scope: 'ESERVICE' },
    })
    expect(result.current.primaryAction?.label).toBe('cancelArchivingEservice')
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual(['reactivateVersion'])
  })

  it('ARCHIVING DESCRIPTOR: header has suspend+cancelArchivingVersion, menu has createNewVersion+clone+archiveEservice+viewAllVersions', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVING', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, {
      archivingSchedule: { scope: 'DESCRIPTOR' },
    })
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'createNewVersion',
      'cloneEservice',
      'archiveEservice',
      'viewAllVersions',
    ])
  })

  it('ARCHIVING_SUSPENDED DESCRIPTOR: same 4-item menu as ARCHIVING', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVING_SUSPENDED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, {
      archivingSchedule: { scope: 'DESCRIPTOR' },
    })
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'createNewVersion',
      'cloneEservice',
      'archiveEservice',
      'viewAllVersions',
    ])
  })

  it('ARCHIVING ESERVICE: menu is reduced to clone+viewAllVersions (no archive/new-version while the whole e-service is archiving)', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVING', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, {
      archivingSchedule: { scope: 'ESERVICE' },
    })
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'cloneEservice',
      'viewAllVersions',
    ])
  })

  it('ARCHIVING_SUSPENDED ESERVICE: menu is reduced to clone+viewAllVersions (same as ARCHIVING ESERVICE)', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVING_SUSPENDED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, {
      archivingSchedule: { scope: 'ESERVICE' },
    })
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'cloneEservice',
      'viewAllVersions',
    ])
  })

  it('ARCHIVING + DESCRIPTOR + isActiveDescriptor=true: unreachable per SRS, layout is empty (defensive)', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVING', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, {
      archivingSchedule: { scope: 'DESCRIPTOR' },
      isActiveDescriptor: true,
    })
    expect(result.current.primaryAction).toBeUndefined()
    expect(result.current.headerInfoActions).toHaveLength(0)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('ARCHIVING_SUSPENDED + DESCRIPTOR + isActiveDescriptor=true: unreachable per SRS, layout is empty (defensive)', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVING_SUSPENDED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, {
      archivingSchedule: { scope: 'DESCRIPTOR' },
      isActiveDescriptor: true,
    })
    expect(result.current.primaryAction).toBeUndefined()
    expect(result.current.headerInfoActions).toHaveLength(0)
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('DEPRECATED with isEServiceBeingArchived=true: menu collapses, no createNewVersion and no archiveEservice', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, {
      isEServiceBeingArchived: true,
    })
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'cloneEservice',
      'viewAllVersions',
    ])
  })

  it('ARCHIVING + DESCRIPTOR (non-active) with isEServiceBeingArchived=true: cancelArchivingEservice as primary, header keeps cancelArchivingVersion, menu collapses', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVING', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, {
      archivingSchedule: { scope: 'DESCRIPTOR' },
      isActiveDescriptor: false,
      isEServiceBeingArchived: true,
    })
    expect(result.current.primaryAction?.label).toBe('cancelArchivingEservice')
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual([
      'suspendVersion',
      'cancelArchivingVersion',
    ])
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'cloneEservice',
      'viewAllVersions',
    ])
  })

  it('ARCHIVING_SUSPENDED + DESCRIPTOR (non-active) with isEServiceBeingArchived=true: cancelArchivingEservice as primary, header keeps cancelArchivingVersion, menu collapses', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVING_SUSPENDED', version: '1' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, {
      archivingSchedule: { scope: 'DESCRIPTOR' },
      isActiveDescriptor: false,
      isEServiceBeingArchived: true,
    })
    expect(result.current.primaryAction?.label).toBe('cancelArchivingEservice')
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual([
      'reactivateVersion',
      'cancelArchivingVersion',
    ])
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'cloneEservice',
      'viewAllVersions',
    ])
  })
})

describe('useGetProviderEServiceActions slot split with an existing version draft (where=detailsPage, admin happy path)', () => {
  beforeEach(() => {
    mockUseJwt({ isAdmin: true })
  })

  it('PUBLISHED + draft: stays in happy path, manageDraft replaces createNewVersion in header, menu unchanged', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'draft-1', state: 'DRAFT', version: '2' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock)
    expect(result.current.primaryAction).toBeUndefined()
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual([
      'suspendVersion',
      'manageDraft',
    ])
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'cloneEservice',
      'archiveEservice',
      'viewAllVersions',
    ])
  })

  it('DEPRECATED + draft: header keeps suspend+archiveVersion, manageDraft replaces createNewVersion in menu (4 items, no deleteDraft)', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
      draftDescriptor: { id: 'draft-1', state: 'DRAFT', version: '2' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock)
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual([
      'suspendVersion',
      'archiveVersion',
    ])
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'manageDraft',
      'cloneEservice',
      'archiveEservice',
      'viewAllVersions',
    ])
  })

  it('SUSPENDED on the active descriptor + draft: manageDraft replaces createNewVersion in header', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'draft-1', state: 'DRAFT', version: '2' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, { isActiveDescriptor: true })
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual([
      'reactivateVersion',
      'manageDraft',
    ])
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'cloneEservice',
      'archiveEservice',
      'viewAllVersions',
    ])
  })

  it('ARCHIVED with a newer descriptor (e-service still active) + draft: manageDraft replaces createNewVersion in the menu', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
      draftDescriptor: { id: 'draft-1', state: 'DRAFT', version: '2' },
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock, { latestDescriptorId: 'newer-id' })
    expect(result.current.headerInfoActions.map((a) => a.label)).toEqual(['viewLatestVersion'])
    expect(result.current.menuActions.map((a) => a.label)).toEqual([
      'manageDraft',
      'cloneEservice',
      'archiveEservice',
      'viewAllVersions',
    ])
  })
})

describe('useGetProviderEServiceActions slot split bypass (preserve legacy behavior)', () => {
  beforeEach(() => {
    mockUseJwt({ isAdmin: true })
  })

  it('PUBLISHED + delegator: no slot split, only viewAllVersions in menu', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      delegation: createMockDelegationWithCompactTenants({
        delegator: { id: 'organizationId', name: 'delegator-name' },
      }),
    })
    const { result } = renderDetailsPageHook(descriptorMock)
    expect(result.current.primaryAction).toBeUndefined()
    expect(result.current.headerInfoActions).toHaveLength(0)
    expect(result.current.menuActions.map((a) => a.label)).toEqual(['viewAllVersions'])
  })

  it('PUBLISHED + template instance: no slot split, template menu preserved', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      isTemplateInstance: true,
      delegation: undefined,
    })
    const { result } = renderDetailsPageHook(descriptorMock)
    expect(result.current.primaryAction).toBeUndefined()
    expect(result.current.headerInfoActions).toHaveLength(0)
    expect(result.current.menuActions.length).toBeGreaterThan(0)
  })
})
