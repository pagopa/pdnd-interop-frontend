import useGetEServiceConsumerActions from '../useGetEServiceConsumerActions'
import { mockUseJwt, renderHookWithApplicationContext } from '@/utils/testing.utils'
import type {
  CatalogEService,
  CatalogEServiceDescriptor,
  EServiceDescriptorState,
} from '@/api/api.generatedTypes'
import { createMockEServiceCatalog } from '__mocks__/data/eservice.mocks'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { act } from 'react-dom/test-utils'
import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'

mockUseJwt()

const server = setupServer(
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/agreements`, (_, res, ctx) => {
    return res(
      ctx.json({
        id: 'test-id',
      })
    )
  })
)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

function renderUseGetEServiceConsumerActionsHook<
  TDescriptor extends { id: string; state: EServiceDescriptorState; version: string }
>(
  eserviceMock?: CatalogEService | CatalogEServiceDescriptor['eservice'],
  descriptorMock?: TDescriptor
) {
  return renderHookWithApplicationContext(
    () => useGetEServiceConsumerActions(eserviceMock, descriptorMock),
    {
      withReactQueryContext: true,
      withRouterContext: true,
    }
  )
}

describe('useGetEServiceConsumerActions tests - actions', () => {
  it('should return no actions if there is no e-service', () => {
    const { result } = renderUseGetEServiceConsumerActionsHook()
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if has no descriptor passed', () => {
    const eserviceMock = createMockEServiceCatalog()
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('tableEServiceCatalog.subscribe')
  })

  it('should return the correct actions if eservice has agreement with state ACTIVE', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'ACTIVE',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('tableEServiceCatalog.goToRequestCta')
  })

  it('should return the correct actions if eservice has agreement with state ARCHIVED', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'ARCHIVED',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('tableEServiceCatalog.goToRequestCta')
  })

  it('should return the correct actions if eservice has agreement with state DRAFT', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'DRAFT',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('tableEServiceCatalog.goToRequestCta')
  })

  it('should return the correct actions if eservice has agreement with state MISSING_CERTIFIED_ATTRIBUTES', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'MISSING_CERTIFIED_ATTRIBUTES',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('tableEServiceCatalog.goToRequestCta')
  })

  it('should return the correct actions if eservice has agreement with state PENDING', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'PENDING',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('tableEServiceCatalog.goToRequestCta')
  })

  it('should return the correct actions if eservice has agreement with state REJECTED', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'REJECTED',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('tableEServiceCatalog.subscribe')
  })

  it('should return the correct actions if eservice has agreement with state SUSPENDED', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'SUSPENDED',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('tableEServiceCatalog.goToRequestCta')
  })
})

describe('useGetEServiceConsumerActions tests - canCreateAgreementDraft', () => {
  it('should return canCreateAgreementDraft false if there is not e-service', () => {
    const { result } = renderUseGetEServiceConsumerActionsHook()
    expect(result.current.canCreateAgreementDraft).toBe(false)
  })

  it('should return canCreateAgreementDraft true if eservice hasCertifiedAttributes is true, and has not agreement', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: false,
      agreement: undefined,
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.canCreateAgreementDraft).toBe(true)
  })

  it('should return canCreateAgreementDraft true if eservice isMine is true & hasCertifiedAttributes is false and had not agreement', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: false,
      isMine: true,
      agreement: undefined,
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.canCreateAgreementDraft).toBe(true)
  })

  it('should return canCreateAgreementDraft false if eservice isMine & hasCertifiedAttributes are false', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: false,
      isMine: false,
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.canCreateAgreementDraft).toBe(false)
  })

  it('should return canCreateAgreementDraft false if eservice has agreement with state ACTIVE', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: {
        id: 'test',
        state: 'ACTIVE',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.canCreateAgreementDraft).toBe(false)
  })

  it('should return canCreateAgreementDraft false if eservice has agreement with state ARCHIVED', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: {
        id: 'test',
        state: 'ARCHIVED',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.canCreateAgreementDraft).toBe(false)
  })

  it('should return canCreateAgreementDraft false if eservice has agreement with state DRAFT', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: {
        id: 'test',
        state: 'DRAFT',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.canCreateAgreementDraft).toBe(false)
  })

  it('should return canCreateAgreementDraft false if eservice has agreement with state MISSING_CERTIFIED_ATTRIBUTES', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: {
        id: 'test',
        state: 'MISSING_CERTIFIED_ATTRIBUTES',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.canCreateAgreementDraft).toBe(false)
  })

  it('should return canCreateAgreementDraft false if eservice has agreement with state PENDING', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: {
        id: 'test',
        state: 'PENDING',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.canCreateAgreementDraft).toBe(false)
  })

  it('should return canCreateAgreementDraft true if eservice has agreement with state REJECTED', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: {
        id: 'test',
        state: 'REJECTED',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.canCreateAgreementDraft).toBe(true)
  })

  it('should return canCreateAgreementDraft false if eservice has agreement with state SUSPENDED', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: {
        id: 'test',
        state: 'SUSPENDED',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.canCreateAgreementDraft).toBe(false)
  })

  it('should return canCreateAgreementDraft false if descriptor has state ARCHIVED', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: undefined,
    })
    const descriptorMock = {
      id: 'test-descriptor',
      state: 'ARCHIVED' as EServiceDescriptorState,
      version: '1',
    }
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock, descriptorMock)
    expect(result.current.canCreateAgreementDraft).toBe(false)
  })

  it('should return canCreateAgreementDraft false if descriptor has state DEPRECATED', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: undefined,
    })
    const descriptorMock = {
      id: 'test-descriptor',
      state: 'DEPRECATED' as EServiceDescriptorState,
      version: '1',
    }
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock, descriptorMock)
    expect(result.current.canCreateAgreementDraft).toBe(false)
  })

  it('should return canCreateAgreementDraft false if descriptor has state DRAFT', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: undefined,
    })
    const descriptorMock = {
      id: 'test-descriptor',
      state: 'DRAFT' as EServiceDescriptorState,
      version: '1',
    }
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock, descriptorMock)
    expect(result.current.canCreateAgreementDraft).toBe(false)
  })

  it('should return canCreateAgreementDraft true if descriptor has state PUBLISHED', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: undefined,
    })
    const descriptorMock = {
      id: 'test-descriptor',
      state: 'PUBLISHED' as EServiceDescriptorState,
      version: '1',
    }
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock, descriptorMock)
    expect(result.current.canCreateAgreementDraft).toBe(true)
  })

  it('should return canCreateAgreementDraft true if descriptor has state SUSPENDED', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: undefined,
    })
    const descriptorMock = {
      id: 'test-descriptor',
      state: 'SUSPENDED' as EServiceDescriptorState,
      version: '1',
    }
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock, descriptorMock)
    expect(result.current.canCreateAgreementDraft).toBe(true)
  })
})

describe('useGetEServiceConsumerActions tests - isMine', () => {
  it('should return false if eservice is undefined', () => {
    const { result } = renderUseGetEServiceConsumerActionsHook()
    expect(result.current.isMine).toBe(false)
  })

  it('should return false if eservice isMine is undefined', () => {
    const eserviceMock = createMockEServiceCatalog({
      isMine: undefined,
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.isMine).toBe(false)
  })

  it('should return false if eservice isMine is false', () => {
    const eserviceMock = createMockEServiceCatalog({
      isMine: false,
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.isMine).toBe(false)
  })

  it('should return true if eservice isMine is true', () => {
    const eserviceMock = createMockEServiceCatalog({
      isMine: true,
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.isMine).toBe(true)
  })
})

describe('useGetEServiceConsumerActions tests - isSubscribed', () => {
  it('should return false if eservice is undefined', () => {
    const { result } = renderUseGetEServiceConsumerActionsHook()
    expect(result.current.isSubscribed).toBe(false)
  })

  it('should return false if eservice agreement is undefined', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: undefined,
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.isSubscribed).toBe(false)
  })

  it('should return true if eservice agreement has state ACTIVE', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'ACTIVE',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.isSubscribed).toBe(true)
  })

  it('should return true if eservice agreement has state ARCHIVED', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'ARCHIVED',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.isSubscribed).toBe(true)
  })

  it('should return false if eservice agreement has state DRAFT', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'DRAFT',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.isSubscribed).toBe(false)
  })

  it('should return true if eservice agreement has state MISSING_CERTIFIED_ATTRIBUTES', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'MISSING_CERTIFIED_ATTRIBUTES',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.isSubscribed).toBe(true)
  })

  it('should return true if eservice agreement has state PENDING', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'PENDING',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.isSubscribed).toBe(true)
  })

  it('should return false if eservice agreement has state REJECTED', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'REJECTED',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.isSubscribed).toBe(false)
  })

  it('should return true if eservice agreement has state SUSPENDED', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'SUSPENDED',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.isSubscribed).toBe(true)
  })
})

describe('useGetEServiceConsumerActions tests - hasAgreementDraft', () => {
  it('should return false if eservice is undefined', () => {
    const { result } = renderUseGetEServiceConsumerActionsHook()
    expect(result.current.hasAgreementDraft).toBe(false)
  })

  it('should return false if eservice agreement is undefined', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: undefined,
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.hasAgreementDraft).toBe(false)
  })

  it('should return false if eservice agreement has state ACTIVE', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'ACTIVE',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.hasAgreementDraft).toBe(false)
  })

  it('should return false if eservice agreement has state ARCHIVED', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'ARCHIVED',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.hasAgreementDraft).toBe(false)
  })

  it('should return true if eservice agreement has state DRAFT', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'DRAFT',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.hasAgreementDraft).toBe(true)
  })

  it('should return false if eservice agreement has state MISSING_CERTIFIED_ATTRIBUTES', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'MISSING_CERTIFIED_ATTRIBUTES',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.hasAgreementDraft).toBe(false)
  })

  it('should return false if eservice agreement has state PENDING', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'PENDING',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.hasAgreementDraft).toBe(false)
  })

  it('should return false if eservice agreement has state REJECTED', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'REJECTED',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.hasAgreementDraft).toBe(false)
  })

  it('should return false if eservice agreement has state SUSPENDED', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'SUSPENDED',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.hasAgreementDraft).toBe(false)
  })
})

describe('useGetEServiceConsumerActions tests - createAgreementDraftAction', () => {
  it('should be undefined if eservice is undefined', () => {
    const { result } = renderUseGetEServiceConsumerActionsHook()
    expect(result.current.createAgreementDraftAction).not.toBeDefined()
  })

  it('should be defined if eservice is defined and hasCertifiedAttributes or isMine is true', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.createAgreementDraftAction).toBeDefined()
  })

  it('should be defined if eservice and descriptor are defined', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
    })
    const descriptorMock = {
      id: 'test-descriptor',
      state: 'SUSPENDED' as EServiceDescriptorState,
      version: '1',
    }
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock, descriptorMock)
    expect(result.current.createAgreementDraftAction).toBeDefined()
  })

  it('should doing nothing if eservice has hasCertifiedAttributes or isMine true and the descriptor is undefined', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: undefined,
    })
    const { result, history } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.createAgreementDraftAction).toBeDefined()

    result.current.createAgreementDraftAction!()
    expect(history.location.pathname).toBe(`/`)
  })

  it('should navigate correctly if eservice has hasCertifiedAttributes or isMine true and descriptor is defined', async () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: undefined,
    })
    const descriptorMock = {
      id: 'test-descriptor',
      state: 'SUSPENDED' as EServiceDescriptorState,
      version: '1',
    }
    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      eserviceMock,
      descriptorMock
    )
    expect(result.current.createAgreementDraftAction).toBeDefined()

    act(() => {
      result.current.createAgreementDraftAction!()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirmDialog.proceedLabel' }))
    })

    await waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))

    expect(history.location.pathname).toBe(`/it/fruizione/richieste/test-id/modifica`)
  })
})

describe('useGetEServiceConsumerActions tests - goToAgreementAction', () => {
  it('should be undefined is eservice is undefined', () => {
    const { result } = renderUseGetEServiceConsumerActionsHook()
    expect(result.current.goToAgreementAction).not.toBeDefined()
  })

  it('should be defined if eservice has agreement with state !== REJECTED', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: {
        id: 'test',
        state: 'DRAFT',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.goToAgreementAction).toBeDefined()
  })

  it('should be undefined if eservice has agreement with state === REJECTED', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: {
        id: 'test',
        state: 'REJECTED',
        canBeUpgraded: false,
      },
    })
    const { result } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.goToAgreementAction).not.toBeDefined()
  })

  it('should navigate correctly if eservice has agreement with state === DRAFT', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: {
        id: 'test',
        state: 'DRAFT',
        canBeUpgraded: false,
      },
    })
    const { result, history } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.goToAgreementAction).toBeDefined()

    result.current.goToAgreementAction!()
    expect(history.location.pathname).toBe(
      `/it/fruizione/richieste/${eserviceMock.agreement?.id}/modifica`
    )
  })

  it('should navigate correctly if eservice has agreement with state !== DRAFT', () => {
    const eserviceMock = createMockEServiceCatalog({
      hasCertifiedAttributes: true,
      isMine: true,
      agreement: {
        id: 'test',
        state: 'ACTIVE',
        canBeUpgraded: false,
      },
    })
    const { result, history } = renderUseGetEServiceConsumerActionsHook(eserviceMock)
    expect(result.current.goToAgreementAction).toBeDefined()

    result.current.goToAgreementAction!()
    expect(history.location.pathname).toBe(`/it/fruizione/richieste/${eserviceMock.agreement?.id}`)
  })
})
