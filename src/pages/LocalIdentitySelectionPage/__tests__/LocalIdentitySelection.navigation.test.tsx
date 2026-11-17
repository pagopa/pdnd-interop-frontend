import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, vi } from 'vitest'
import type { ComponentProps } from 'react'
import type * as MuiItalia from '@pagopa/mui-italia'
import { AuthHooks, AuthQueries } from '@/api/auth'
import { LocalIdentityServices } from '@/api/auth/local-identity.services'
import { SelfcareServices } from '@/api/selfcare/selfcare.services'
import { Header } from '@/components/layout/Header'
import { queryClient } from '@/config/query-client'
import { LocalSessionGuard } from '@/router/components/RoutesWrapper/LocalSessionGuard'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockJwtUser } from '@/../__mocks__/data/user.mocks'
import LocalIdentitySelectionPage from '../LocalIdentitySelection.page'

vi.mock('@pagopa/mui-italia', async (importOriginal) => {
  const original = await importOriginal<typeof MuiItalia>()
  return {
    ...original,
    HeaderAccount: (props: ComponentProps<typeof original.HeaderAccount>) => (
      <original.HeaderAccount {...props} translationsMap={{ logOut: 'logout' }} />
    ),
  }
})

vi.mock('i18next', () => ({
  default: {
    addResourceBundle: vi.fn(),
    changeLanguage: vi.fn(),
  },
}))

function AuthenticatedHeader() {
  const { jwt } = AuthHooks.useJwt()
  return <Header jwt={jwt} />
}

afterEach(() => {
  queryClient.clear()
  window.localStorage.clear()
  vi.restoreAllMocks()
})

it('shows the authenticated account after selecting an identity without reloading', async () => {
  const user = createMockJwtUser({
    uid: 'user-1',
    organizationId: '5470e567-de4c-416a-abd5-738dab94a5fd',
    selfcareId: 'stable-comune-id',
    organization: { name: 'Comune Demo', roles: [{ role: 'viewer' }] },
  })
  const sessionToken = `header.${btoa(JSON.stringify(user))}.signature`
  vi.spyOn(LocalIdentityServices, 'getIdentities').mockResolvedValue({
    ready: true,
    tenants: [
      {
        key: 'comune',
        id: '5470e567-de4c-416a-abd5-738dab94a5fd',
        selfcareId: 'stable-comune-id',
        name: 'Comune Demo',
        users: [
          {
            id: 'user-1',
            name: 'Utente',
            surname: 'Viewer',
            email: 'viewer@local.test',
            roles: ['viewer'],
          },
        ],
      },
    ],
  })
  vi.spyOn(LocalIdentityServices, 'createIdentityToken').mockResolvedValue({ sessionToken })
  vi.spyOn(SelfcareServices, 'getProducts').mockResolvedValue([])
  vi.spyOn(SelfcareServices, 'getPartyList').mockResolvedValue([])
  queryClient.setQueryData(AuthQueries.getSessionToken().queryKey, null)

  const router = createMemoryRouter(
    [
      {
        path: '/it/local-identity-selection/',
        element: <LocalIdentitySelectionPage language="it" />,
      },
      {
        path: '/it/',
        element: (
          <LocalSessionGuard>
            <AuthenticatedHeader />
          </LocalSessionGuard>
        ),
      },
    ],
    { initialEntries: ['/it/local-identity-selection/'] }
  )
  renderWithApplicationContext(<RouterProvider router={router} />, {
    withReactQueryContext: true,
  })

  await userEvent.click(await screen.findByRole('combobox', { name: 'tenantLabel' }))
  await userEvent.click(screen.getByRole('option', { name: 'Comune Demo' }))
  await userEvent.click(screen.getByRole('combobox', { name: 'userLabel' }))
  await userEvent.click(screen.getByRole('option', { name: 'Utente Viewer' }))
  await userEvent.click(screen.getByRole('button', { name: 'submitButton' }))

  expect(await screen.findByRole('button', { name: 'logout' })).toBeVisible()
})
