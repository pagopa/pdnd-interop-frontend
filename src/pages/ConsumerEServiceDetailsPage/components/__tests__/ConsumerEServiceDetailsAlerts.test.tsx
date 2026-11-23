import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { queryClient } from '@/config/query-client'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceDescriptorCatalog } from '@/../__mocks__/data/eservice.mocks'
import { ConsumerEServiceDetailsAlerts } from '../ConsumerEServiceDetailsAlerts'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'

const TENANT_ID = 'consumer-tenant-id'
const ESERVICE_ID = 'eservice-id'
const REQUIRED_ATTRIBUTE_ID = 'required-certified-attribute'

type Delegator = { id: string; name: string }

const delegatorsHandler = (results: Delegator[] = []) =>
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/consumers/delegations/delegators`, (_, res, ctx) =>
    res(
      ctx.json({
        results,
        pagination: { limit: 50, offset: 0, totalCount: results.length },
      })
    )
  )

const server = setupServer(
  delegatorsHandler(),
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/tenants/${TENANT_ID}/attributes/certified`, (_, res, ctx) =>
    res(ctx.json({ attributes: [] }))
  )
)

const renderAlerts = (
  descriptor: ReturnType<typeof createMockEServiceDescriptorCatalog> | undefined,
  updateTab?: (tab: string) => void
) =>
  renderWithApplicationContext(
    <ConsumerEServiceDetailsAlerts descriptor={descriptor} updateTab={updateTab} />,
    { withReactQueryContext: true, withRouterContext: true }
  )

const createDescriptorWithRequiredAttribute = (
  state: 'PUBLISHED' | 'SUSPENDED' = 'PUBLISHED',
  producerId = 'producer-tenant-id'
) =>
  createMockEServiceDescriptorCatalog({
    state,
    eservice: { producer: { id: producerId } },
    attributes: {
      certified: [[{ id: REQUIRED_ATTRIBUTE_ID }]],
    },
  })

const waitForAlertQueries = () =>
  waitFor(() => {
    expect(queryClient.isFetching()).toBe(0)
  })

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => {
  server.resetHandlers()
  queryClient.clear()
})
beforeEach(() => {
  mockUseJwt({ jwt: { organizationId: TENANT_ID } })
  mockUseParams({ eserviceId: ESERVICE_ID })
})

describe('ConsumerEServiceDetailsAlerts', () => {
  it('renders nothing when the descriptor is unavailable or has no alert', async () => {
    const empty = renderAlerts(undefined)
    expect(empty.container).toBeEmptyDOMElement()

    const published = renderAlerts(createMockEServiceDescriptorCatalog({ state: 'PUBLISHED' }))
    await waitForAlertQueries()
    expect(published.container).toBeEmptyDOMElement()
  })

  it('renders the descriptor state alert', () => {
    renderAlerts(createMockEServiceDescriptorCatalog({ state: 'SUSPENDED' }))

    expect(screen.getByRole('alert')).toHaveTextContent('suspended')
  })

  it('warns when an async e-service has no producer keychain', () => {
    renderAlerts(
      createMockEServiceDescriptorCatalog({
        eservice: { asyncExchange: true, hasProducerKeychain: false },
      })
    )

    expect(screen.getByText('missingProducerKeychain')).toBeInTheDocument()
    expect(screen.queryByText('missingProducerKeychainKeys')).not.toBeInTheDocument()
  })

  it('warns when an async e-service producer keychain has no keys', () => {
    renderAlerts(
      createMockEServiceDescriptorCatalog({
        eservice: {
          asyncExchange: true,
          hasProducerKeychain: true,
          hasProducerKeychainKeys: false,
        },
      })
    )

    expect(screen.getByText('missingProducerKeychainKeys')).toBeInTheDocument()
    expect(screen.queryByText('missingProducerKeychain')).not.toBeInTheDocument()
  })

  it('does not warn when a sync e-service or a complete keychain is used', () => {
    const sync = renderAlerts(
      createMockEServiceDescriptorCatalog({
        eservice: { asyncExchange: false, hasProducerKeychain: false },
      })
    )
    expect(sync.container).toBeEmptyDOMElement()

    const complete = renderAlerts(
      createMockEServiceDescriptorCatalog({
        eservice: {
          asyncExchange: true,
          hasProducerKeychain: true,
          hasProducerKeychainKeys: true,
        },
      })
    )
    expect(complete.container).toBeEmptyDOMElement()
  })

  it('shows an alert when the consumer is missing certified attributes and links to entry requirements', async () => {
    const updateTab = vi.fn()
    const user = userEvent.setup()
    renderAlerts(createDescriptorWithRequiredAttribute(), updateTab)

    expect(await screen.findByText('missingCertifiedAttribute.content')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'missingCertifiedAttribute.action' }))

    expect(updateTab).toHaveBeenCalledWith('entryRequirements')
  })

  it.each([
    {
      scenario: 'the consumer is also the producer',
      state: 'PUBLISHED' as const,
      producerId: TENANT_ID,
      delegators: [],
    },
    {
      scenario: 'the descriptor is not published',
      state: 'SUSPENDED' as const,
      producerId: 'producer-tenant-id',
      delegators: [],
    },
    {
      scenario: 'the consumer has a delegator',
      state: 'PUBLISHED' as const,
      producerId: 'producer-tenant-id',
      delegators: [{ id: 'delegator-id', name: 'Delegator' }],
    },
  ])(
    'does not show the missing certified attributes alert when $scenario',
    async ({ state, producerId, delegators }) => {
      server.use(delegatorsHandler(delegators))
      renderAlerts(createDescriptorWithRequiredAttribute(state, producerId))

      await waitForAlertQueries()

      expect(screen.queryByText('missingCertifiedAttribute.content')).not.toBeInTheDocument()
    }
  )
})
