import React from 'react'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { ProductUpdatesBanner } from '../banners/ProductUpdatesBanner'
import { vi } from 'vitest'
import * as useProductUpdatesBannerModule from '@/hooks/bannerHooks/useProductUpdatesBanner'
import { renderWithApplicationContext } from '@/utils/testing.utils'

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

    vi.spyOn(useProductUpdatesBannerModule, 'useProductUpdatesBanner').mockReturnValue(
      mockProductUpdatesBanner
    )

    const { getByText, getByTestId } = renderWithApplicationContext(<ProductUpdatesBanner />, {
      withRouterContext: true,
    })

    expect(getByText(mockProductUpdatesBanner.title)).toBeInTheDocument()
    expect(getByText(mockProductUpdatesBanner.text)).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: mockProductUpdatesBanner.action1AriaLabel })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: mockProductUpdatesBanner.action2AriaLabel })
    ).not.toBeInTheDocument()

    const closeButton = getByTestId('CloseIcon')
    await user.click(closeButton)
    expect(mockProductUpdatesBanner.closeBanner).toHaveBeenCalled()
  })
})
