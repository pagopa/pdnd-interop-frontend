import { renderHook } from '@testing-library/react'
import { useAttributesCountersAlert } from '../useAttributesCountersAlert'
import type { AttributeKind, DescriptorAttributes } from '@/api/api.generatedTypes'
import type { TFunction } from 'i18next'

const mockT = ((key: string) => key) as TFunction<'eservice', 'create'>

const emptyAttributes: DescriptorAttributes = {
  certified: [],
  verified: [],
  declared: [],
}

const makeGroup = (length: number, kind: AttributeKind) =>
  Array.from({ length }, (_, i) => ({
    id: `attr-${i}`,
    name: `Attribute ${i}`,
    description: '',
    explicitAttributeVerification: false,
    kind: kind,
  }))

describe('useAttributesCountersAlert', () => {
  it('returns 0 total requirements and empty array when all attribute groups are empty', () => {
    const { result } = renderHook(() =>
      useAttributesCountersAlert({ attributes: emptyAttributes, t: mockT })
    )
    expect(result.current.totalRequirements).toBe(0)
    expect(result.current.attributeTypesWithRequirements).toEqual([])
  })

  it('returns 0 total requirements when groups exist but are all empty arrays', () => {
    const attributes: DescriptorAttributes = {
      certified: [[]],
      verified: [[]],
      declared: [[]],
    }
    const { result } = renderHook(() => useAttributesCountersAlert({ attributes, t: mockT }))
    expect(result.current.totalRequirements).toBe(0)
    expect(result.current.attributeTypesWithRequirements).toEqual([])
  })

  it('counts certified requirements correctly', () => {
    const attributes: DescriptorAttributes = {
      certified: [makeGroup(2, 'CERTIFIED'), makeGroup(1, 'CERTIFIED')],
      verified: [],
      declared: [],
    }
    const { result } = renderHook(() => useAttributesCountersAlert({ attributes, t: mockT }))
    expect(result.current.totalRequirements).toBe(2)
    expect(result.current.attributeTypesWithRequirements).toEqual([
      'requirementsSummaryAlertAttributeTypes.certified',
    ])
  })

  it('counts verified requirements correctly', () => {
    const attributes: DescriptorAttributes = {
      certified: [],
      verified: [makeGroup(3, 'VERIFIED')],
      declared: [],
    }
    const { result } = renderHook(() => useAttributesCountersAlert({ attributes, t: mockT }))
    expect(result.current.totalRequirements).toBe(1)
    expect(result.current.attributeTypesWithRequirements).toEqual([
      'requirementsSummaryAlertAttributeTypes.verified',
    ])
  })

  it('counts declared requirements correctly', () => {
    const attributes: DescriptorAttributes = {
      certified: [],
      verified: [],
      declared: [makeGroup(1, 'DECLARED'), makeGroup(2, 'DECLARED')],
    }
    const { result } = renderHook(() => useAttributesCountersAlert({ attributes, t: mockT }))
    expect(result.current.totalRequirements).toBe(2)
    expect(result.current.attributeTypesWithRequirements).toEqual([
      'requirementsSummaryAlertAttributeTypes.declared',
    ])
  })

  it('counts all attribute types when all have requirements', () => {
    const attributes: DescriptorAttributes = {
      certified: [makeGroup(1, 'CERTIFIED')],
      verified: [makeGroup(2, 'VERIFIED'), makeGroup(1, 'VERIFIED')],
      declared: [makeGroup(1, 'DECLARED')],
    }
    const { result } = renderHook(() => useAttributesCountersAlert({ attributes, t: mockT }))
    expect(result.current.totalRequirements).toBe(4)
    expect(result.current.attributeTypesWithRequirements).toEqual([
      'requirementsSummaryAlertAttributeTypes.certified',
      'requirementsSummaryAlertAttributeTypes.verified',
      'requirementsSummaryAlertAttributeTypes.declared',
    ])
  })

  it('skips empty groups when counting total requirements', () => {
    const attributes: DescriptorAttributes = {
      certified: [makeGroup(1, 'CERTIFIED'), [], makeGroup(2, 'CERTIFIED')],
      verified: [[]],
      declared: [makeGroup(1, 'DECLARED')],
    }
    const { result } = renderHook(() => useAttributesCountersAlert({ attributes, t: mockT }))
    expect(result.current.totalRequirements).toBe(3)
    expect(result.current.attributeTypesWithRequirements).toEqual([
      'requirementsSummaryAlertAttributeTypes.certified',
      'requirementsSummaryAlertAttributeTypes.declared',
    ])
  })
})
