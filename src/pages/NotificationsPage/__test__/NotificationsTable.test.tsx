import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'
import { NotificationsTable } from '../NotificationsTable'
import { fireEvent, screen, within } from '@testing-library/react'
import { type Notification } from '@/api/api.generatedTypes'

mockUseJwt()

export const notificationMock: Notification[] = [
  {
    id: 'a3f29d60-9e3c-4ef1-8f91-1d9cba77c912',
    userId: 'user-1-uuid',
    tenantId: 'tenant-1-uuid',
    body: 'test-1',
    deepLink: '/notifications/1',
    readAt: null,
    createdAt: '2025-02-13T10:00:00.000Z',
    category: '',
  },
  {
    id: 'b8c1a3b2-7e3e-4fa2-8d4d-5a42ec3873f5',
    userId: 'user-2-uuid',
    tenantId: 'tenant-2-uuid',
    body: 'test-2',
    deepLink: '/notifications/2',
    readAt: '2025-02-13T11:30:00.000Z',
    createdAt: '2025-02-13T11:23:00.000Z',
    category: '',
  },
]
const navigateRouteFn = vi.fn()
vi.spyOn(router, 'useNavigate').mockReturnValue(navigateRouteFn)

afterEach(() => {
  navigateRouteFn.mockReset()
})

describe('NotificationsTableRow', () => {
  describe('NotificationsTableRow with multiple selection enabled', () => {
    beforeEach(() => {
      renderWithApplicationContext(
        <NotificationsTable
          offset={0}
          notifications={notificationMock}
          dataUpdatedAt="2025-02-14T13:58:00Z"
          handleRefetch={vi.fn()}
        />,
        {
          withRouterContext: true,
          withReactQueryContext: true,
        }
      )
    })
    it('should be have five columns (checkbox,date,category,object,deeplink,actions)', () => {
      expect(screen.getAllByRole('columnheader')).toHaveLength(6)
    })

    it('should be able to select an element within table', async () => {
      const checkbox = within(screen.getByTestId(`checkbox-${notificationMock[0].id}`)).getByRole(
        'checkbox'
      )

      expect(checkbox).toBeInTheDocument()
      expect(checkbox).not.toBeChecked()

      fireEvent.click(checkbox)
      expect(checkbox).toHaveProperty('checked', true)
    })

    it('should be able to select all elements within table', async () => {
      const selectAllCheckbox = within(screen.getByTestId('selectAll')).getByRole('checkbox')
      const checkboxes = screen.getAllByRole('checkbox')

      // initially all checkboxes should be unchecked
      expect(selectAllCheckbox).toHaveProperty('checked', false)

      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveProperty('checked', false)
      })

      fireEvent.click(selectAllCheckbox)
      expect(selectAllCheckbox).toHaveProperty('checked', true)

      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveProperty('checked', true)
      })
    })
  })
})
