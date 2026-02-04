import useGetEServiceConsumerActions from '../useGetEServiceConsumerActions'
import { mockUseJwt, renderHookWithApplicationContext } from '@/utils/testing.utils'
import { type CatalogEServiceDescriptor, type DelegationTenant } from '@/api/api.generatedTypes'
import {
  createMockCatalogDescriptorEService,
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
  descriptorMock?: CatalogEServiceDescriptor,
  delegatorsMock?: Array<DelegationTenant>,
  isDelegatorMock?: boolean
) {
  return renderHookWithApplicationContext(
    () => useGetEServiceConsumerActions(descriptorMock, delegatorsMock, isDelegatorMock),
    {
      withReactQueryContext: true,
      withRouterContext: true,
    }
  )
}

describe('useGetEServiceConsumerActions tests - actions', () => {
  it('should return no actions if no descriptor is passed', () => {
    mockUseJwt({ isAdmin: true })
    const { result } = renderUseGetEServiceConsumerActionsHook(undefined)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return inspect agreement action if the user has just an agreement with state ACTIVE, SUSPENDED or PENDING', async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [
        {
          id: 'test',
          state: 'ACTIVE',
          canBeUpgraded: false,
          consumerId: 'organizationId',
        },
      ],
      isSubscribed: true,
    })

    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )
    expect(result.current.actions).toHaveLength(1)
    const goToAgreementAction = result.current.actions[0]!
    expect(goToAgreementAction.label).toBe('tableEServiceCatalog.inspect')

    goToAgreementAction.action()
    expect(history.location.pathname).toBe(
      `/it/fruizione/richieste/${eserviceMock.agreements[0]?.id}`
    )
  })

  it('should open the dialog for selecting the tenant before inspect agreement if the user has more than one agreement with state ACTIVE, SUSPENDED or PENDING', async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [
        {
          id: 'test',
          state: 'ACTIVE',
          canBeUpgraded: false,
          consumerId: 'organizationId',
        },
        {
          id: 'test-2',
          state: 'SUSPENDED',
          canBeUpgraded: false,
          consumerId: 'delegator-id',
        },
      ],
      isSubscribed: true,
    })

    const delegatorsMock: Array<DelegationTenant> = [{ id: 'delegator-id', name: 'Delegator Name' }]

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock }),
      delegatorsMock,
      false
    )

    expect(result.current.actions).toHaveLength(1)
    const goToAgreementAction = result.current.actions[0]!
    expect(goToAgreementAction.label).toBe('tableEServiceCatalog.inspect')

    act(() => {
      goToAgreementAction.action()
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'actions.inspect' })).toBeInTheDocument()
    })
  })

  it('should return the edit agreement action if the user has one agreement with state DRAFT', async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [
        {
          id: 'test',
          state: 'DRAFT',
          canBeUpgraded: false,
          consumerId: 'organizationId',
        },
      ],
    })

    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )
    expect(result.current.actions).toHaveLength(1)
    const goToAgreementAction = result.current.actions[0]!
    expect(goToAgreementAction.label).toBe('tableEServiceCatalog.editDraft')

    goToAgreementAction.action()
    expect(history.location.pathname).toBe(
      `/it/fruizione/richieste/${eserviceMock.agreements[0]?.id}/modifica`
    )
  })

  it('should open the dialog for selecting the tenant before edit agreement if agreements with state DRAFT are more than one', async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [
        {
          id: 'test',
          state: 'DRAFT',
          canBeUpgraded: false,
          consumerId: 'organizationId',
        },
        {
          id: 'test-2',
          state: 'DRAFT',
          canBeUpgraded: false,
          consumerId: 'delegator-id',
        },
      ],
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )
    expect(result.current.actions).toHaveLength(1)
    const goToAgreementEditAction = result.current.actions[0]!
    expect(goToAgreementEditAction.label).toBe('tableEServiceCatalog.editDraft')

    act(() => {
      goToAgreementEditAction.action()
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'actions.edit' })).toBeInTheDocument()
    })
  })

  it('should not return any action if the user is not an admin', () => {
    mockUseJwt({ isAdmin: false })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [
        {
          id: 'test',
          state: 'DRAFT',
          canBeUpgraded: false,
          consumerId: 'consumer-id',
        },
      ],
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )
    expect(result.current.actions).toHaveLength(0)
  })

  it("should return the create agreement draft action if the user doesn't have agreements", async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: false,
      hasCertifiedAttributes: true,
    })

    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )
    expect(result.current.actions).toHaveLength(1)
    const createAgreementDraftAction = result.current.actions[0]!
    expect(createAgreementDraftAction.label).toBe('tableEServiceCatalog.subscribe')

    act(() => {
      createAgreementDraftAction.action()
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

  it('should return the create agreement draft action if the user have only agreements with state ARCHIVED', async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [
        {
          id: 'agreement-id',
          state: 'ARCHIVED',
          consumerId: 'organizationId',
          canBeUpgraded: false,
        },
      ],
      isMine: false,
      hasCertifiedAttributes: true,
    })

    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )
    expect(result.current.actions).toHaveLength(1)
    const createAgreementDraftAction = result.current.actions[0]!
    expect(createAgreementDraftAction.label).toBe('tableEServiceCatalog.subscribe')

    act(() => {
      createAgreementDraftAction.action()
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

  it('should return the create agreement draft action if the user have only agreements with state REJECTED', async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [
        {
          id: 'agreement-id',
          state: 'REJECTED',
          consumerId: 'organizationId',
          canBeUpgraded: false,
        },
      ],
      isMine: false,
      hasCertifiedAttributes: true,
    })

    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )
    expect(result.current.actions).toHaveLength(1)
    const createAgreementDraftAction = result.current.actions[0]!
    expect(createAgreementDraftAction.label).toBe('tableEServiceCatalog.subscribe')

    act(() => {
      createAgreementDraftAction.action()
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

  it("should open the dialog for selecting the tenant before create agreement if the user doesn't have an agreement and act as 'delegate' for this e-service", async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: false,
      isSubscribed: false,
      hasCertifiedAttributes: true,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock }),
      [{ id: 'delegator-id', name: 'Delegator Name' }],
      false
    )
    expect(result.current.actions).toHaveLength(1)
    const createAgreementDraftAction = result.current.actions[0]!
    expect(createAgreementDraftAction.label).toBe('tableEServiceCatalog.subscribe')

    act(() => {
      createAgreementDraftAction.action()
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'createNewDraft' })).toBeInTheDocument()
    })
  })

  it("should return the create agreement draft action if the user doesn't have an active agreement and the subscriber is the e-service provider", async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: true,
    })

    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )
    expect(result.current.actions).toHaveLength(1)
    const createAgreementDraftAction = result.current.actions[0]!
    expect(createAgreementDraftAction.label).toBe('tableEServiceCatalog.subscribe')

    act(() => {
      createAgreementDraftAction.action()
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

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: false,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the inspect agreement action and the edit agreement action if the user has an agreement with state ACTIVE and another agreement with state DRAFT', async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [
        {
          id: 'test',
          state: 'ACTIVE',
          canBeUpgraded: false,
          consumerId: 'organizationId',
        },
        {
          id: 'test',
          state: 'DRAFT',
          canBeUpgraded: false,
          consumerId: 'delegator-id',
        },
      ],
      isSubscribed: true,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock }),
      [{ id: 'delegator-id', name: 'Delegator Name' }],
      false
    )
    expect(result.current.actions).toHaveLength(2)
    const goToAgreementAction = result.current.actions[0]!
    const goToEditAgreementAction = result.current.actions[1]!
    expect(goToAgreementAction.label).toBe('tableEServiceCatalog.inspect')
    expect(goToEditAgreementAction.label).toBe('tableEServiceCatalog.editDraft')
  })

  it('should return the inspect agreement action, the edit agreement action and the create agreement action if the user has agreement with state ACTIVE, agreement with state DRAFT and can create another agreement (via delegation)', async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [
        {
          id: 'test',
          state: 'ACTIVE',
          canBeUpgraded: false,
          consumerId: 'delegator-1-id',
        },
        {
          id: 'test',
          state: 'DRAFT',
          canBeUpgraded: false,
          consumerId: 'delegator-2-id',
        },
      ],
      isSubscribed: true,
      hasCertifiedAttributes: true,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock }),
      [
        { id: 'delegator-1-id', name: 'Delegator 1 Name' },
        { id: 'delegator-2-id', name: 'Delegator 2 Name' },
      ],
      false
    )

    expect(result.current.actions).toHaveLength(3)
    const goToAgreementAction = result.current.actions[0]!
    const goToEditAgreementAction = result.current.actions[1]!
    const goToCreateAgreementAction = result.current.actions[2]!
    expect(goToAgreementAction.label).toBe('tableEServiceCatalog.inspect')
    expect(goToEditAgreementAction.label).toBe('tableEServiceCatalog.editDraft')
    expect(goToCreateAgreementAction.label).toBe('tableEServiceCatalog.subscribe')
  })
})
