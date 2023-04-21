import { renderHook } from '@testing-library/react'
import { useCanUserSubmitAgreementDraft } from '../useCanUserSubmitAgreementDraft'
import { vi } from 'vitest'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import type { PartyAttribute } from '@/types/attribute.types'
import { AttributeQueries } from '@/api/attribute'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { createMockEServiceDescriptorCatalog } from '__mocks__/data/eservice.mocks'

const mockUseGetDescriptorCatalog = (result: CatalogEServiceDescriptor | unknown) => {
  vi.spyOn(EServiceQueries, 'useGetDescriptorCatalog').mockReturnValue({
    data: result,
  } as unknown as ReturnType<typeof EServiceQueries.useGetDescriptorCatalog>)
}

const mockUseGetAttributeListParty = (result: {
  certified?: PartyAttribute[]
  declared?: PartyAttribute[]
}) => {
  vi.spyOn(AttributeQueries, 'useGetListParty').mockReturnValue([
    { data: result?.certified },
    ,
    { data: result?.declared },
  ] as unknown as ReturnType<typeof AttributeQueries.useGetListParty>)
}

describe('useCanUserSubmitAgreementDraft', () => {
  it('should return false if the data is not available yet', () => {
    mockUseGetDescriptorCatalog(undefined)
    mockUseGetAttributeListParty({})

    const { result } = renderHook(() => useCanUserSubmitAgreementDraft(undefined))

    expect(result.current).toBe(false)
  })

  it('should return true if the provider is the same as the subscriber', () => {
    mockUseGetDescriptorCatalog(createMockEServiceDescriptorCatalog())
    mockUseGetAttributeListParty({ certified: [], declared: [] })

    const { result } = renderHook(() =>
      useCanUserSubmitAgreementDraft(
        createMockAgreement({
          consumer: { id: 'same' },
          producer: { id: 'same' },
          state: 'MISSING_CERTIFIED_ATTRIBUTES',
        })
      )
    )

    expect(result.current).toBe(true)
  })

  it('should return false if the agreement in in MISSING_CERTIFIED_ATTRIBUTES state', () => {
    mockUseGetDescriptorCatalog(createMockEServiceDescriptorCatalog())
    mockUseGetAttributeListParty({ certified: [], declared: [] })

    const { result } = renderHook(() =>
      useCanUserSubmitAgreementDraft(
        createMockAgreement({
          consumer: { id: 'same' },
          producer: { id: 'same' },
          state: 'MISSING_CERTIFIED_ATTRIBUTES',
        })
      )
    )

    expect(result.current).toBe(true)
  })

  it('should return false if the user does not have all the declared attributes', () => {
    mockUseGetDescriptorCatalog(
      createMockEServiceDescriptorCatalog({
        eservice: {
          attributes: { certified: [], declared: [{ single: { id: 'test' } }], verified: [] },
        },
      })
    )
    mockUseGetAttributeListParty({
      certified: [],
      declared: [{ id: 'test-1', name: 'test', state: 'ACTIVE' }],
    })

    const { result } = renderHook(() => useCanUserSubmitAgreementDraft(createMockAgreement()))

    expect(result.current).toBe(false)
  })

  it('should return false if the user does not have all the certified attributes', () => {
    mockUseGetDescriptorCatalog(
      createMockEServiceDescriptorCatalog({
        eservice: {
          attributes: { certified: [{ single: { id: 'test' } }], declared: [], verified: [] },
        },
      })
    )
    mockUseGetAttributeListParty({
      certified: [{ id: 'test-1', name: 'test', state: 'ACTIVE' }],
      declared: [],
    })

    const { result } = renderHook(() => useCanUserSubmitAgreementDraft(createMockAgreement()))

    expect(result.current).toBe(false)
  })

  it('should return true if the user have all the certified and declared attributes', () => {
    mockUseGetDescriptorCatalog(
      createMockEServiceDescriptorCatalog({
        eservice: {
          attributes: {
            certified: [{ single: { id: 'test-certified' } }],
            declared: [{ group: [{ id: 'test-declared-1' }, { id: 'test-declared-2' }] }],
            verified: [],
          },
        },
      })
    )
    mockUseGetAttributeListParty({
      certified: [{ id: 'test-certified', name: 'test', state: 'ACTIVE' }],
      declared: [{ id: 'test-declared-1', name: 'test', state: 'ACTIVE' }],
    })

    const { result } = renderHook(() => useCanUserSubmitAgreementDraft(createMockAgreement()))

    expect(result.current).toBe(true)
  })
})
