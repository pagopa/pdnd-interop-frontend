import { renderHook } from '@testing-library/react'
import { useGetSideNavItems } from '../useGetSideNavItems'
import { mockUseJwt } from '@/utils/testing.utils'

it('Should match the snapshot on empty roles', async () => {
  mockUseJwt({ currentRoles: [] })
  const { result } = renderHook(() => useGetSideNavItems())

  expect(result.current).toMatchInlineSnapshot('[]')
})

it('Should match the snapshot on only admin role', async () => {
  mockUseJwt({ currentRoles: ['admin'] })
  const { result } = renderHook(() => useGetSideNavItems())

  expect(result.current).toMatchInlineSnapshot(`
    [
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
        "StartIcon": {
          "$$typeof": Symbol(react.memo),
          "compare": null,
          "type": {
            "$$typeof": Symbol(react.forward_ref),
            "render": [Function],
          },
        },
        "routeKey": "NOTIFICATION",
      },
      {
        "routeKey": "PARTY_REGISTRY",
      },
    ]
  `)
})

it('Should match the snapshot on only api operator role', async () => {
  mockUseJwt({ currentRoles: ['api'] })
  const { result } = renderHook(() => useGetSideNavItems())

  expect(result.current).toMatchInlineSnapshot(`
    [
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
          "SUBSCRIBE_CATALOG_LIST",
          "SUBSCRIBE_DEBUG_VOUCHER",
        ],
        "id": "subscriber",
        "routeKey": "SUBSCRIBE",
      },
      {
        "StartIcon": {
          "$$typeof": Symbol(react.memo),
          "compare": null,
          "type": {
            "$$typeof": Symbol(react.forward_ref),
            "render": [Function],
          },
        },
        "routeKey": "NOTIFICATION",
      },
      {
        "routeKey": "PARTY_REGISTRY",
      },
    ]
  `)
})

it('Should match the snapshot on only security operator role', async () => {
  mockUseJwt({ currentRoles: ['security'] })
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
        "StartIcon": {
          "$$typeof": Symbol(react.memo),
          "compare": null,
          "type": {
            "$$typeof": Symbol(react.forward_ref),
            "render": [Function],
          },
        },
        "routeKey": "NOTIFICATION",
      },
      {
        "routeKey": "PARTY_REGISTRY",
      },
    ]
  `)
})

it('Should match the snapshot on security and api operator roles', async () => {
  mockUseJwt({ currentRoles: ['security', 'api'] })
  const { result } = renderHook(() => useGetSideNavItems())

  expect(result.current).toMatchInlineSnapshot(`
    [
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
        "StartIcon": {
          "$$typeof": Symbol(react.memo),
          "compare": null,
          "type": {
            "$$typeof": Symbol(react.forward_ref),
            "render": [Function],
          },
        },
        "routeKey": "NOTIFICATION",
      },
      {
        "routeKey": "PARTY_REGISTRY",
      },
    ]
  `)
})

it('Should match the snapshot on security and admin operator roles', async () => {
  mockUseJwt({ currentRoles: ['security', 'admin'] })
  const { result } = renderHook(() => useGetSideNavItems())

  expect(result.current).toMatchInlineSnapshot(`
    [
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
        "StartIcon": {
          "$$typeof": Symbol(react.memo),
          "compare": null,
          "type": {
            "$$typeof": Symbol(react.forward_ref),
            "render": [Function],
          },
        },
        "routeKey": "NOTIFICATION",
      },
      {
        "routeKey": "PARTY_REGISTRY",
      },
    ]
  `)
})

it('Should match the snapshot on api and admin operator roles', async () => {
  mockUseJwt({ currentRoles: ['api', 'admin'] })
  const { result } = renderHook(() => useGetSideNavItems())

  expect(result.current).toMatchInlineSnapshot(`
    [
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
        "StartIcon": {
          "$$typeof": Symbol(react.memo),
          "compare": null,
          "type": {
            "$$typeof": Symbol(react.forward_ref),
            "render": [Function],
          },
        },
        "routeKey": "NOTIFICATION",
      },
      {
        "routeKey": "PARTY_REGISTRY",
      },
    ]
  `)
})

it('Should match the snapshot on all roles', async () => {
  mockUseJwt({ currentRoles: ['api', 'admin'] })
  const { result } = renderHook(() => useGetSideNavItems())

  expect(result.current).toMatchInlineSnapshot(`
    [
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
        "StartIcon": {
          "$$typeof": Symbol(react.memo),
          "compare": null,
          "type": {
            "$$typeof": Symbol(react.forward_ref),
            "render": [Function],
          },
        },
        "routeKey": "NOTIFICATION",
      },
      {
        "routeKey": "PARTY_REGISTRY",
      },
    ]
  `)
})
