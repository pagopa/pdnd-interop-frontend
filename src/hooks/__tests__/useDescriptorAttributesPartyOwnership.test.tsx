import type {
  CatalogEServiceDescriptor,
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  VerifiedTenantAttribute,
} from '@/api/api.generatedTypes'
import { AttributeQueries } from '@/api/attribute'
import { EServiceQueries } from '@/api/eservice'
import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { useDescriptorAttributesPartyOwnership } from '../useDescriptorAttributesPartyOwnership'
import { createMockEServiceDescriptorCatalog } from '__mocks__/data/eservice.mocks'
import { mockUseJwt } from '@/utils/testing.utils'

mockUseJwt()

const mockUseGetDescriptorCatalog = (descriptor: CatalogEServiceDescriptor | undefined) => {
  vi.spyOn(EServiceQueries, 'useGetDescriptorCatalog').mockReturnValue({
    data: descriptor,
  } as ReturnType<typeof EServiceQueries.useGetDescriptorCatalog>)
}

const mockUseGetPartyAttributes = (
  certified: CertifiedTenantAttribute[] | undefined,
  verified: VerifiedTenantAttribute[] | undefined,
  declared: DeclaredTenantAttribute[] | undefined
) => {
  vi.spyOn(AttributeQueries, 'useGetListParty').mockReturnValue([
    { data: certified ? { attributes: certified } : undefined },
    { data: verified ? { attributes: verified } : undefined },
    { data: declared ? { attributes: declared } : undefined },
  ] as ReturnType<typeof AttributeQueries.useGetListParty>)
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
          certified: [{ single: { id: 'certified-1' } }],
          verified: [{ single: { id: 'verified-1' } }],
          declared: [{ single: { id: 'declared-1' } }],
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
