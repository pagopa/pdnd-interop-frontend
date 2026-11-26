import { screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'
import { PARENT_QUERY_PARAMS_STATE_KEY } from '@/router'
import { Breadcrumbs } from '../Breadcrumbs'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: () => ({
      SUBSCRIBE: 'Fruizione',
      SUBSCRIBE_PURPOSE_LIST: 'Finalità inoltrate',
      SUBSCRIBE_PURPOSE_DETAILS: 'Dettaglio finalità',
    }),
    i18n: {
      language: 'it',
    },
  }),
}))

vi.mock('@/router/hooks/useCurrentRoute', () => ({
  useCurrentRoute: () => ({
    routeKey: 'SUBSCRIBE_PURPOSE_DETAILS',
  }),
}))

describe('Breadcrumbs', () => {
  it('uses commons breadcrumb items and navigates through intermediate segments', async () => {
    const user = userEvent.setup()
    const history = createMemoryHistory({
      initialEntries: ['/it/fruizione/finalita/purpose-id'],
    })

    renderWithApplicationContext(<Breadcrumbs />, { withRouterContext: true }, history)

    expect(screen.getByRole('link', { name: 'Fruizione' })).toBeInTheDocument()
    expect(screen.getByText('Dettaglio finalità')).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByRole('link', { name: 'Finalità inoltrate' }))

    expect(history.location.pathname).toBe('/it/fruizione/finalita')
  })

  it('restores the parent query parameters from navigation state', async () => {
    const user = userEvent.setup()
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: '/it/fruizione/finalita/purpose-id',
          state: { [PARENT_QUERY_PARAMS_STATE_KEY]: 'keyword=test&offset=9' },
        },
      ],
    })

    renderWithApplicationContext(<Breadcrumbs />, { withRouterContext: true }, history)
    await user.click(screen.getByRole('link', { name: 'Finalità inoltrate' }))

    expect(history.location.pathname).toBe('/it/fruizione/finalita')
    expect(history.location.search).toBe('?keyword=test&offset=9')
  })
})
