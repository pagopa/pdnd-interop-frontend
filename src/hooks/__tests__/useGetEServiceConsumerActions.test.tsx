import useGetEServiceConsumerActions from '../useGetEServiceConsumerActions'
import { mockUseJwt, renderHookWithApplicationContext } from '@/utils/testing.utils'
import {
  type CatalogEServiceDescriptor,
  type DelegationTenant,
  type EServiceDescriptorState,
} from '@/api/api.generatedTypes'
import {
  createMockCatalogDescriptorEService,
  createMockEServiceDescriptorCatalog,
} from '@/../__mocks__/data/eservice.mocks'
import { createMockAgreement } from '@/../__mocks__/data/agreement.mocks'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { act, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'

vi.mock('@/components/dialogs/DialogSelectAgreementConsumer/DialogSelectAgreementConsumer', () => ({
  DialogSelectAgreementConsumer: ({
    onSubmitCreate,
  }: {
    onSubmitCreate?: (values: { isOwnEService: boolean; delegationId?: string }) => void
  }) => (
    <button
      onClick={() => onSubmitCreate?.({ isOwnEService: false, delegationId: 'delegation-id' })}
    >
      DialogSelectAgreementConsumer
    </button>
  ),
}))

vi.mock('@/components/dialogs/DialogUpgradeAgreementVersion', () => ({
  DialogUpgradeAgreementVersion: () => <button>DialogUpgradeAgreementVersion</button>,
}))

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
  isDelegatorMock?: boolean,
  viewLatestVersionTargetIdMock?: string,
  requesterEserviceAgreementMock?: Parameters<typeof useGetEServiceConsumerActions>[4]
) {
  return renderHookWithApplicationContext(
    () =>
      useGetEServiceConsumerActions(
        descriptorMock,
        delegatorsMock,
        isDelegatorMock,
        viewLatestVersionTargetIdMock,
        requesterEserviceAgreementMock
      ),
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
    expect(result.current.primaryAction).toBeUndefined()
    expect(result.current.secondaryAction).toBeUndefined()
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should return inspect agreement action as primary if the user has just an agreement with state ACTIVE, SUSPENDED or PENDING', async () => {
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
    const goToAgreementAction = result.current.primaryAction!
    expect(goToAgreementAction.label).toBe('tableEServiceCatalog.inspect')
    expect(result.current.menuActions).toHaveLength(0)

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

    const goToAgreementAction = result.current.primaryAction!
    expect(goToAgreementAction.label).toBe('tableEServiceCatalog.inspect')

    act(() => {
      goToAgreementAction.action()
    })

    await waitFor(() => {
      expect(screen.getByText('DialogSelectAgreementConsumer')).toBeInTheDocument()
    })
  })

  it('should return the edit agreement action as primary if the user has one agreement with state DRAFT', async () => {
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
    const goToAgreementAction = result.current.primaryAction!
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
    const goToAgreementEditAction = result.current.primaryAction!
    expect(goToAgreementEditAction.label).toBe('tableEServiceCatalog.editDraft')

    act(() => {
      goToAgreementEditAction.action()
    })

    await waitFor(() => {
      expect(screen.getByText('DialogSelectAgreementConsumer')).toBeInTheDocument()
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
    expect(result.current.primaryAction).toBeUndefined()
    expect(result.current.secondaryAction).toBeUndefined()
    expect(result.current.menuActions).toHaveLength(0)
  })

  it("should return the create agreement draft action as primary if the user doesn't have agreements", async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: false,
      hasCertifiedAttributes: true,
    })

    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )
    const createAgreementDraftAction = result.current.primaryAction!
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

  it('should replace the create agreement draft confirmation with the async exchange confirmation for async e-services', async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: false,
      hasCertifiedAttributes: true,
      asyncExchange: true,
    })

    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )
    const createAgreementDraftAction = result.current.primaryAction!

    act(() => {
      createAgreementDraftAction.action()
    })

    await waitFor(() => {
      expect(screen.getByText('confirmDialog.asyncExchange.title')).toBeInTheDocument()
    })
    expect(
      screen.queryByRole('button', { name: 'confirmDialog.proceedLabel' })
    ).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(
        screen.getByRole('checkbox', { name: 'confirmDialog.asyncExchange.checkbox' })
      )
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toBe(`/it/fruizione/richieste/test-id/modifica`)
    })
  })

  it('should show the async exchange confirmation after selecting the delegated consumer for async e-services', async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: false,
      isSubscribed: false,
      hasCertifiedAttributes: true,
      asyncExchange: true,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock }),
      [{ id: 'delegator-id', name: 'Delegator Name' }],
      false
    )
    const createAgreementDraftAction = result.current.primaryAction!

    act(() => {
      createAgreementDraftAction.action()
    })

    await waitFor(() => {
      expect(screen.getByText('DialogSelectAgreementConsumer')).toBeInTheDocument()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'DialogSelectAgreementConsumer' }))
    })

    await waitFor(() => {
      expect(screen.getByText('confirmDialog.asyncExchange.title')).toBeInTheDocument()
    })
    expect(
      screen.queryByRole('button', { name: 'confirmDialog.proceedLabel' })
    ).not.toBeInTheDocument()
  })

  it('should return the create agreement draft action as primary if the user have only agreements with state ARCHIVED', async () => {
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
    const createAgreementDraftAction = result.current.primaryAction!
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

  it('should return the create agreement draft action as primary if the user have only agreements with state REJECTED', async () => {
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
    const createAgreementDraftAction = result.current.primaryAction!
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
    const createAgreementDraftAction = result.current.primaryAction!
    expect(createAgreementDraftAction.label).toBe('tableEServiceCatalog.subscribe')

    act(() => {
      createAgreementDraftAction.action()
    })

    await waitFor(() => {
      expect(screen.getByText('DialogSelectAgreementConsumer')).toBeInTheDocument()
    })
  })

  it('should return the create agreement draft action for delegators when jwt is not available', async () => {
    mockUseJwt({ jwt: undefined, isAdmin: true })

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

    expect(result.current.primaryAction?.label).toBe('tableEServiceCatalog.subscribe')
  })

  it("should return the create agreement draft action as primary if the user doesn't have an active agreement and the subscriber is the e-service provider", async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: true,
    })

    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )
    const createAgreementDraftAction = result.current.primaryAction!
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

  it('should show the activation confirmation when the subscriber is the async e-service provider', async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: true,
      asyncExchange: true,
    })

    const { result, history } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )
    const createAgreementDraftAction = result.current.primaryAction!

    act(() => {
      createAgreementDraftAction.action()
    })

    await waitFor(() => {
      expect(screen.getByText('confirmDialog.title')).toBeInTheDocument()
    })
    expect(screen.queryByText('confirmDialog.asyncExchange.title')).not.toBeInTheDocument()

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
    expect(result.current.primaryAction).toBeUndefined()
  })

  it('should prefer the inspect agreement action over the edit agreement action when the user has both', async () => {
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
    expect(result.current.primaryAction?.label).toBe('tableEServiceCatalog.inspect')
    expect(result.current.secondaryAction).toBeUndefined()
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should expose the subscribe action as secondary when the user has inspect, editDraft and subscribe candidates', async () => {
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

    expect(result.current.primaryAction?.label).toBe('tableEServiceCatalog.inspect')
    expect(result.current.secondaryAction?.label).toBe('tableEServiceCatalog.subscribe')
    expect(result.current.secondaryAction?.variant).toBe('outlined')
    expect(result.current.menuActions).toHaveLength(0)
  })

  it('should expose the subscribe action as secondary outlined button when own org has an ACTIVE agreement and a delegator has no agreement', async () => {
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
      hasCertifiedAttributes: true,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock }),
      [{ id: 'delegator-id', name: 'Delegator Name' }],
      false
    )

    expect(result.current.primaryAction?.label).toBe('tableEServiceCatalog.inspect')
    expect(result.current.secondaryAction?.label).toBe('tableEServiceCatalog.subscribe')
    expect(result.current.secondaryAction?.variant).toBe('outlined')
    expect(result.current.secondaryAction?.disabled).toBeFalsy()
  })

  it('should expose the subscribe action as secondary outlined button when own org has a DRAFT agreement and a delegator has no agreement', async () => {
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
      hasCertifiedAttributes: true,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock }),
      [{ id: 'delegator-id', name: 'Delegator Name' }],
      false
    )

    expect(result.current.primaryAction?.label).toBe('tableEServiceCatalog.editDraft')
    expect(result.current.secondaryAction?.label).toBe('tableEServiceCatalog.subscribe')
    expect(result.current.secondaryAction?.variant).toBe('outlined')
  })

  it('should open the DialogSelectAgreementConsumer when the secondary subscribe action is triggered on a multi-tenant scenario', async () => {
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
      hasCertifiedAttributes: true,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock }),
      [{ id: 'delegator-id', name: 'Delegator Name' }],
      false
    )

    const secondaryAction = result.current.secondaryAction!
    expect(secondaryAction.label).toBe('tableEServiceCatalog.subscribe')

    act(() => {
      secondaryAction.action()
    })

    await waitFor(() => {
      expect(screen.getByText('DialogSelectAgreementConsumer')).toBeInTheDocument()
    })
  })

  it('should keep the secondary subscribe action disabled with tooltip when the descriptor is SUSPENDED', () => {
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
      hasCertifiedAttributes: true,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock, state: 'SUSPENDED' }),
      [{ id: 'delegator-id', name: 'Delegator Name' }],
      false
    )

    expect(result.current.primaryAction?.label).toBe('tableEServiceCatalog.inspect')
    expect(result.current.secondaryAction?.label).toBe('tableEServiceCatalog.subscribe')
    expect(result.current.secondaryAction?.variant).toBe('outlined')
    expect(result.current.secondaryAction?.disabled).toBe(true)
    expect(result.current.secondaryAction?.tooltip).toBe(
      'tableEServiceCatalog.eserviceSuspendedTooltip'
    )
  })

  it('should not expose any secondary action when subscribe is the primary action', () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: false,
      hasCertifiedAttributes: true,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )

    expect(result.current.primaryAction?.label).toBe('tableEServiceCatalog.subscribe')
    expect(result.current.secondaryAction).toBeUndefined()
  })

  it('should not expose any secondary action when the disabled missing-attributes subscribe is the primary action', () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: false,
      isSubscribed: false,
      hasCertifiedAttributes: false,
    })

    const descriptorMock = createMockEServiceDescriptorCatalog({
      eservice: { ...eserviceMock, activeDescriptor: { id: 'active-id', state: 'PUBLISHED' } },
      id: 'active-id',
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(descriptorMock)

    expect(result.current.primaryAction?.label).toBe('tableEServiceCatalog.subscribe')
    expect(result.current.primaryAction?.disabled).toBe(true)
    expect(result.current.secondaryAction).toBeUndefined()
  })

  it.each<EServiceDescriptorState>(['ARCHIVING', 'ARCHIVING_SUSPENDED'])(
    'should show the subscribe action disabled and without tooltip when viewing an obsolete version being archived (state %s) as a non-subscribed third party',
    (state) => {
      mockUseJwt({ isAdmin: true })

      const eserviceMock = createMockCatalogDescriptorEService({
        agreements: [],
        isMine: false,
        isSubscribed: false,
        activeDescriptor: { id: 'latest-descriptor-id', state: 'PUBLISHED', version: '2' },
      })

      const descriptorMock = createMockEServiceDescriptorCatalog({
        eservice: eserviceMock,
        id: 'obsolete-descriptor-id',
        state,
      })

      const { result } = renderUseGetEServiceConsumerActionsHook(
        descriptorMock,
        undefined,
        false,
        'latest-descriptor-id'
      )

      expect(result.current.primaryAction?.label).toBe('tableEServiceCatalog.subscribe')
      expect(result.current.primaryAction?.disabled).toBe(true)
      expect(result.current.primaryAction?.tooltip).toBeUndefined()
      expect(result.current.secondaryAction).toBeUndefined()
    }
  )

  it('should not show the disabled subscribe action when the archiving descriptor is the latest version (whole e-service archiving)', () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: false,
      isSubscribed: false,
      hasCertifiedAttributes: true,
    })

    const descriptorMock = createMockEServiceDescriptorCatalog({
      eservice: eserviceMock,
      state: 'ARCHIVING',
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(descriptorMock)

    expect(result.current.primaryAction).toBeUndefined()
  })

  it('should expose the view latest version action in the header info row when a target id is provided', () => {
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
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock }),
      undefined,
      undefined,
      'latest-descriptor-id'
    )

    expect(result.current.secondaryAction).toBeUndefined()
    expect(result.current.headerInfoActions).toHaveLength(1)
    const viewLatest = result.current.headerInfoActions[0]!
    expect(viewLatest.label).toBe('viewLatestVersion')

    viewLatest.action()
    expect(history.location.pathname).toBe(
      `/it/catalogo-e-service/${eserviceMock.id}/latest-descriptor-id`
    )
  })

  it('should not expose the view latest version action when no target id is provided', () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: false,
      hasCertifiedAttributes: true,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock })
    )

    expect(result.current.secondaryAction).toBeUndefined()
    expect(result.current.headerInfoActions).toHaveLength(0)
  })

  it('should not show the subscribe action when the requester already has a blocking agreement on an obsolete version', () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: false,
      isSubscribed: false,
      hasCertifiedAttributes: true,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock }),
      undefined,
      false,
      undefined,
      { blocksSubscribe: true }
    )

    expect(result.current.primaryAction).toBeUndefined()
    expect(result.current.secondaryAction).toBeUndefined()
  })

  it('should show the upgrade action as primary when the requester has an upgradeable agreement on an obsolete version', async () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: false,
      isSubscribed: false,
      hasCertifiedAttributes: true,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock }),
      undefined,
      false,
      undefined,
      {
        blocksSubscribe: true,
        upgrade: {
          agreement: createMockAgreement(),
          hasMissingAttributes: false,
          hasAllCertifiedAttributes: true,
        },
      }
    )

    const upgradeAction = result.current.primaryAction!
    expect(upgradeAction.label).toBe('tableEServiceCatalog.upgradeToNewVersion')
    expect(upgradeAction.disabled).toBeFalsy()
    expect(result.current.secondaryAction).toBeUndefined()

    act(() => {
      upgradeAction.action()
    })

    await waitFor(() => {
      expect(screen.getByText('DialogUpgradeAgreementVersion')).toBeInTheDocument()
    })
  })

  it('should disable the upgrade action with a tooltip when the requester is missing certified attributes', () => {
    mockUseJwt({ isAdmin: true })

    const eserviceMock = createMockCatalogDescriptorEService({
      agreements: [],
      isMine: false,
      isSubscribed: false,
      hasCertifiedAttributes: false,
    })

    const { result } = renderUseGetEServiceConsumerActionsHook(
      createMockEServiceDescriptorCatalog({ eservice: eserviceMock }),
      undefined,
      false,
      undefined,
      {
        blocksSubscribe: true,
        upgrade: {
          agreement: createMockAgreement(),
          hasMissingAttributes: true,
          hasAllCertifiedAttributes: false,
        },
      }
    )

    expect(result.current.primaryAction?.label).toBe('tableEServiceCatalog.upgradeToNewVersion')
    expect(result.current.primaryAction?.disabled).toBe(true)
    expect(result.current.primaryAction?.tooltip).toBe(
      'consumerRead.noCertifiedAttributesForUpgradeTooltip'
    )
  })

  it('should keep the subscribe action for a delegator without agreement while the requester has an obsolete-version agreement', () => {
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
      false,
      undefined,
      {
        blocksSubscribe: true,
        upgrade: {
          agreement: createMockAgreement(),
          hasMissingAttributes: false,
          hasAllCertifiedAttributes: true,
        },
      }
    )

    expect(result.current.primaryAction?.label).toBe('tableEServiceCatalog.upgradeToNewVersion')
    expect(result.current.secondaryAction?.label).toBe('tableEServiceCatalog.subscribe')
    expect(result.current.secondaryAction?.variant).toBe('outlined')
  })
})
