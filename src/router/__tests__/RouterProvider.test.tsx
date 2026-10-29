import React from 'react'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { onlineManager } from '@tanstack/react-query'
import { STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'

const tokenExchange = vi.hoisted(() => vi.fn())

vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)

vi.mock('@/config/axios', () => ({ default: { post: tokenExchange } }))
vi.mock('@/config/react-i18next', () => ({ default: { changeLanguage: vi.fn() } }))
vi.mock('@/components/shared/banners/MaintenanceBanner', () => ({ MaintenanceBanner: () => null }))
vi.mock('@tanstack/react-query-devtools', () => ({ ReactQueryDevtools: () => null }))

vi.mock('../components/RoutesWrapper', async () => {
  const { Outlet } = await import('react-router-dom')
  const { NuqsAdapter } = await import('nuqs/adapters/react-router/v6')

  return {
    default: () => (
      <NuqsAdapter>
        <Outlet />
      </NuqsAdapter>
    ),
  }
})

vi.mock('@/pages/ConsumerEServiceCatalogPage', async () => {
  const { useFilters } = await import('@/hooks/useFilters')

  return {
    ConsumerEServiceCatalogPage: () => {
      const { filters, onChangeActiveFilters } = useFilters<{ keyword: string }>([
        { name: 'keyword', label: 'filters.keyword', type: 'freetext' },
      ])

      return (
        <>
          <output aria-label="filters.keyword">{filters.keyword}</output>
          <button onClick={() => onChangeActiveFilters({ keyword: 'updated' })}>
            filters.apply
          </button>
        </>
      )
    },
  }
})

const sessionToken = `header.${btoa(
  JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + 3600,
    organization: { roles: [{ role: 'admin' }] },
  })
)}.signature`

let disposeRouter: (() => void) | undefined
let clearQueryClient: (() => void) | undefined

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  tokenExchange.mockReset()
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  disposeRouter?.()
  clearQueryClient?.()
  onlineManager.setOnline(true)
  window.history.replaceState({}, '', '/')
})

async function bootstrapRouter(url: string) {
  window.history.replaceState({}, '', url)

  // The shared application wrapper uses memory history, so it cannot expose a
  // browser router retaining an old hash while nuqs updates the actual URL.
  const { default: App } = await import('@/App')
  const { queryClient } = await import('@/config/query-client')
  const { getRouter } = await import('../routes')
  disposeRouter = () => getRouter().dispose()
  clearQueryClient = () => queryClient.clear()

  const app = () => (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  const view = render(app())
  return { getRouter, rerenderApp: () => view.rerender(app()) }
}

describe('RouterProvider authentication URL', { timeout: 20000 }, () => {
  it.each(['/ui/', '/ui/it/'])(
    'does not restore the Selfcare token after the redirect from %s or filtering',
    async (path) => {
      tokenExchange.mockResolvedValueOnce({
        data: { session_token: sessionToken },
      })

      const { getRouter, rerenderApp } = await bootstrapRouter(
        `${path}?keyword=initial&mode=RECEIVE#id=selfcare-token`
      )

      await screen.findByRole('button', { name: 'filters.apply' })
      expect(window.location.pathname).toBe('/ui/it/catalogo-e-service')
      expect(window.location.search).toBe('?keyword=initial&mode=RECEIVE')
      expect(window.location.hash).toBe('')
      expect(tokenExchange).toHaveBeenCalledExactlyOnceWith(
        `${BACKEND_FOR_FRONTEND_URL}/session/tokens`,
        { identity_token: 'selfcare-token' }
      )
      expect(window.localStorage.getItem(STORAGE_KEY_SESSION_TOKEN)).toBe(sessionToken)
      const router = getRouter()

      await userEvent.click(screen.getByRole('button', { name: 'filters.apply' }))

      await waitFor(() => expect(window.location.search).toBe('?keyword=updated&mode=RECEIVE'))
      expect(window.location.hash).toBe('')
      expect(window.location.pathname).toBe('/ui/it/catalogo-e-service')

      rerenderApp()
      expect(getRouter()).toBe(router)
      expect(window.location.search).toBe('?keyword=updated&mode=RECEIVE')
    }
  )

  it('keeps a direct catalog URL and its query parameters when exchanging the token', async () => {
    tokenExchange.mockResolvedValueOnce({
      data: { session_token: sessionToken },
    })

    await bootstrapRouter('/ui/it/catalogo-e-service?keyword=direct&mode=RECEIVE#id=selfcare-token')

    await screen.findByRole('button', { name: 'filters.apply' })
    expect(window.location.pathname).toBe('/ui/it/catalogo-e-service')
    expect(window.location.search).toBe('?keyword=direct&mode=RECEIVE')
    expect(window.location.hash).toBe('')
    expect(screen.getByLabelText('filters.keyword')).toHaveTextContent('direct')
  })

  it('does not retain a token when authentication starts after returning online', async () => {
    onlineManager.setOnline(false)
    let finishExchange: () => void = () => undefined
    tokenExchange.mockReturnValueOnce(
      new Promise((resolve) => {
        finishExchange = () => resolve({ data: { session_token: sessionToken } })
      })
    )

    await bootstrapRouter('/ui/it/?keyword=offline#id=selfcare-token')
    expect(tokenExchange).not.toHaveBeenCalled()
    expect(screen.getByRole('progressbar')).toBeVisible()

    act(() => onlineManager.setOnline(true))

    await waitFor(() => expect(tokenExchange).toHaveBeenCalledTimes(1))
    expect(window.location.hash).toBe('')
    expect(screen.getByRole('progressbar')).toBeVisible()
    finishExchange()

    await screen.findByRole('button', { name: 'filters.apply' })
    expect(window.location.pathname).toBe('/ui/it/catalogo-e-service')
    expect(window.location.search).toBe('?keyword=offline')
    expect(window.location.hash).toBe('')
  })

  it('preserves the support login fragment and stores its session token without exchanging it', async () => {
    const fragment = `#saml2=support&jwt=${sessionToken}`

    await bootstrapRouter(`/ui/it/catalogo-e-service${fragment}`)

    await screen.findByRole('button', { name: 'filters.apply' })
    expect(window.location.hash).toBe(fragment)
    expect(window.localStorage.getItem(STORAGE_KEY_SESSION_TOKEN)).toBe(sessionToken)
    expect(tokenExchange).not.toHaveBeenCalled()
  })

  it('allows a public page when there is no session token', async () => {
    await bootstrapRouter('/ui/it/404?source=public')

    expect(await screen.findByText('notFound.title')).toBeVisible()
    expect(window.location.pathname).toBe('/ui/it/404')
    expect(window.location.search).toBe('?source=public')
    expect(window.localStorage.getItem(STORAGE_KEY_SESSION_TOKEN)).toBeNull()
    expect(tokenExchange).not.toHaveBeenCalled()
  })

  it('removes the identity token even when the exchange fails and shows the error page', async () => {
    tokenExchange.mockRejectedValueOnce(new Error('Token exchange failed'))

    await bootstrapRouter('/ui/?keyword=initial#id=selfcare-token')

    expect(await screen.findByText('tokenExchange.title')).toBeInTheDocument()
    expect(window.location.pathname).toBe('/ui/')
    expect(window.location.search).toBe('?keyword=initial')
    expect(window.location.hash).toBe('')
    expect(window.localStorage.getItem(STORAGE_KEY_SESSION_TOKEN)).toBeNull()
  })
})
