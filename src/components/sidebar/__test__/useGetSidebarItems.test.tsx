import { renderHook } from '@testing-library/react'
import { useGetSidebarItems } from '../useGetSidebarItems'
import { mockUseGetActiveUserParty, mockUseJwt } from '@/utils/testing.utils'
import { vi } from 'vitest'
import { useIsOrganizationAllowedToDelegations } from '@/api/hooks'
import type { SidebarRoutes, SidebarChildRoutes } from '../sidebar.types'
import { createInstance } from 'i18next'
import itSidebar from '@/static/locales/it/sidebar.json'
import enSidebar from '@/static/locales/en/sidebar.json'

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

  describe('Provider dashboard', () => {
    it.each([
      { language: 'it', label: 'Panoramica' },
      { language: 'en', label: 'Dashboard' },
    ])(
      'should resolve the first provider label to $label in $language',
      async ({ language, label }) => {
        mockUseJwt({ currentRoles: ['admin'] })
        mockUseGetActiveUserParty()
        const i18n = createInstance()
        await i18n.init({
          lng: language,
          fallbackLng: false,
          resources: { it: { sidebar: itSidebar }, en: { sidebar: enSidebar } },
        })

        const { result } = renderHook(() => useGetSidebarItems())
        const dashboard = result.current.find((item) => item.rootRouteKey === 'PROVIDE_DASHBOARD')
          ?.children?.[0]

        expect(dashboard).toBeDefined()
        expect(i18n.getFixedT(language, 'sidebar', 'menuItem')(dashboard!.label)).toBe(label)
      }
    )

    it.each(['admin', 'support', 'api', 'security', 'viewer'] as const)(
      'should use the dashboard as the provider root and first child for %s',
      (role) => {
        mockUseJwt({ currentRoles: [role], isSupport: role === 'support' })
        mockUseGetActiveUserParty()

        const { result } = renderHook(() => useGetSidebarItems())
        const provider = result.current.find((item) => item.rootRouteKey === 'PROVIDE_DASHBOARD')

        expect(provider).toBeDefined()
        expect(provider?.hide).toBe(false)
        expect(provider?.children?.[0]).toEqual({
          to: 'PROVIDE_DASHBOARD',
          label: 'provider.dashboard',
        })
        expect(provider?.children?.[1]?.to).toBe('PROVIDE_ESERVICE_LIST')
        expect(result.current.some((item) => item.rootRouteKey === 'PROVIDE_ESERVICE_LIST')).toBe(
          false
        )
        if (role === 'security') {
          expect(provider?.children?.map((child) => child.to)).not.toContain(
            'PROVIDE_AGREEMENT_LIST'
          )
          expect(provider?.children?.map((child) => child.to)).not.toContain('PROVIDE_PURPOSE_LIST')
        }
      }
    )

    it('should exclude the provider group for reviewers', () => {
      mockUseJwt({ currentRoles: ['reviewer'], isReviewer: true })
      mockUseGetActiveUserParty()

      const { result } = renderHook(() => useGetSidebarItems())

      expect(result.current.some((item) => item.rootRouteKey === 'PROVIDE_DASHBOARD')).toBe(false)
    })

    it.each([
      { role: 'admin', isSupport: false, isOrganizationAllowedToProduce: false, hide: true },
      { role: 'support', isSupport: true, isOrganizationAllowedToProduce: false, hide: false },
      { role: 'admin', isSupport: false, isOrganizationAllowedToProduce: true, hide: false },
    ] as const)(
      'should preserve provider visibility for $role with producer permission $isOrganizationAllowedToProduce',
      ({ role, isSupport, isOrganizationAllowedToProduce, hide }) => {
        mockUseJwt({ currentRoles: [role], isSupport, isOrganizationAllowedToProduce })
        mockUseGetActiveUserParty()

        const { result } = renderHook(() => useGetSidebarItems())

        expect(result.current.find((item) => item.rootRouteKey === 'PROVIDE_DASHBOARD')?.hide).toBe(
          hide
        )
      }
    )
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
