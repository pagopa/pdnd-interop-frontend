import React from 'react'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import type { AgreementListEntry } from '@/api/api.generatedTypes'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { queryClient } from '@/config/query-client'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockAgreementListingItem } from '@/../__mocks__/data/agreement.mocks'
import { createMockEServiceDescriptorCatalog } from '@/../__mocks__/data/eservice.mocks'
import { ConsumerEServiceDetailsAlerts } from '../ConsumerEServiceDetailsAlerts'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'

const TENANT_ID = 'consumer-tenant-id'
const ESERVICE_ID = 'eservice-id'
const REQUIRED_ATTRIBUTE_ID = 'required-certified-attribute'
const DEFAULT_DESCRIPTOR_ID = createMockEServiceDescriptorCatalog().id

type AgreementForTest = {
  state: AgreementListEntry['state']
  descriptorId?: string
}

const delegatorsHandler = (results: Array<{ id: string; name: string }> = []) =>
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/consumers/delegations/delegators`, (_, res, ctx) =>
    res(
      ctx.json({
        results,
        pagination: { limit: 50, offset: 0, totalCount: results.length },
      })
    )
  )

const agreementsHandler = (agreements: AgreementForTest[] = []) => {
  const results = agreements.map(({ state, descriptorId }) =>
    createMockAgreementListingItem({
      descriptor: { id: descriptorId ?? DEFAULT_DESCRIPTOR_ID },
      state,
    })
  )

  return rest.get(`${BACKEND_FOR_FRONTEND_URL}/consumers/agreements`, (_, res, ctx) =>
    res(
      ctx.json({
        results,
        pagination: { limit: 50, offset: 0, totalCount: results.length },
      })
    )
  )
}

const server = setupServer(
  delegatorsHandler(),
  agreementsHandler(),
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

  it.each([
    {
      scenario: 'a deprecated descriptor has no archiving schedule',
      state: 'DEPRECATED' as const,
      alert: 'deprecated',
    },
    {
      scenario: 'a deprecated descriptor is scheduled for archiving without agreements',
      state: 'DEPRECATED' as const,
      scope: 'DESCRIPTOR' as const,
      alert: 'deprecatedArchivingDescriptorWithoutAgreements',
    },
    {
      scenario: 'a deprecated descriptor is scheduled for archiving with agreements',
      state: 'DEPRECATED' as const,
      scope: 'DESCRIPTOR' as const,
      agreements: [{ state: 'ACTIVE' as const }],
      alert: 'deprecatedArchivingDescriptorWithAgreements',
    },
    {
      scenario: 'an e-service is scheduled for archiving without agreements',
      state: 'DEPRECATED' as const,
      scope: 'ESERVICE' as const,
      alert: 'deprecatedArchivingEServiceWithoutAgreements',
    },
    {
      scenario: 'an e-service is scheduled for archiving with suspended agreements',
      state: 'DEPRECATED' as const,
      scope: 'ESERVICE' as const,
      agreements: [{ state: 'SUSPENDED' as const }],
      alert: 'deprecatedArchivingEServiceWithAgreements',
    },
    {
      scenario: 'a suspended descriptor has no agreements',
      state: 'SUSPENDED' as const,
      alert: 'suspended',
    },
    {
      scenario: 'a suspended descriptor has an active agreement',
      state: 'SUSPENDED' as const,
      agreements: [{ state: 'ACTIVE' as const }],
      alert: 'suspendedWithAgreements',
    },
    {
      scenario: 'an e-service is being archived without agreements',
      state: 'ARCHIVING' as const,
      scope: 'ESERVICE' as const,
      alert: 'archivingEService',
    },
    {
      scenario: 'an e-service is being archived with agreements',
      state: 'ARCHIVING' as const,
      scope: 'ESERVICE' as const,
      agreements: [{ state: 'ACTIVE' as const }],
      alert: 'archivingEServiceWithAgreements',
    },
  ])(
    'shows the corresponding alert when $scenario',
    async ({ state, scope, agreements = [], alert }) => {
      const descriptor = createMockEServiceDescriptorCatalog({
        state,
        ...(scope && {
          archivingSchedule: {
            archivableOn: '2026-12-01T00:00:00.000Z',
            startedAt: '2026-11-01T00:00:00.000Z',
            scope,
            gracePeriodDays: 30,
          },
        }),
      })

      server.use(agreementsHandler(agreements))
      renderAlerts(descriptor)

      expect(await screen.findByText(alert)).toBeInTheDocument()
    }
  )

  it('does not count agreements for another descriptor or in an inactive state', async () => {
    const descriptor = createMockEServiceDescriptorCatalog({ state: 'SUSPENDED' })
    server.use(
      agreementsHandler([
        { state: 'ACTIVE', descriptorId: 'another-descriptor' },
        { state: 'DRAFT', descriptorId: descriptor.id },
      ])
    )

    renderAlerts(descriptor)

    expect(await screen.findByText('suspended')).toBeInTheDocument()
    expect(screen.queryByText('suspendedWithAgreements')).not.toBeInTheDocument()
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
    renderAlerts(
      createMockEServiceDescriptorCatalog({
        eservice: { asyncExchange: false, hasProducerKeychain: false },
      })
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    renderAlerts(
      createMockEServiceDescriptorCatalog({
        eservice: {
          asyncExchange: true,
          hasProducerKeychain: true,
          hasProducerKeychainKeys: true,
        },
      })
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
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
