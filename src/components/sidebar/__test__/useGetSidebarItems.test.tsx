import { renderHook } from '@testing-library/react'
import { useGetSidebarItems } from '../useGetSidebarItems'
import { mockUseGetActiveUserParty, mockUseJwt } from '@/utils/testing.utils'

describe('useGetSidebarItems', () => {
  it('should return empty navigation list if jwt not contain roles', () => {
    mockUseJwt({ currentRoles: [] })
    mockUseGetActiveUserParty()
    const { result } = renderHook(() => useGetSidebarItems())
    expect(result.current).toEqual([])
  })

  it('should return the entire navigation list for admin', () => {
    mockUseJwt({ currentRoles: ['admin'], isOrganizationAllowedToProduce: true })
    mockUseGetActiveUserParty()
    const { result } = renderHook(() => useGetSidebarItems())

    expect(result.current.length).toBe(6)
  })
})
