import React from 'react'
import { render } from '@testing-library/react'
import NotificationsPage from '../Notifications.page'

describe('NotificationPage', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<NotificationsPage />)

    expect(baseElement).toMatchSnapshot()
  })
})
