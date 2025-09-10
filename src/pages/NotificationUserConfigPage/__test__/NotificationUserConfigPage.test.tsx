import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { screen, waitFor } from '@testing-library/react'
import NotificationUserConfigPage from '../NotificationUserConfig.page'

mockUseJwt()
describe('NotificationUserConfigPage', () => {
  beforeEach(() => {
    renderWithApplicationContext(<NotificationUserConfigPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
  })

  it('Should be visible a Skeleton when the page is loading', () => {
    expect(screen.getByTestId('notification-page-skeleton')).toBeInTheDocument()
  })

  it('Should be visible the page title and page description even if the page is loading', () => {
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('Should be visible the two tabs even if the page has been loaded', () => {
    waitFor(() => {
      expect(screen.getByRole('tab', { name: 'inAppTabTitle' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'emailTabTitle' })).toBeInTheDocument()
    })
  })
})
