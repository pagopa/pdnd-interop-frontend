import React from 'react'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { ProductUpdatesBanner } from '../banners/ProductUpdatesBanner'
import { vi } from 'vitest'
import * as useProductUpdatesBannerModule from '@/hooks/bannerHooks/useProductUpdatesBanner'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { archiveEserviceGuideLink, userRolesGuideLink } from '@/config/constants'

const mockProductUpdatesBanner = {
  title: 'This is a notification message',
  text: 'This is the notification context',
  action1Label: 'Action 1',
  action2Label: 'Action 2',
  action1AriaLabel: 'Action 1, opens in a new tab',
  action2AriaLabel: 'Action 2, opens in a new tab',
  isOpen: true,
  closeBanner: vi.fn(),
}

describe('Checks product updates banner alert', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders product updates banner with message and closes on button click', async () => {
    const user = userEvent.setup()
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    vi.spyOn(useProductUpdatesBannerModule, 'useProductUpdatesBanner').mockReturnValue(
      mockProductUpdatesBanner
    )

    const { getByText, getByTestId } = renderWithApplicationContext(<ProductUpdatesBanner />, {
      withRouterContext: true,
    })

    expect(getByText(mockProductUpdatesBanner.title)).toBeInTheDocument()
    expect(getByText(mockProductUpdatesBanner.text)).toBeInTheDocument()
    expect(getByText(mockProductUpdatesBanner.action1Label)).toBeInTheDocument()
    expect(getByText(mockProductUpdatesBanner.action2Label)).toBeInTheDocument()

    const closeButton = getByTestId('CloseIcon')
    await user.click(closeButton)
    expect(mockProductUpdatesBanner.closeBanner).toHaveBeenCalled()

    await user.click(
      screen.getByRole('button', { name: mockProductUpdatesBanner.action1AriaLabel })
    )
    expect(windowOpenSpy).toHaveBeenCalledWith(archiveEserviceGuideLink, '_blank')

    await user.click(
      screen.getByRole('button', { name: mockProductUpdatesBanner.action2AriaLabel })
    )
    expect(windowOpenSpy).toHaveBeenCalledWith(userRolesGuideLink, '_blank')
  })
})
