import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PublishThankYouPage from '../PublishThankYou.page'
import type { PublishThankYouState } from '../PublishThankYou.page'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'

const navigateMock = vi.fn()
vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)

const useLocationMock = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useLocation: () => useLocationMock(),
  }
})

describe('PublishThankYouPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to catalog list when state is null', () => {
    useLocationMock.mockReturnValue({ state: null })

    renderWithApplicationContext(<PublishThankYouPage />, {
      withRouterContext: true,
    })

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_CATALOG_LIST')
  })

  it('renders title and simple description when no bullet points', () => {
    const state: PublishThankYouState = {
      title: 'Hai pubblicato l\'e-service',
      description: 'Il tuo e-service è stato pubblicato.',
      buttonLabel: 'Chiudi',
      closeRouteKey: 'PROVIDE_ESERVICE_MANAGE' as router.RouteKey,
      closeRouteParams: { eserviceId: '123' },
    }

    useLocationMock.mockReturnValue({ state })

    renderWithApplicationContext(<PublishThankYouPage />, {
      withRouterContext: true,
    })

    expect(screen.getByRole('heading', { name: state.title })).toBeInTheDocument()
    expect(screen.getByText('Il tuo e-service è stato pubblicato.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Chiudi' })).toBeInTheDocument()
  })

  it('renders bullet points when provided', () => {
    const state: PublishThankYouState = {
      title: 'Hai pubblicato una nuova versione',
      subtitle: 'Ecco cosa è cambiato:',
      bulletPoints: ['Primo punto', 'Secondo punto', 'Terzo punto'],
      buttonLabel: 'Chiudi',
      closeRouteKey: 'PROVIDE_ESERVICE_MANAGE' as router.RouteKey,
      closeRouteParams: { eserviceId: '456' },
    }

    useLocationMock.mockReturnValue({ state })

    renderWithApplicationContext(<PublishThankYouPage />, {
      withRouterContext: true,
    })

    expect(screen.getByText('Ecco cosa è cambiato:')).toBeInTheDocument()
    expect(screen.getByText('Primo punto')).toBeInTheDocument()
    expect(screen.getByText('Secondo punto')).toBeInTheDocument()
    expect(screen.getByText('Terzo punto')).toBeInTheDocument()
  })

  it('navigates to close route when button is clicked', async () => {
    const user = userEvent.setup()
    const state: PublishThankYouState = {
      title: 'Pubblicato',
      description: 'Descrizione',
      buttonLabel: 'Chiudi',
      closeRouteKey: 'PROVIDE_ESERVICE_MANAGE' as router.RouteKey,
      closeRouteParams: { eserviceId: '789' },
    }

    useLocationMock.mockReturnValue({ state })

    renderWithApplicationContext(<PublishThankYouPage />, {
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'Chiudi' }))

    expect(navigateMock).toHaveBeenCalledWith('PROVIDE_ESERVICE_MANAGE', {
      params: { eserviceId: '789' },
    })
  })
})
