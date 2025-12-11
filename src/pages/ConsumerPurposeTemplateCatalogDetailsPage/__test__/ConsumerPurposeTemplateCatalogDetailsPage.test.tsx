import ConsumerPurposeTemplateCatalogDetailsPage from '../ConsumerPurposeTemplateCatalogDetailsPage'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
  mockUseParams,
  mockUseGetActiveUserParty,
} from '@/utils/testing.utils'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import { waitFor } from '@testing-library/react'

const mockTemplateId = '1234'
const mockPurposeTemplateResponse: PurposeTemplateWithCompactCreator = {
  id: 'test-purpose-template-id',
  purposeTitle: 'Test Purpose Template',
  purposeDescription: 'This is a test purpose template description.',
  creator: {
    id: 'creator-id',
    name: 'Creator Name',
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
  targetTenantKind: 'PA',
  targetDescription: 'Intended for public administrations.',
  purposeIsFreeOfCharge: true,
  purposeDailyCalls: 12,
  handlesPersonalData: false,
  state: 'PUBLISHED',
}

mockUseGetActiveUserParty()
mockUseJwt()
mockUseCurrentRoute({ routeKey: 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS' })
mockUseParams({ purposeTemplateId: mockTemplateId })

const server = setupServer(
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${mockTemplateId}`, (_, res, ctx) => {
    return res(ctx.json<PurposeTemplateWithCompactCreator>(mockPurposeTemplateResponse))
  })
)
beforeAll(() => server.listen())

afterEach(() => {
  // This will remove any runtime request handlers
  // after each test, ensuring isolated network behavior.
  server.resetHandlers()
})

afterAll(() => server.close())

describe('ConsumerPurposeTemplateCatalogDetailsPage', async () => {
  it('Should render purpose Title', async () => {
    const screen = renderWithApplicationContext(<ConsumerPurposeTemplateCatalogDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Test Purpose Template/i })).toBeInTheDocument()
    })
  })

  it('Should be available three tab (details, linked eServices, risk Analysis)', async () => {
    const screen = renderWithApplicationContext(<ConsumerPurposeTemplateCatalogDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'read.tabs.details' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'read.tabs.linkedEservices' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'read.tabs.riskAnalysis' })).toBeInTheDocument()
    })
  })

  it('Should render "Suspend" and "Archive" buttons when purpose template is "PUBLISHED"', async () => {
    const screen = renderWithApplicationContext(<ConsumerPurposeTemplateCatalogDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Suspend/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Archive/i })).toBeInTheDocument()
    })
  })

  it('Should render "Active" and "Archive buttons when purpose template is "SUSPENDED"', async () => {
    server.use(
      rest.get(`${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${mockTemplateId}`, (_, res, ctx) => {
        return res(
          ctx.json<PurposeTemplateWithCompactCreator>({
            ...mockPurposeTemplateResponse,
            state: 'SUSPENDED',
          })
        )
      })
    )

    const screen = renderWithApplicationContext(<ConsumerPurposeTemplateCatalogDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Activate/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Archive/i })).toBeInTheDocument()
    })
  })
})
