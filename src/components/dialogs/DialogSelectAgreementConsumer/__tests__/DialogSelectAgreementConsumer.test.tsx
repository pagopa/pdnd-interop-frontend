import { rest } from 'msw'
import { setupServer } from 'msw/node'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { DialogSelectAgreementConsumer } from '../DialogSelectAgreementConsumer'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { queryClient } from '@/config/query-client'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import type * as Stores from '@/stores'

const { closeDialogMock } = vi.hoisted(() => ({
  closeDialogMock: vi.fn(),
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
