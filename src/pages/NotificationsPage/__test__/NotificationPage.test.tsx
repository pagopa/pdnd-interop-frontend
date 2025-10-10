import { renderWithApplicationContext } from '@/utils/testing.utils'
import NotificationsPage from '../Notifications.page'
import { screen, waitFor } from '@testing-library/react'

vi.mock('../NotificationsTable', () => ({
  NotificationsTable: () => <div>notifications-table</div>,
  NotificationsTableSkeleton: () => <div>notifications-table-skeleton</div>,
}))

describe('NotificationsPage', () => {
  beforeEach(() => {
    renderWithApplicationContext(<NotificationsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
  })

  describe('NotificationPage is loading data', () => {
    it('Should be render the skeleton at the beginning', () => {
      expect(screen.getByText('notifications-table-skeleton')).toBeInTheDocument()
    })
  })

  describe('NotificationPage has loaded data', () => {
    it('Should render title and description', () => {
      expect(screen.getByText('title')).toBeInTheDocument()
      expect(screen.getByText('description')).toBeInTheDocument()
    })
    it('Should be available and visible notification-table', () => {
      waitFor(() => {
        expect(screen.getByText('notification-table')).toBeInTheDocument()
        expect(screen.queryByText('notifications-table-skeleton')).not.toBeInTheDocument()
      })
    })
  })
})
