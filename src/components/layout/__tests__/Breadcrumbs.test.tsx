import { screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'
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

    expect(screen.getByText('Fruizione')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Dettaglio finalità')).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByRole('button', { name: 'Finalità inoltrate' }))

    expect(history.location.pathname).toBe('/it/fruizione/finalita')
  })
})
