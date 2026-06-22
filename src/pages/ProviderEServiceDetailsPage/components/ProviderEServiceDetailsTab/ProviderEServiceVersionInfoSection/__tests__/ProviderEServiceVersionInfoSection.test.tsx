import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { ProviderEServiceVersionInfoSection } from '../ProviderEServiceVersionInfoSection'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'
import * as EServiceModule from '@/api/eservice'
import * as EnvModule from '@/config/env'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'

vi.mock('@/router', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({ eserviceId: 'eservice-id', descriptorId: 'descriptor-id' }),
  useCurrentRoute: () => ({ mode: 'provider' }),
  Link: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

let mockDescriptorData: ProducerEServiceDescriptor
let mockLatestDescriptorData: ProducerEServiceDescriptor | undefined

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getDescriptorProvider: (_eserviceId: string, descriptorId: string) => ({
      queryKey: ['EServiceGetDescriptorProvider', _eserviceId, descriptorId],
      descriptorId,
    }),
  },
  EServiceMutations: {
    useUpdateAgreementApprovalPolicy: vi.fn(),
  },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useSuspenseQuery: ({ descriptorId }: { descriptorId: string }) => ({
    data:
      mockLatestDescriptorData && descriptorId !== mockDescriptorData.id
        ? mockLatestDescriptorData
        : mockDescriptorData,
  }),
}))

beforeEach(() => {
  mockUseJwt()
  mockLatestDescriptorData = undefined

  vi.mocked(EServiceModule.EServiceMutations.useUpdateAgreementApprovalPolicy).mockReturnValue({
    mutate: vi.fn(),
  } as never)

  vi.spyOn(EnvModule, 'FEATURE_FLAG_AGREEMENT_APPROVAL_POLICY_UPDATE', 'get').mockReturnValue(true)
})

