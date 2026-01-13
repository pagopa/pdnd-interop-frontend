import React from 'react'
import userEvent from '@testing-library/user-event'
import { NotificationsBanner } from '../banners/NotificationsBanner'
import { vi } from 'vitest'
import * as useNotificationsBannerModule from '@/hooks/bannerHooks/useNotificationsBanner'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const mockNotificationBanner = {
  title: 'This is a notification message',
  text: 'This is the notification context',
  action1Label: 'Action 1',
  action2Label: 'Action 2',
  isOpen: true,
  closeBanner: vi.fn(),
}

describe('Checks notifications banner alert', () => {
  it('renders notification banner with message and closes on button click', async () => {
    const user = userEvent.setup()

    vi.spyOn(useNotificationsBannerModule, 'useNotificationsBanner').mockReturnValue(
      mockNotificationBanner
    )

    const { getByText, getByTestId } = renderWithApplicationContext(<NotificationsBanner />, {
      withRouterContext: true,
    })

    expect(getByText(mockNotificationBanner.title)).toBeInTheDocument()
    expect(getByText(mockNotificationBanner.text)).toBeInTheDocument()
    expect(getByText(mockNotificationBanner.action1Label)).toBeInTheDocument()
    expect(getByText(mockNotificationBanner.action2Label)).toBeInTheDocument()

    const closeButton = getByTestId('CloseIcon')
    await user.click(closeButton)
    expect(mockNotificationBanner.closeBanner).toHaveBeenCalled()
  })
})
