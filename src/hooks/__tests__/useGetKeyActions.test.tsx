import {
  mockUseClientKind,
  mockUseJwt,
  renderHookWithApplicationContext,
} from '@/utils/testing.utils'
import useGetKeyActions from '../useGetKeyActions'
import { vi } from 'vitest'
import * as router from '@/router'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { createMemoryHistory } from 'history'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClientDownloads } from '@/api/client'

const server = setupServer(
  rest.delete(`${BACKEND_FOR_FRONTEND_URL}/clients/:clientId/keys/:kid`, (req, res, ctx) => {
    return res(ctx.status(200))
  })
)

const navigateFn = vi.fn()

vi.spyOn(router, 'useNavigateRouter').mockReturnValue({
  navigate: navigateFn,
  getRouteUrl: navigateFn,
})
const parameters = ['clientId', 'kid'] as const

beforeAll(() => server.listen())
afterAll(() => {
  server.close()
  navigateFn.mockRestore()
})

describe('useGetKeyActions testing', () => {
  it('should return the correct key actions', () => {
    mockUseClientKind('API')
    mockUseJwt({ isAdmin: true })
    const { result } = renderHookWithApplicationContext(() => useGetKeyActions(...parameters), {
      withReactQueryContext: true,
    })

    expect(result.current.actions).toHaveLength(2)
  })

  it('should return the correct key actions when user is not admin but it is a security operator', () => {
    mockUseClientKind('API')
    mockUseJwt({ isAdmin: false, isOperatorSecurity: true })
    const { result } = renderHookWithApplicationContext(() => useGetKeyActions(...parameters), {
      withReactQueryContext: true,
    })

    expect(result.current.actions).toHaveLength(2)
  })

  it('should return no actions when user is not Admin', () => {
    mockUseClientKind('API')
    mockUseJwt({ isAdmin: false })
    const { result } = renderHookWithApplicationContext(() => useGetKeyActions(...parameters), {
      withReactQueryContext: true,
    })

    expect(result.current.actions).toHaveLength(0)
  })

  it('should correctly call the download action', () => {
    mockUseClientKind('API')

    const downloadFn = vi.fn()
    vi.spyOn(ClientDownloads, 'useDownloadKey').mockReturnValue(downloadFn)

    mockUseJwt({ isAdmin: true })
    const { result } = renderHookWithApplicationContext(() => useGetKeyActions(...parameters), {
      withReactQueryContext: true,
    })

    result.current.actions[0].action()
    expect(downloadFn).toHaveBeenCalledWith({ clientId: 'clientId', kid: 'kid' }, 'public_key.pub')
  })

  it('should redirect on the correct page after delete key action (API)', async () => {
    mockUseClientKind('API')
    mockUseJwt({ isAdmin: true })
    const history = createMemoryHistory()
    const { result, rerender } = renderHookWithApplicationContext(
      () => useGetKeyActions(...parameters),
      {
        withReactQueryContext: true,
      },
      history
    )

    result.current.actions[1].action()
    rerender()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'confirm' }))

    await waitFor(() => {
      expect(navigateFn).toHaveBeenCalledWith('SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT', {
        params: {
          clientId: 'clientId',
        },
        urlParams: {
          tab: 'publicKeys',
        },
      })
    })
  })

  it('should redirect on the correct page after delete key action (CONSUMER)', async () => {
    mockUseClientKind('CONSUMER')
    mockUseJwt({ isAdmin: true })
    const history = createMemoryHistory()
    const { result, rerender } = renderHookWithApplicationContext(
      () => useGetKeyActions(...parameters),
      {
        withReactQueryContext: true,
      },
      history
    )

    result.current.actions[1].action()
    rerender()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'confirm' }))

    await waitFor(() => {
      expect(navigateFn).toHaveBeenCalledWith('SUBSCRIBE_CLIENT_EDIT', {
        params: {
          clientId: 'clientId',
        },
        urlParams: {
          tab: 'publicKeys',
        },
      })
    })
  })
})
