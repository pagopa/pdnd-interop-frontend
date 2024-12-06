import { useGetSideNavItems } from '../useGetSideNavItems'
import { mockUseGetActiveUserParty, mockUseJwt } from '@/utils/testing.utils'
import { renderHook } from '@testing-library/react'

describe('useGetSideNavItems', () => {
  it('Should match the snapshot on empty roles', async () => {
    mockUseJwt({ currentRoles: [] })
    mockUseGetActiveUserParty()
    const { result } = renderHook(() => useGetSideNavItems())

    expect(result.current).toMatchInlineSnapshot('[]')
  })

  it('Should match the snapshot on only admin role', async () => {
    mockUseJwt({ currentRoles: ['admin'] })
    mockUseGetActiveUserParty()
    const { result } = renderHook(() => useGetSideNavItems())

    expect(result.current).toMatchInlineSnapshot(`
      [
        {
          "children": [
            "SUBSCRIBE_CATALOG_LIST",
            "SUBSCRIBE_AGREEMENT_LIST",
            "SUBSCRIBE_PURPOSE_LIST",
            "SUBSCRIBE_CLIENT_LIST",
            "SUBSCRIBE_INTEROP_M2M",
            "SUBSCRIBE_DEBUG_VOUCHER",
          ],
          "id": "subscriber",
          "routeKey": "SUBSCRIBE",
        },
        {
          "children": [
            "PROVIDE_ESERVICE_LIST",
            "PROVIDE_AGREEMENT_LIST",
            "PROVIDE_PURPOSE_LIST",
          ],
          "id": "provider",
          "routeKey": "PROVIDE",
        },
        {
          "children": [
            "PARTY_REGISTRY",
            "DELEGATIONS",
          ],
          "id": "tenant",
          "routeKey": "TENANT",
        },
      ]
    `)
  })

  it('Should match the snapshot on only api operator role', async () => {
    mockUseJwt({ currentRoles: ['api'] })
    mockUseGetActiveUserParty()
    const { result } = renderHook(() => useGetSideNavItems())

    expect(result.current).toMatchInlineSnapshot(`
      [
        {
          "children": [
            "SUBSCRIBE_CATALOG_LIST",
            "SUBSCRIBE_DEBUG_VOUCHER",
          ],
          "id": "subscriber",
          "routeKey": "SUBSCRIBE",
        },
        {
          "children": [
            "PROVIDE_ESERVICE_LIST",
            "PROVIDE_AGREEMENT_LIST",
            "PROVIDE_PURPOSE_LIST",
          ],
          "id": "provider",
          "routeKey": "PROVIDE",
        },
        {
          "children": [
            "PARTY_REGISTRY",
          ],
          "id": "tenant",
          "routeKey": "TENANT",
        },
      ]
    `)
  })

  it('Should match the snapshot on only security operator role', async () => {
    mockUseJwt({ currentRoles: ['security'] })
    mockUseGetActiveUserParty()
    const { result } = renderHook(() => useGetSideNavItems())

    expect(result.current).toMatchInlineSnapshot(`
      [
        {
          "children": [
            "SUBSCRIBE_CATALOG_LIST",
            "SUBSCRIBE_AGREEMENT_LIST",
            "SUBSCRIBE_PURPOSE_LIST",
            "SUBSCRIBE_CLIENT_LIST",
            "SUBSCRIBE_INTEROP_M2M",
            "SUBSCRIBE_DEBUG_VOUCHER",
          ],
          "id": "subscriber",
          "routeKey": "SUBSCRIBE",
        },
        {
          "children": [
            "PARTY_REGISTRY",
          ],
          "id": "tenant",
          "routeKey": "TENANT",
        },
      ]
    `)
  })

  it('Should match the snapshot on security and api operator roles', async () => {
    mockUseJwt({ currentRoles: ['security', 'api'] })
    mockUseGetActiveUserParty()
    const { result } = renderHook(() => useGetSideNavItems())

    expect(result.current).toMatchInlineSnapshot(`
      [
        {
          "children": [
            "SUBSCRIBE_CATALOG_LIST",
            "SUBSCRIBE_AGREEMENT_LIST",
            "SUBSCRIBE_PURPOSE_LIST",
            "SUBSCRIBE_CLIENT_LIST",
            "SUBSCRIBE_INTEROP_M2M",
            "SUBSCRIBE_DEBUG_VOUCHER",
          ],
          "id": "subscriber",
          "routeKey": "SUBSCRIBE",
        },
        {
          "children": [
            "PROVIDE_ESERVICE_LIST",
            "PROVIDE_AGREEMENT_LIST",
            "PROVIDE_PURPOSE_LIST",
          ],
          "id": "provider",
          "routeKey": "PROVIDE",
        },
        {
          "children": [
            "PARTY_REGISTRY",
          ],
          "id": "tenant",
          "routeKey": "TENANT",
        },
      ]
    `)
  })

  it('Should match the snapshot on security and admin operator roles', async () => {
    mockUseJwt({ currentRoles: ['security', 'admin'] })
    mockUseGetActiveUserParty()
    const { result } = renderHook(() => useGetSideNavItems())

    expect(result.current).toMatchInlineSnapshot(`
      [
        {
          "children": [
            "SUBSCRIBE_CATALOG_LIST",
            "SUBSCRIBE_AGREEMENT_LIST",
            "SUBSCRIBE_PURPOSE_LIST",
            "SUBSCRIBE_CLIENT_LIST",
            "SUBSCRIBE_INTEROP_M2M",
            "SUBSCRIBE_DEBUG_VOUCHER",
          ],
          "id": "subscriber",
          "routeKey": "SUBSCRIBE",
        },
        {
          "children": [
            "PROVIDE_ESERVICE_LIST",
            "PROVIDE_AGREEMENT_LIST",
            "PROVIDE_PURPOSE_LIST",
          ],
          "id": "provider",
          "routeKey": "PROVIDE",
        },
        {
          "children": [
            "PARTY_REGISTRY",
            "DELEGATIONS",
          ],
          "id": "tenant",
          "routeKey": "TENANT",
        },
      ]
    `)
  })

  it('Should match the snapshot on api and admin operator roles', async () => {
    mockUseJwt({ currentRoles: ['api', 'admin'] })
    mockUseGetActiveUserParty()
    const { result } = renderHook(() => useGetSideNavItems())

    expect(result.current).toMatchInlineSnapshot(`
      [
        {
          "children": [
            "SUBSCRIBE_CATALOG_LIST",
            "SUBSCRIBE_AGREEMENT_LIST",
            "SUBSCRIBE_PURPOSE_LIST",
            "SUBSCRIBE_CLIENT_LIST",
            "SUBSCRIBE_INTEROP_M2M",
            "SUBSCRIBE_DEBUG_VOUCHER",
          ],
          "id": "subscriber",
          "routeKey": "SUBSCRIBE",
        },
        {
          "children": [
            "PROVIDE_ESERVICE_LIST",
            "PROVIDE_AGREEMENT_LIST",
            "PROVIDE_PURPOSE_LIST",
          ],
          "id": "provider",
          "routeKey": "PROVIDE",
        },
        {
          "children": [
            "PARTY_REGISTRY",
            "DELEGATIONS",
          ],
          "id": "tenant",
          "routeKey": "TENANT",
        },
      ]
    `)
  })

  it('Should match the snapshot on all roles', async () => {
    mockUseJwt({ currentRoles: ['api', 'admin'] })
    mockUseGetActiveUserParty()
    const { result } = renderHook(() => useGetSideNavItems())

    expect(result.current).toMatchInlineSnapshot(`
      [
        {
          "children": [
            "SUBSCRIBE_CATALOG_LIST",
            "SUBSCRIBE_AGREEMENT_LIST",
            "SUBSCRIBE_PURPOSE_LIST",
            "SUBSCRIBE_CLIENT_LIST",
            "SUBSCRIBE_INTEROP_M2M",
            "SUBSCRIBE_DEBUG_VOUCHER",
          ],
          "id": "subscriber",
          "routeKey": "SUBSCRIBE",
        },
        {
          "children": [
            "PROVIDE_ESERVICE_LIST",
            "PROVIDE_AGREEMENT_LIST",
            "PROVIDE_PURPOSE_LIST",
          ],
          "id": "provider",
          "routeKey": "PROVIDE",
        },
        {
          "children": [
            "PARTY_REGISTRY",
            "DELEGATIONS",
          ],
          "id": "tenant",
          "routeKey": "TENANT",
        },
      ]
    `)
  })

  it("should not include 'PROVIDE' routes if the user is not an IPA organization", () => {
    mockUseJwt({ currentRoles: ['admin'], isOrganizationAllowedToProduce: false })
    mockUseGetActiveUserParty()
    const { result } = renderHook(() => useGetSideNavItems())

    expect(result.current).not.toContain('PROVIDE')
  })

  it("should not include 'TENANT_CERTIFIER' routes if the user is not certifier", () => {
    mockUseJwt({ currentRoles: ['admin'] })
    mockUseGetActiveUserParty({
      data: {
        id: 'id',
        externalId: { origin: 'test', value: 'test' },
        features: [{ certifier: undefined }],
        createdAt: '2021-01-01T00:00:00Z',
        name: 'test',
        attributes: { declared: [], verified: [], certified: [] },
      },
    })

    const { result } = renderHook(() => useGetSideNavItems())

    expect(result.current).not.toContain('TENANT_CERTIFIER')
  })
})
