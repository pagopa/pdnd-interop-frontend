import { screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { renderWithApplicationContext } from '@/utils/testing.utils'
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
  it('shows the macrosection without making it clickable', () => {
    const history = createMemoryHistory({
      initialEntries: ['/it/fruizione/finalita/purpose-id'],
    })

    renderWithApplicationContext(<Breadcrumbs />, { withRouterContext: true }, history)

    expect(screen.getByText('Fruizione').closest('a')).toBeNull()
    expect(screen.getByRole('link', { name: 'Finalità inoltrate' })).toHaveAttribute(
      'href',
      '/it/fruizione/finalita'
    )
    expect(screen.getByText('Dettaglio finalità').closest('a')).toBeNull()
  })
})
