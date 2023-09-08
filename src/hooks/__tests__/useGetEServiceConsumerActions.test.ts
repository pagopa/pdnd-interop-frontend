import useGetEServiceConsumerActions from '../useGetEServiceConsumerActions'
import { mockUseJwt, renderHookWithApplicationContext } from '@/utils/testing.utils'
import type {
  CatalogEService,
  CatalogEServiceDescriptor,
  EServiceDescriptorState,
} from '@/api/api.generatedTypes'
import {
  createMockEServiceCatalog,
  createMockEServiceDescriptorCatalog,
} from '@/../__mocks__/data/eservice.mocks'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { act, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'

const server = setupServer(
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/agreements`, (_, res, ctx) => {
    return res(
      ctx.json({
        id: 'test-id',
      })
    )
  }),
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/agreements/:agreementId/submit`, (_, res, ctx) => {
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

function renderUseGetEServiceConsumerActionsHook(
  eserviceMock?: CatalogEService | CatalogEServiceDescriptor['eservice'],
  descriptorMock?: { id: string; state: EServiceDescriptorState; version: string }
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
  it('should return no actions if no e-service is passed', () => {
    mockUseJwt({ isAdmin: true })
    const { result } = renderUseGetEServiceConsumerActionsHook(
      undefined,
      createMockEServiceDescriptorCatalog()
    )
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return no actions if no descriptor is passed', () => {
    mockUseJwt({ isAdmin: true })
    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceCatalog(),
      undefined
    )
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the go to agreement action if the user has already an active agreement', async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'ACTIVE',
        canBeUpgraded: false,
      },
    })

    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      eserviceMock,
      createMockEServiceDescriptorCatalog()
    )
    expect(result.current.actions).toHaveLength(1)
    const goToAgreementAction = result.current.actions[0]!
    expect(goToAgreementAction.label).toBe('tableEServiceCatalog.goToRequestCta')

    goToAgreementAction.action()
    expect(history.location.pathname).toBe(`/it/fruizione/richieste/${eserviceMock.agreement?.id}`)
  })

  it('should return the go to agreement action if the user has already a draft agreement', async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'DRAFT',
        canBeUpgraded: false,
      },
    })

    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      eserviceMock,
      createMockEServiceDescriptorCatalog()
    )
    expect(result.current.actions).toHaveLength(1)
    const goToAgreementAction = result.current.actions[0]!
    expect(goToAgreementAction.label).toBe('tableEServiceCatalog.goToRequestCta')

    goToAgreementAction.action()
    expect(history.location.pathname).toBe(
      `/it/fruizione/richieste/${eserviceMock.agreement?.id}/modifica`
    )
  })

  it('should not return the go to agreement action if the user is not an admin', () => {
    mockUseJwt({ isAdmin: false })

    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'DRAFT',
        canBeUpgraded: false,
      },
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      eserviceMock,
      createMockEServiceDescriptorCatalog()
    )
    expect(result.current.actions).toHaveLength(0)
  })

  it("should return the create agreement draft action if the user doesn't have an active agreement", async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockEServiceCatalog({
      agreement: undefined,
      isMine: false,
    })

    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      eserviceMock,
      createMockEServiceDescriptorCatalog()
    )
    expect(result.current.actions).toHaveLength(1)
    const createAgreementDraftAction = result.current.actions[0]!
    expect(createAgreementDraftAction.label).toBe('tableEServiceCatalog.subscribe')

    act(() => {
      result.current.createAgreementDraftAction!()
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'confirmDialog.proceedLabel' })).toBeInTheDocument()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirmDialog.proceedLabel' }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toBe(`/it/fruizione/richieste/test-id/modifica`)
    })
  })

  it("should return the create agreement draft action if the user doesn't have an active agreement and the subscriber is the e-service provider", async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockEServiceCatalog({
      agreement: undefined,
      isMine: true,
    })

    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      eserviceMock,
      createMockEServiceDescriptorCatalog()
    )
    expect(result.current.actions).toHaveLength(1)
    const createAgreementDraftAction = result.current.actions[0]!
    expect(createAgreementDraftAction.label).toBe('tableEServiceCatalog.subscribe')

    act(() => {
      result.current.createAgreementDraftAction!()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    })

    await waitFor(() => {
      expect(screen.getByRole('progressbar', { hidden: true })).toBeInTheDocument()
    })

    await waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }), {
      timeout: 3 * 1000,
    })

    expect(history.location.pathname).toBe(`/it/fruizione/richieste/test-id`)
  })

  it('should not return the create agreement draft action if the user is not an admin', () => {
    mockUseJwt({ isAdmin: false })

    const eserviceMock = createMockEServiceCatalog({
      agreement: undefined,
      isMine: false,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      eserviceMock,
      createMockEServiceDescriptorCatalog()
    )
    expect(result.current.actions).toHaveLength(0)
  })
})
