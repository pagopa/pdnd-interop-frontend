import type {
  CatalogEServiceDescriptor,
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  VerifiedTenantAttribute,
} from '@/api/api.generatedTypes'
import { renderHook } from '@testing-library/react'
import type { Mock } from 'vitest'
import { vi } from 'vitest'
import { useDescriptorAttributesPartyOwnership } from '../useDescriptorAttributesPartyOwnership'
import { createMockEServiceDescriptorCatalog } from '@/../__mocks__/data/eservice.mocks'
import { mockUseJwt } from '@/utils/testing.utils'

mockUseJwt()

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQuery: vi.fn(),
  useQueries: vi.fn(),
}))

import { useQuery, useQueries } from '@tanstack/react-query'

const mockUseGetDescriptorCatalog = (descriptor: CatalogEServiceDescriptor | undefined) => {
  ;(useQuery as Mock).mockReturnValue({
    data: descriptor,
  })
}

const mockUseGetPartyAttributes = (
  certified: CertifiedTenantAttribute[] | undefined,
  verified: VerifiedTenantAttribute[] | undefined,
  declared: DeclaredTenantAttribute[] | undefined
) => {
  ;(useQueries as Mock).mockReturnValue([
    { data: certified ? { attributes: certified } : undefined },
    { data: verified ? { attributes: verified } : undefined },
    { data: declared ? { attributes: declared } : undefined },
  ])
}

const renderUseDescriptorAttributesPartyOwnership = () =>
  renderHook(() => useDescriptorAttributesPartyOwnership('e-service', 'descriptor-id'))

describe('useDescriptorAttributesPartyOwnership', () => {
  it('should return false when descriptor is undefined', () => {
    mockUseGetDescriptorCatalog(undefined)
    mockUseGetPartyAttributes([], [], [])

    const { result } = renderUseDescriptorAttributesPartyOwnership()
    expect(result.current).toEqual({
      hasAllCertifiedAttributes: false,
      hasAllDeclaredAttributes: false,
      hasAllVerifiedAttributes: false,
    })
  })

  it('should return false when attributes are undefined', () => {
    mockUseGetDescriptorCatalog(
      createMockEServiceDescriptorCatalog({
        attributes: { certified: [], verified: [], declared: [] },
      })
    )
    mockUseGetPartyAttributes(undefined, undefined, undefined)

    const { result } = renderUseDescriptorAttributesPartyOwnership()
    expect(result.current).toEqual({
      hasAllCertifiedAttributes: false,
      hasAllDeclaredAttributes: false,
      hasAllVerifiedAttributes: false,
    })
  })

  it('should return true for all attributes when active party is the owner of the e-service', () => {
    mockUseGetDescriptorCatalog(
      createMockEServiceDescriptorCatalog({
        attributes: {
          certified: [[{ id: 'certified-1' }]],
          verified: [[{ id: 'verified-1' }]],
          declared: [[{ id: 'declared-1' }]],
        },
        eservice: {
          isMine: true,
        },
      })
    )
    mockUseGetPartyAttributes([], [], [])

    const { result } = renderUseDescriptorAttributesPartyOwnership()
    expect(result.current).toEqual({
      hasAllCertifiedAttributes: true,
      hasAllDeclaredAttributes: true,
      hasAllVerifiedAttributes: true,
    })
  })

  it('should return true if user ownes all the attributes', () => {
    mockUseGetDescriptorCatalog(
      createMockEServiceDescriptorCatalog({
        attributes: {
          certified: [],
          verified: [],
          declared: [],
        },
      })
    )
    mockUseGetPartyAttributes([], [], [])

    const { result } = renderUseDescriptorAttributesPartyOwnership()
    expect(result.current).toEqual({
      hasAllCertifiedAttributes: true,
      hasAllDeclaredAttributes: true,
      hasAllVerifiedAttributes: true,
    })
  })
})