afterEach(() => {
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

describe('ProviderEServiceVersionInfoSection', () => {
  describe('Dettagli', () => {
    it('renders the version description', () => {
      mockDescriptorData = createMockEServiceDescriptorProvider({
        description: 'Descrizione di prova',
      })

      renderWithApplicationContext(<ProviderEServiceVersionInfoSection />, {
        withReactQueryContext: true,
      })

      expect(screen.getByText('details.descriptorDescription.label')).toBeInTheDocument()
      expect(screen.getByText('Descrizione di prova')).toBeInTheDocument()
    })
  })

  describe('Richieste di fruizione', () => {
    it('renders the section when feature flag is enabled', () => {
      mockDescriptorData = createMockEServiceDescriptorProvider({
        agreementApprovalPolicy: 'AUTOMATIC',
      })

      renderWithApplicationContext(<ProviderEServiceVersionInfoSection />, {
        withReactQueryContext: true,
      })

      expect(screen.getByText('agreementApprovalPolicy.title')).toBeInTheDocument()
      expect(screen.getByText('agreementApprovalPolicy.label')).toBeInTheDocument()
      expect(screen.getByText('agreementApprovalPolicy.content.AUTOMATIC')).toBeInTheDocument()
    })

    it('does NOT render the section nor its edit button when feature flag is disabled', () => {
      vi.spyOn(EnvModule, 'FEATURE_FLAG_AGREEMENT_APPROVAL_POLICY_UPDATE', 'get').mockReturnValue(
        false
      )
      mockDescriptorData = createMockEServiceDescriptorProvider()

      renderWithApplicationContext(<ProviderEServiceVersionInfoSection />, {
        withReactQueryContext: true,
      })

      expect(screen.queryByText('agreementApprovalPolicy.title')).not.toBeInTheDocument()
      expect(screen.queryByText('actions.edit')).not.toBeInTheDocument()
    })

    it('opens the update agreement approval policy drawer when clicking edit', async () => {
      const user = userEvent.setup()
      mockDescriptorData = createMockEServiceDescriptorProvider()

      renderWithApplicationContext(<ProviderEServiceVersionInfoSection />, {
        withReactQueryContext: true,
      })

      const editButton = screen.getByText('actions.edit')
      await user.click(editButton)

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 6, name: 'title' })).toBeInTheDocument()
      })
    })

    it('does NOT render the edit button for a viewer', () => {
      mockUseJwt({ isAdmin: false, isViewer: true })
      mockDescriptorData = createMockEServiceDescriptorProvider({
        agreementApprovalPolicy: 'AUTOMATIC',
      })

      renderWithApplicationContext(<ProviderEServiceVersionInfoSection />, {
        withReactQueryContext: true,
      })

      expect(screen.getByText('agreementApprovalPolicy.title')).toBeInTheDocument()
      expect(screen.queryByText('actions.edit')).not.toBeInTheDocument()
    })
  })

  describe('Ciclo di vita', () => {
    it('renders publishedDate but NOT lastVersionDate when viewing the latest version', () => {
      mockDescriptorData = createMockEServiceDescriptorProvider({
        id: 'descriptor-latest',
        version: '2',
        publishedAt: '2025-12-12T10:00:00Z',
        state: 'PUBLISHED',
        eservice: {
          descriptors: [
            { id: 'descriptor-old', state: 'DEPRECATED', version: '1', audience: [] },
            { id: 'descriptor-latest', state: 'PUBLISHED', version: '2', audience: [] },
          ],
        },
      })

      renderWithApplicationContext(<ProviderEServiceVersionInfoSection />, {
        withReactQueryContext: true,
      })

      expect(screen.queryByText('lifeCycle.lastVersionDate')).not.toBeInTheDocument()
      expect(screen.getByText('lifeCycle.publishedDate')).toBeInTheDocument()
    })

    it('renders lastVersionDate with the latest descriptor publishedAt when viewing a non-latest version', () => {
      mockDescriptorData = createMockEServiceDescriptorProvider({
        id: 'descriptor-old',
        version: '1',
        publishedAt: '2025-01-01T10:00:00Z',
        state: 'DEPRECATED',
        eservice: {
          descriptors: [
            { id: 'descriptor-old', state: 'DEPRECATED', version: '1', audience: [] },
            { id: 'descriptor-latest', state: 'PUBLISHED', version: '2', audience: [] },
          ],
        },
      })
      mockLatestDescriptorData = createMockEServiceDescriptorProvider({
        id: 'descriptor-latest',
        version: '2',
        publishedAt: '2025-04-01T10:00:00Z',
        state: 'PUBLISHED',
      })

      renderWithApplicationContext(<ProviderEServiceVersionInfoSection />, {
        withReactQueryContext: true,
      })

      expect(screen.getByText('lifeCycle.lastVersionDate')).toBeInTheDocument()
      expect(screen.getByText('lifeCycle.publishedDate')).toBeInTheDocument()
    })

    it('does NOT render publishedDate when descriptor publishedAt is undefined', () => {
      mockDescriptorData = createMockEServiceDescriptorProvider({
        publishedAt: undefined,
      })

      renderWithApplicationContext(<ProviderEServiceVersionInfoSection />, {
        withReactQueryContext: true,
      })

      expect(screen.queryByText('lifeCycle.publishedDate')).not.toBeInTheDocument()
    })

    it('renders archivedDate only when archivedAt is set', () => {
      mockDescriptorData = createMockEServiceDescriptorProvider({
        archivedAt: '2025-07-30T10:00:00Z',
      })

      renderWithApplicationContext(<ProviderEServiceVersionInfoSection />, {
        withReactQueryContext: true,
      })

      expect(screen.getByText('lifeCycle.archivedDate')).toBeInTheDocument()
    })

    it('does NOT render archivedDate when archivedAt is undefined', () => {
      mockDescriptorData = createMockEServiceDescriptorProvider({
        archivedAt: undefined,
      })

      renderWithApplicationContext(<ProviderEServiceVersionInfoSection />, {
        withReactQueryContext: true,
      })

      expect(screen.queryByText('lifeCycle.archivedDate')).not.toBeInTheDocument()
    })

    it('renders suspendedDate only when suspendedAt is set AND state is SUSPENDED', () => {
      mockDescriptorData = createMockEServiceDescriptorProvider({
        suspendedAt: '2025-06-12T10:00:00Z',
        state: 'SUSPENDED',
      })

      renderWithApplicationContext(<ProviderEServiceVersionInfoSection />, {
        withReactQueryContext: true,
      })

      expect(screen.getByText('lifeCycle.suspendedDate')).toBeInTheDocument()
    })

    it('does NOT render suspendedDate when suspendedAt is set but state is not SUSPENDED', () => {
      mockDescriptorData = createMockEServiceDescriptorProvider({
        suspendedAt: '2025-06-12T10:00:00Z',
        state: 'PUBLISHED',
      })

      renderWithApplicationContext(<ProviderEServiceVersionInfoSection />, {
        withReactQueryContext: true,
      })

      expect(screen.queryByText('lifeCycle.suspendedDate')).not.toBeInTheDocument()
    })

    it('renders deprecatedDate only when deprecatedAt is set', () => {
      mockDescriptorData = createMockEServiceDescriptorProvider({
        deprecatedAt: '2025-06-08T10:00:00Z',
      })

      renderWithApplicationContext(<ProviderEServiceVersionInfoSection />, {
        withReactQueryContext: true,
      })

      expect(screen.getByText('lifeCycle.deprecatedDate')).toBeInTheDocument()
    })
  })

  it('does NOT render a "Modifica" button inside the Dettagli inner section', () => {
    mockDescriptorData = createMockEServiceDescriptorProvider()

    renderWithApplicationContext(<ProviderEServiceVersionInfoSection />, {
      withReactQueryContext: true,
    })

    const detailsHeading = screen.getByRole('heading', { name: 'details.title' })
    const detailsSection = detailsHeading.closest('section, [role="region"], div') as HTMLElement
    expect(within(detailsSection).queryByText('actions.edit')).not.toBeInTheDocument()
  })
})
