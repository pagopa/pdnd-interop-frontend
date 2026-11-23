import { screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import PartyRegistryPage from '../PartyRegistry.page'
import {
  mockUseJwt,
  mockUseGetActiveUserParty,
  mockUseParams,
  mockUseCurrentRoute,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import * as router from '@/router'

vi.mock('@pagopa/interop-fe-commons', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
  }
})

vi.mock('../components', () => ({
  PartyContactsSection: () => <div>PartyContactsSection</div>,
  PartyAttributesSection: () => <div>PartyAttributesSection</div>,
  PartyContactsSectionSkeleton: () => <div>Skeleton</div>,
  PartyGeneralInfoSection: () => <div>PartyGeneralInfoSection</div>,
}))

const mockFn = vi.fn()
vi.spyOn(router, 'useNavigate').mockReturnValue(mockFn)
mockUseParams({})
mockUseCurrentRoute()

describe('PartyRegistryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders UO case: title with UO and AOO, description with root', () => {
    const mockUser = {
      id: 'uo-id',
      name: 'Ufficio Permessi ZTL',
      subUnitType: 'UO' as const,
      parentTenants: [
        { id: 'aoo-id', name: 'Direzione Mobilità', subUnitType: 'AOO' as const },
        { id: 'root-id', name: 'Comune di Milano' },
      ],
      externalId: { origin: 'test', value: 'test' },
      features: [],
      createdAt: '2023-01-01',
      attributes: { declared: [], verified: [], certified: [] },
    }

    mockUseJwt({ jwt: { organization: { name: 'Default Organization' } } })
    mockUseGetActiveUserParty({ data: mockUser })

    renderWithApplicationContext(<PartyRegistryPage />, {
      withRouterContext: true,
    })

    expect(screen.getByText('Ufficio Permessi ZTL - Direzione Mobilità')).toBeInTheDocument()
    expect(screen.getByText('Comune di Milano')).toBeInTheDocument()
  })

  it('renders AOO case: title is AOO only, description with root', () => {
    const mockUser = {
      id: 'aoo-id',
      name: 'Direzione Mobilità',
      subUnitType: 'AOO' as const,
      parentTenants: [{ id: 'root-id', name: 'Comune di Milano' }],
      externalId: { origin: 'test', value: 'test' },
      features: [],
      createdAt: '2023-01-01',
      attributes: { declared: [], verified: [], certified: [] },
    }

    mockUseJwt({ jwt: { organization: { name: 'Default Organization' } } })
    mockUseGetActiveUserParty({ data: mockUser })

    renderWithApplicationContext(<PartyRegistryPage />, {
      withRouterContext: true,
    })

    expect(screen.getByText('Direzione Mobilità')).toBeInTheDocument()
  })

  it('renders Root case: title is tenant name only, no description', () => {
    const mockUser = {
      id: 'root-id',
      name: 'Comune di Milano',
      externalId: { origin: 'test', value: 'test' },
      features: [],
      createdAt: '2023-01-01',
      attributes: { declared: [], verified: [], certified: [] },
    }

    mockUseJwt({ jwt: { organization: { name: 'Default Organization' } } })
    mockUseGetActiveUserParty({ data: mockUser })

    renderWithApplicationContext(<PartyRegistryPage />, {
      withRouterContext: true,
    })

    expect(screen.getByText('Comune di Milano')).toBeInTheDocument()
  })

  it('fallback to jwt organization name when formatHierarchyWithoutParentRoot returns empty', () => {
    const mockUser = {
      id: 'test-id',
      name: '',
      externalId: { origin: 'test', value: 'test' },
      features: [],
      createdAt: '2023-01-01',
      attributes: { declared: [], verified: [], certified: [] },
    }

    mockUseJwt({ jwt: { organization: { name: 'Default Organization' } } })
    mockUseGetActiveUserParty({ data: mockUser })

    renderWithApplicationContext(<PartyRegistryPage />, {
      withRouterContext: true,
    })

    expect(screen.getByText('Default Organization')).toBeInTheDocument()
  })
})
