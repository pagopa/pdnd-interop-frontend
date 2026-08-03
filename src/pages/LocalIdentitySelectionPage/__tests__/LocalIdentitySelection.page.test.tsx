import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, vi } from 'vitest'
import { queryClient } from '@/config/query-client'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import LocalIdentitySelectionPage from '../LocalIdentitySelection.page'

const navigate = vi.fn()

vi.mock('@/router', () => ({
  useNavigate: () => navigate,
}))

vi.mock('i18next', () => ({
  default: {
    addResourceBundle: vi.fn(),
    changeLanguage: vi.fn(),
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        title: 'Select local identity',
        subtitle: 'Choose a tenant and user.',
        tenantLabel: 'Tenant',
        userLabel: 'User',
        submitButton: 'Continue',
      })[key] ?? key,
  }),
}))

describe('Local identity selection page', () => {
  afterEach(() => {
    queryClient.clear()
    window.localStorage.clear()
    vi.unstubAllGlobals()
  })

  it('stores the session for the selected tenant and user', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input).endsWith('/identities')) {
        return new Response(
          JSON.stringify({
            tenants: [
              {
                key: 'comune',
                id: '5470e567-de4c-416a-abd5-738dab94a5fd',
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
          }),
          { status: 200 }
        )
      }

      expect(JSON.parse(String(init?.body))).toEqual({
        tenantKey: 'comune',
        userId: 'user-1',
      })
      return new Response(JSON.stringify({ sessionToken: 'selected-session-token' }), {
        status: 200,
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    renderWithApplicationContext(<LocalIdentitySelectionPage language="en" />, {
      withReactQueryContext: true,
    })

    await userEvent.click(await screen.findByRole('combobox', { name: 'Tenant' }))
    await userEvent.click(screen.getByRole('option', { name: 'Comune Demo' }))
    await userEvent.click(screen.getByRole('combobox', { name: 'User' }))
    await userEvent.click(screen.getByRole('option', { name: 'Utente Viewer' }))
    expect(screen.queryByRole('combobox', { name: 'Role' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEY_SESSION_TOKEN)).toBe('selected-session-token')
      expect(navigate).toHaveBeenCalledWith('DEFAULT')
    })
  })
})
