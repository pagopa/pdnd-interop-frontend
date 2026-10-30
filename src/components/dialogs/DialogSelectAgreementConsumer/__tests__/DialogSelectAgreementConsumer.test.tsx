import { rest } from 'msw'
import { setupServer } from 'msw/node'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { DialogSelectAgreementConsumer } from '../DialogSelectAgreementConsumer'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { queryClient } from '@/config/query-client'
import { createMockFactory, mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import type * as Stores from '@/stores'
import type * as Router from '@/router'
import type { CompactAgreement } from '@/api/api.generatedTypes'

const createMockAgreement = createMockFactory<CompactAgreement>({
  id: 'agreement-id',
  consumerId: 'other-consumer',
  state: 'ACTIVE',
  canBeUpgraded: false,
})

const { closeDialogMock, navigateMock } = vi.hoisted(() => ({
  closeDialogMock: vi.fn(),
  navigateMock: vi.fn(),
}))

vi.mock('@/router', async (importOriginal) => ({
  ...(await importOriginal<typeof Router>()),
  useNavigate: () => navigateMock,
}))

vi.mock('@/stores', async (importOriginal) => ({
  ...(await importOriginal<typeof Stores>()),
  useDialog: () => ({ closeDialog: closeDialogMock }),
}))

const server = setupServer(
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/delegations`, (_, res, ctx) => {
    return res(ctx.json({ results: [] }))
  }),
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/consumers/delegations/delegators`, (_, res, ctx) => {
    return res(ctx.json({ results: [{ id: 'delegator-id', name: 'Delegator Name' }] }))
  }),
  rest.get(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/:tenantId/eservices/:eserviceId/descriptors/:descriptorId/certifiedAttributes/validate`,
    (_, res, ctx) => {
      return res(ctx.json({ hasCertifiedAttributes: false }))
    }
  )
)

beforeAll(() => server.listen())

afterEach(() => {
  server.resetHandlers()
  queryClient.clear()
  vi.clearAllMocks()
})

afterAll(() => server.close())

describe('DialogSelectAgreementConsumer', () => {
  it.each(['inspect', 'edit'] as const)(
    'closes without navigating when a restored consumer no longer has an agreement in %s mode',
    async (action) => {
      mockUseJwt()
      const user = userEvent.setup()
      renderWithApplicationContext(
        <DialogSelectAgreementConsumer
          type="selectAgreementConsumer"
          action={action}
          eservice={{ id: 'eservice-id', name: 'E-service name', producerId: 'producer-id' }}
          descriptor={{ id: 'descriptor-id', version: '1' }}
          agreements={[]}
          initialSelectedConsumer={{ id: 'removed-consumer', name: 'Restored consumer' }}
        />,
        { withReactQueryContext: true, withRouterContext: true }
      )

      const field = await screen.findByRole('combobox', { name: 'consumerField.label' })
      await waitFor(() => expect(field).toHaveValue('Restored consumer'))
      await user.click(field)
      await user.click(await screen.findByRole('option', { name: 'Restored consumer' }))
      await user.click(screen.getByRole('button', { name: `actions.${action}` }))

      await waitFor(() => expect(closeDialogMock).toHaveBeenCalledOnce())
      expect(navigateMock).not.toHaveBeenCalled()
    }
  )

  it.each([
    { action: 'create' as const, delegated: true, hasAgreement: false, eligible: false },
    { action: 'edit' as const, delegated: true, hasAgreement: true, eligible: false },
    { action: 'inspect' as const, delegated: true, hasAgreement: true, eligible: true },
    { action: 'create' as const, delegated: false, hasAgreement: false, eligible: true },
    { action: 'create' as const, delegated: false, hasAgreement: true, eligible: false },
    { action: 'edit' as const, delegated: false, hasAgreement: false, eligible: false },
    { action: 'inspect' as const, delegated: false, hasAgreement: false, eligible: false },
  ])(
    'respects own-tenant eligibility in $action mode (delegated: $delegated, agreement: $hasAgreement)',
    async ({ action, delegated, hasAgreement, eligible }) => {
      mockUseJwt()
      const user = userEvent.setup()
      const delegationRequest = vi.fn()
      server.use(
        rest.get(`${BACKEND_FOR_FRONTEND_URL}/delegations`, (_, res, ctx) => {
          delegationRequest()
          return res(ctx.json({ results: delegated ? [{ id: 'active-delegation' }] : [] }))
        })
      )
      renderWithApplicationContext(
        <DialogSelectAgreementConsumer
          type="selectAgreementConsumer"
          action={action}
          eservice={{ id: 'eservice-id', name: 'E-service name', producerId: 'producer-id' }}
          descriptor={{ id: 'descriptor-id', version: '1' }}
          agreements={
            hasAgreement
              ? [
                  createMockAgreement({
                    consumerId: 'organizationId',
                    state: action === 'edit' ? 'DRAFT' : 'ACTIVE',
                  }),
                ]
              : []
          }
          initialSelectedConsumer={{ id: 'organizationId', name: 'orgName' }}
        />,
        { withReactQueryContext: true, withRouterContext: true }
      )

      await waitFor(() => expect(delegationRequest).toHaveBeenCalled())
      await waitFor(() => expect(queryClient.isFetching()).toBe(0))
      await user.click(screen.getByRole('combobox', { name: 'consumerField.label' }))
      if (eligible) {
        expect(await screen.findByRole('option', { name: 'orgName' })).toBeInTheDocument()
        expect(screen.getAllByRole('option', { name: 'orgName' })).toHaveLength(1)
      } else {
        expect(screen.queryByRole('option', { name: 'orgName' })).not.toBeInTheDocument()
      }
    }
  )

  it.each([{ results: null }, {}])(
    'treats a nullish results response as empty without losing an eligible own tenant: %j',
    async (response) => {
      mockUseJwt()
      const user = userEvent.setup()
      server.use(
        rest.get(`${BACKEND_FOR_FRONTEND_URL}/delegations`, (_, res, ctx) =>
          res(ctx.json(response))
        ),
        rest.get(`${BACKEND_FOR_FRONTEND_URL}/consumers/delegations/delegators`, (_, res, ctx) =>
          res(ctx.json(response))
        )
      )
      renderWithApplicationContext(
        <DialogSelectAgreementConsumer
          type="selectAgreementConsumer"
          action="create"
          eservice={{ id: 'eservice-id', name: 'E-service name', producerId: 'producer-id' }}
          descriptor={{ id: 'descriptor-id', version: '1' }}
          agreements={[]}
        />,
        { withReactQueryContext: true, withRouterContext: true }
      )

      await waitFor(() => expect(queryClient.isFetching()).toBe(0))
      await user.click(screen.getByRole('combobox', { name: 'consumerField.label' }))
      expect(await screen.findByRole('option', { name: 'orgName' })).toBeInTheDocument()
      expect(screen.getAllByRole('option')).toHaveLength(1)
      await user.keyboard('{Escape}')
      expect(screen.getByRole('button', { name: 'actions.create' })).toBeDisabled()
      expect(await screen.findByText('certifiedAttributesAlert.description')).toBeInTheDocument()
    }
  )

  it.each([
    { action: 'inspect' as const, state: 'ACTIVE' as const, route: 'SUBSCRIBE_AGREEMENT_READ' },
    { action: 'inspect' as const, state: 'SUSPENDED' as const, route: 'SUBSCRIBE_AGREEMENT_READ' },
    { action: 'inspect' as const, state: 'PENDING' as const, route: 'SUBSCRIBE_AGREEMENT_READ' },
    { action: 'edit' as const, state: 'DRAFT' as const, route: 'SUBSCRIBE_AGREEMENT_EDIT' },
  ])(
    'preselects the own tenant for a $state agreement in $action mode',
    async ({ action, state, route }) => {
      mockUseJwt()
      const user = userEvent.setup()
      renderWithApplicationContext(
        <DialogSelectAgreementConsumer
          type="selectAgreementConsumer"
          action={action}
          eservice={{ id: 'eservice-id', name: 'E-service name', producerId: 'producer-id' }}
          descriptor={{ id: 'descriptor-id', version: '1' }}
          agreements={[
            createMockAgreement({ id: 'own-agreement', consumerId: 'organizationId', state }),
            createMockAgreement({ consumerId: 'delegator-id', state: 'ARCHIVED' }),
          ]}
        />,
        { withReactQueryContext: true, withRouterContext: true }
      )

      const field = await screen.findByRole('combobox', { name: 'consumerField.label' })
      await waitFor(() => expect(field).toHaveValue('orgName'))
      await user.click(field)
      expect(await screen.findByRole('option', { name: 'orgName' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Delegator Name' })).not.toBeInTheDocument()
      await user.keyboard('{Escape}')
      await user.click(screen.getByRole('button', { name: `actions.${action}` }))

      await waitFor(() =>
        expect(navigateMock).toHaveBeenCalledWith(route, {
          params: { agreementId: 'own-agreement' },
        })
      )
      expect(closeDialogMock).toHaveBeenCalledOnce()
    }
  )

  it('only offers consumers without an ongoing agreement when creating', async () => {
    mockUseJwt()
    const user = userEvent.setup()
    server.use(
      rest.get(`${BACKEND_FOR_FRONTEND_URL}/consumers/delegations/delegators`, (_, res, ctx) =>
        res(
          ctx.json({
            results: [
              { id: 'delegator-id', name: 'Delegator Name' },
              { id: 'blocked-consumer', name: 'Already subscribed' },
              { id: 'rejected-consumer', name: 'Previously rejected' },
            ],
          })
        )
      ),
      rest.get(
        `${BACKEND_FOR_FRONTEND_URL}/tenants/:tenantId/eservices/:eserviceId/descriptors/:descriptorId/certifiedAttributes/validate`,
        (_, res, ctx) => res(ctx.json({ hasCertifiedAttributes: true }))
      )
    )
    renderWithApplicationContext(
      <DialogSelectAgreementConsumer
        type="selectAgreementConsumer"
        action="create"
        eservice={{ id: 'eservice-id', name: 'E-service name', producerId: 'producer-id' }}
        descriptor={{ id: 'descriptor-id', version: '1' }}
        agreements={[
          createMockAgreement({ consumerId: 'organizationId', state: 'ACTIVE' }),
          createMockAgreement({ consumerId: 'blocked-consumer', state: 'DRAFT' }),
          createMockAgreement({ consumerId: 'delegator-id', state: 'ARCHIVED' }),
          createMockAgreement({ consumerId: 'rejected-consumer', state: 'REJECTED' }),
        ]}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    const field = await screen.findByRole('combobox', { name: 'consumerField.label' })
    await waitFor(() => expect(field).toHaveValue('Delegator Name'))
    await user.click(screen.getByTitle('Clear'))
    await user.click(field)
    expect(await screen.findByRole('option', { name: 'Previously rejected' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Already subscribed' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'orgName' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Delegator Name' }))
    const confirmButton = screen.getByRole('button', { name: 'actions.create' })
    await waitFor(() => expect(confirmButton).toBeEnabled())
    await user.click(confirmButton)
    await waitFor(() => expect(closeDialogMock).toHaveBeenCalledOnce())
  })

  it('does not request authenticated data or invent an own tenant without a JWT', async () => {
    mockUseJwt({ jwt: undefined })
    const user = userEvent.setup()
    const authenticatedRequest = vi.fn()
    server.use(
      rest.get(`${BACKEND_FOR_FRONTEND_URL}/delegations`, (_, res, ctx) => {
        authenticatedRequest()
        return res(ctx.json({ results: [] }))
      }),
      rest.get(`${BACKEND_FOR_FRONTEND_URL}/consumers/delegations/delegators`, (_, res, ctx) =>
        res(ctx.json({ results: [] }))
      ),
      rest.get(
        `${BACKEND_FOR_FRONTEND_URL}/tenants/:tenantId/eservices/:eserviceId/descriptors/:descriptorId/certifiedAttributes/validate`,
        (_, res, ctx) => {
          authenticatedRequest()
          return res(ctx.json({ hasCertifiedAttributes: true }))
        }
      )
    )
    renderWithApplicationContext(
      <DialogSelectAgreementConsumer
        type="selectAgreementConsumer"
        action="create"
        eservice={{ id: 'eservice-id', name: 'E-service name', producerId: 'producer-id' }}
        descriptor={{ id: 'descriptor-id', version: '1' }}
        agreements={[]}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    const field = await screen.findByRole('combobox', { name: 'consumerField.label' })
    expect(field).toHaveValue('')
    await user.click(field)
    expect(await screen.findByText('noDataLabel')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'actions.create' }))
    expect(await screen.findByText('validation.mixed.required')).toBeInTheDocument()
    expect(authenticatedRequest).not.toHaveBeenCalled()
    expect(closeDialogMock).not.toHaveBeenCalled()
    expect(screen.queryByText('certifiedAttributesAlert.description')).not.toBeInTheDocument()
  })

  it.each([
    { action: 'inspect' as const, state: 'ACTIVE' as const, route: 'SUBSCRIBE_AGREEMENT_READ' },
    { action: 'edit' as const, state: 'DRAFT' as const, route: 'SUBSCRIBE_AGREEMENT_EDIT' },
  ])(
    'selects an eligible delegated consumer and opens its $action route',
    async ({ action, state, route }) => {
      mockUseJwt()
      const user = userEvent.setup()
      renderWithApplicationContext(
        <DialogSelectAgreementConsumer
          type="selectAgreementConsumer"
          action={action}
          eservice={{ id: 'eservice-id', name: 'E-service name', producerId: 'producer-id' }}
          descriptor={{ id: 'descriptor-id', version: '1' }}
          agreements={[
            createMockAgreement({ id: 'eligible-agreement', consumerId: 'delegator-id', state }),
            createMockAgreement({ consumerId: 'organizationId', state: 'REJECTED' }),
            createMockAgreement({ state: 'ARCHIVED' }),
          ]}
        />,
        { withReactQueryContext: true, withRouterContext: true }
      )

      const field = await screen.findByRole('combobox', { name: 'consumerField.label' })
      await waitFor(() => expect(field).toHaveValue('Delegator Name'))
      await user.click(screen.getByTitle('Clear'))
      expect(screen.getByRole('button', { name: `actions.${action}` })).toBeDisabled()
      await user.click(field)
      expect(screen.queryByRole('option', { name: 'orgName' })).not.toBeInTheDocument()
      await user.click(await screen.findByRole('option', { name: 'Delegator Name' }))
      await user.click(screen.getByRole('button', { name: `actions.${action}` }))

      await waitFor(() =>
        expect(navigateMock).toHaveBeenCalledWith(route, {
          params: { agreementId: 'eligible-agreement' },
        })
      )
      expect(closeDialogMock).toHaveBeenCalledOnce()
    }
  )

  it('shows the required field validation instead of the missing attributes alert when the consumer is cleared', async () => {
    mockUseJwt()
    const user = userEvent.setup()

    renderWithApplicationContext(
      <DialogSelectAgreementConsumer
        type="selectAgreementConsumer"
        action="create"
        eservice={{
          id: 'eservice-id',
          name: 'E-service name',
          producerId: 'producer-id',
        }}
        descriptor={{
          id: 'descriptor-id',
          version: '1',
        }}
        agreements={[]}
        onSubmitCreate={vi.fn()}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    const consumerField = await screen.findByRole('combobox', { name: 'consumerField.label' })
    await waitFor(() => expect(consumerField).toHaveValue('orgName'))

    await user.click(screen.getByTitle('Clear'))
    await user.click(screen.getByRole('button', { name: 'actions.create' }))

    expect(await screen.findByText('validation.mixed.required')).toBeInTheDocument()
    expect(screen.queryByText('certifiedAttributesAlert.description')).not.toBeInTheDocument()
  })

  it('keeps the create dialog open when the delegated submit fails', async () => {
    mockUseJwt()
    const user = userEvent.setup()
    const onSubmitCreate = vi.fn().mockRejectedValue(new Error('request failed'))
    server.use(
      rest.get(
        `${BACKEND_FOR_FRONTEND_URL}/tenants/:tenantId/eservices/:eserviceId/descriptors/:descriptorId/certifiedAttributes/validate`,
        (_, res, ctx) => res(ctx.json({ hasCertifiedAttributes: true }))
      )
    )

    renderWithApplicationContext(
      <DialogSelectAgreementConsumer
        type="selectAgreementConsumer"
        action="create"
        eservice={{ id: 'eservice-id', name: 'E-service name', producerId: 'producer-id' }}
        descriptor={{ id: 'descriptor-id', version: '1' }}
        agreements={[]}
        onSubmitCreate={onSubmitCreate}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    await screen.findByRole('combobox', { name: 'consumerField.label' })
    const confirmButton = await screen.findByRole('button', { name: 'actions.create' })
    await waitFor(() => expect(confirmButton).toBeEnabled())
    await user.click(confirmButton)

    await waitFor(() =>
      expect(onSubmitCreate).toHaveBeenCalledWith({
        isOwnEService: false,
        delegationId: undefined,
      })
    )
    expect(closeDialogMock).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes the create dialog after the delegated submit succeeds', async () => {
    mockUseJwt()
    const user = userEvent.setup()
    const onSubmitCreate = vi.fn().mockResolvedValue(undefined)
    server.use(
      rest.get(
        `${BACKEND_FOR_FRONTEND_URL}/tenants/:tenantId/eservices/:eserviceId/descriptors/:descriptorId/certifiedAttributes/validate`,
        (_, res, ctx) => res(ctx.json({ hasCertifiedAttributes: true }))
      )
    )

    renderWithApplicationContext(
      <DialogSelectAgreementConsumer
        type="selectAgreementConsumer"
        action="create"
        eservice={{ id: 'eservice-id', name: 'E-service name', producerId: 'producer-id' }}
        descriptor={{ id: 'descriptor-id', version: '1' }}
        agreements={[]}
        onSubmitCreate={onSubmitCreate}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    const confirmButton = await screen.findByRole('button', { name: 'actions.create' })
    await waitFor(() => expect(confirmButton).toBeEnabled())
    await user.click(confirmButton)

    await waitFor(() => expect(closeDialogMock).toHaveBeenCalledOnce())
    expect(onSubmitCreate).toHaveBeenCalledWith({
      isOwnEService: false,
      delegationId: undefined,
    })
  })
})
