import { renderHook } from '@testing-library/react'
import { useGetSidebarItems } from '../useGetSidebarItems'
import { mockUseGetActiveUserParty, mockUseJwt } from '@/utils/testing.utils'
import { vi } from 'vitest'
import { useIsOrganizationAllowedToDelegations } from '@/api/hooks'
import type { SidebarRoutes, SidebarChildRoutes } from '../sidebar.types'

vi.mock('@/api/hooks', () => ({
  useIsOrganizationAllowedToDelegations: vi.fn(() => ({ isAllowed: true, isLoading: false })),
}))

const useIsOrganizationAllowedToDelegationsMock = vi.mocked(useIsOrganizationAllowedToDelegations)

describe('useGetSidebarItems', () => {
  // Helper function to easily extract the delegations item from the generated sidebar
  const getDelegationsChild = (
    sidebarItems: SidebarRoutes
  ): SidebarChildRoutes[number] | undefined => {
    const tenantItem = sidebarItems.find((item) => item.rootRouteKey === 'PARTY_REGISTRY')
    return tenantItem?.children?.find((child) => child.to === 'DELEGATIONS')
  }

  it('should return empty navigation list if jwt not contain roles', () => {
    mockUseJwt({ currentRoles: [] })
    mockUseGetActiveUserParty()

    const { result } = renderHook(() => useGetSidebarItems())
    expect(result.current).toEqual([])
  })

  it('should return the entire navigation list for admin', () => {
    mockUseJwt({ currentRoles: ['admin'], isOrganizationAllowedToProduce: true })
    mockUseGetActiveUserParty()
    useIsOrganizationAllowedToDelegationsMock.mockReturnValue({ isAllowed: true, isLoading: false })

    const { result } = renderHook(() => useGetSidebarItems())
    expect(result.current.length).toBe(7)
  })

  it('should include the "Il mio ente" (PARTY_REGISTRY) item for a viewer', () => {
    mockUseJwt({ currentRoles: ['viewer'], isViewer: true, isAdmin: false })
    mockUseGetActiveUserParty()

    const { result } = renderHook(() => useGetSidebarItems())
    const tenantItem = result.current.find((item) => item.rootRouteKey === 'PARTY_REGISTRY')

    expect(tenantItem).toBeDefined()
    expect(tenantItem?.children?.some((child) => child.to === 'PARTY_REGISTRY')).toBe(true)
  })

  describe('Delegations visibility', () => {
    it('should NOT hide the delegations route when allowed and not loading', () => {
      mockUseJwt({ currentRoles: ['admin'] })
      mockUseGetActiveUserParty()
      useIsOrganizationAllowedToDelegationsMock.mockReturnValue({
        isAllowed: true,
        isLoading: false,
      })

      const { result } = renderHook(() => useGetSidebarItems())
      const delegationsChild = getDelegationsChild(result.current)

      expect(delegationsChild).toBeDefined()
      expect(delegationsChild?.hide).toBe(false)
    })

    it('should hide the delegations route when the organization is NOT allowed', () => {
      mockUseJwt({ currentRoles: ['admin'] })
      mockUseGetActiveUserParty()
      useIsOrganizationAllowedToDelegationsMock.mockReturnValue({
        isAllowed: false,
        isLoading: false,
      })

      const { result } = renderHook(() => useGetSidebarItems())
      const delegationsChild = getDelegationsChild(result.current)

      expect(delegationsChild).toBeDefined()
      expect(delegationsChild?.hide).toBe(true)
    })

    it('should hide the delegations route while the permission is loading', () => {
      mockUseJwt({ currentRoles: ['admin'] })
      mockUseGetActiveUserParty()
      useIsOrganizationAllowedToDelegationsMock.mockReturnValue({
        isAllowed: true,
        isLoading: true,
      })

      const { result } = renderHook(() => useGetSidebarItems())
      const delegationsChild = getDelegationsChild(result.current)

      expect(delegationsChild).toBeDefined()
      expect(delegationsChild?.hide).toBe(true)
    })
  })
})
