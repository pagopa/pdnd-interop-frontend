import { afterEach, vi } from 'vitest'
import * as hooks from '@/hooks/useJwt'
import { renderHook } from '@testing-library/react'
import { useGetAvailableViews } from '../useGetAvailableViews'

afterEach(() => {
  useJwtSpy.mockClear()
})

const useJwtSpy = vi.spyOn(hooks, 'useJwt')
type UseJwtReturnT = ReturnType<typeof hooks.useJwt>

it('Should match the snapshot on empty roles', async () => {
  useJwtSpy.mockImplementation(() => ({ currentRoles: [] } as unknown as UseJwtReturnT))
  const { result } = renderHook(() => useGetAvailableViews())

  expect(result.current).toMatchInlineSnapshot(`
    [
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
    ]
  `)
})

it('Should match the snapshot on only admin role', async () => {
  useJwtSpy.mockImplementation(() => ({ currentRoles: ['admin'] } as unknown as UseJwtReturnT))
  const { result } = renderHook(() => useGetAvailableViews())

  expect(result.current).toMatchInlineSnapshot(`
    [
      {
        "children": [
          "PROVIDE_ESERVICE_LIST",
          "PROVIDE_AGREEMENT_LIST",
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
  useJwtSpy.mockImplementation(() => ({ currentRoles: ['api'] } as unknown as UseJwtReturnT))
  const { result } = renderHook(() => useGetAvailableViews())

  expect(result.current).toMatchInlineSnapshot(`
    [
      {
        "children": [
          "PROVIDE_ESERVICE_LIST",
        ],
        "id": "provider",
        "routeKey": "PROVIDE",
      },
      {
        "children": [
          "SUBSCRIBE_CATALOG_LIST",
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
    ]
  `)
})

it('Should match the snapshot on only security operator role', async () => {
  useJwtSpy.mockImplementation(() => ({ currentRoles: ['security'] } as unknown as UseJwtReturnT))
  const { result } = renderHook(() => useGetAvailableViews())

  expect(result.current).toMatchInlineSnapshot(`
    [
      {
        "children": [
          "SUBSCRIBE_CATALOG_LIST",
          "SUBSCRIBE_CLIENT_LIST",
          "SUBSCRIBE_INTEROP_M2M",
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
    ]
  `)
})

it('Should match the snapshot on security and api operator roles', async () => {
  useJwtSpy.mockImplementation(
    () => ({ currentRoles: ['security', 'api'] } as unknown as UseJwtReturnT)
  )
  const { result } = renderHook(() => useGetAvailableViews())

  expect(result.current).toMatchInlineSnapshot(`
    [
      {
        "children": [
          "SUBSCRIBE_CATALOG_LIST",
          "SUBSCRIBE_CLIENT_LIST",
          "SUBSCRIBE_INTEROP_M2M",
        ],
        "id": "subscriber",
        "routeKey": "SUBSCRIBE",
      },
      {
        "children": [
          "PROVIDE_ESERVICE_LIST",
        ],
        "id": "provider",
        "routeKey": "PROVIDE",
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
    ]
  `)
})

it('Should match the snapshot on security and admin operator roles', async () => {
  useJwtSpy.mockImplementation(
    () => ({ currentRoles: ['security', 'admin'] } as unknown as UseJwtReturnT)
  )
  const { result } = renderHook(() => useGetAvailableViews())

  expect(result.current).toMatchInlineSnapshot(`
    [
      {
        "children": [
          "SUBSCRIBE_CATALOG_LIST",
          "SUBSCRIBE_CLIENT_LIST",
          "SUBSCRIBE_INTEROP_M2M",
          "SUBSCRIBE_AGREEMENT_LIST",
          "SUBSCRIBE_PURPOSE_LIST",
        ],
        "id": "subscriber",
        "routeKey": "SUBSCRIBE",
      },
      {
        "children": [
          "PROVIDE_ESERVICE_LIST",
          "PROVIDE_AGREEMENT_LIST",
        ],
        "id": "provider",
        "routeKey": "PROVIDE",
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
  useJwtSpy.mockImplementation(
    () => ({ currentRoles: ['api', 'admin'] } as unknown as UseJwtReturnT)
  )
  const { result } = renderHook(() => useGetAvailableViews())

  expect(result.current).toMatchInlineSnapshot(`
    [
      {
        "children": [
          "PROVIDE_ESERVICE_LIST",
          "PROVIDE_AGREEMENT_LIST",
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
  useJwtSpy.mockImplementation(
    () => ({ currentRoles: ['api', 'admin'] } as unknown as UseJwtReturnT)
  )
  const { result } = renderHook(() => useGetAvailableViews())

  expect(result.current).toMatchInlineSnapshot(`
    [
      {
        "children": [
          "PROVIDE_ESERVICE_LIST",
          "PROVIDE_AGREEMENT_LIST",
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
