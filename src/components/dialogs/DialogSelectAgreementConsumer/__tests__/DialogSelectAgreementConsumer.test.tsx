import { rest } from 'msw'
import { setupServer } from 'msw/node'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { DialogSelectAgreementConsumer } from '../DialogSelectAgreementConsumer'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { queryClient } from '@/config/query-client'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'

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
})
