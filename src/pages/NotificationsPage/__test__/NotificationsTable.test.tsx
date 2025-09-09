import type { UserNotification } from '@/api/notification'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'
import { NotificationsTable } from '../NotificationsTable'
import { fireEvent, screen, within } from '@testing-library/react'

mockUseJwt()

// UserNotification will be changed and will be retrieved from types
const notificationMock: UserNotification[] = [
  {
    id: 'a3f29d60-9e3c-4ef1-8f91-1d9cba77c912',
    data: '14/02/2025 13:58',
    name: 'Package delivered to front door',
    category: 'DELIVER',
    object: 'oggetto1',
    readStatus: false,
  },
  {
    id: 'b8c1a3b2-7e3e-4fa2-8d4d-5a42ec3873f5',
    data: '13/02/2025 11:23',
    name: 'New shipment received at warehouse',
    category: 'RECEIVE',
    object: 'oggetto2',
    readStatus: true,
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
        <NotificationsTable notifications={notificationMock} enableMultipleSelection={true} />,
        {
          withRouterContext: true,
          withReactQueryContext: true,
        }
      )
    })
    it('should be have five columns (checkbox,date,category,object,actions)', () => {
      screen.debug()
      expect(screen.getAllByRole('columnheader')).toHaveLength(5)
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

  describe('NotificationTableRow with multiple selection disabled', () => {
    beforeEach(() => {
      renderWithApplicationContext(
        <NotificationsTable notifications={notificationMock} enableMultipleSelection={false} />,
        {
          withRouterContext: true,
          withReactQueryContext: true,
        }
      )
    })
    it('should be have four columns (date,category,object,actions)', () => {
      screen.debug()
      expect(screen.getAllByRole('columnheader')).toHaveLength(4)
    })

    it('should not be able to select elements within table', async () => {
      const checkbox = screen.queryByTestId(`checkbox-${notificationMock[0].id}`)
      const selectAllCheckbox = screen.queryByTestId('selectAll')

      expect(selectAllCheckbox).not.toBeInTheDocument()
      expect(checkbox).not.toBeInTheDocument()
    })
  })
})
