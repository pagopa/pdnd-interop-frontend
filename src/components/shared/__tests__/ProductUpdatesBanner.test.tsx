import React from 'react'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { ProductUpdatesBanner } from '../banners/ProductUpdatesBanner'
import { vi } from 'vitest'
import * as useProductUpdatesBannerModule from '@/hooks/bannerHooks/useProductUpdatesBanner'
import { renderWithApplicationContext } from '@/utils/testing.utils'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, { label }: { label: string }) => `${label}, opens in a new tab`,
  }),
}))

const mockProductUpdatesBanner = {
  title: 'This is a notification message',
  text: 'This is the notification context',
  firstLink: {
    label: 'Action 1',
    link: 'https://docs.example.com/first',
  },
  secondLink: {
    label: 'Action 2',
    link: 'https://docs.example.com/second',
  },
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
      screen.getByRole('link', {
        name: `${mockProductUpdatesBanner.firstLink.label}, opens in a new tab`,
      })
    ).toHaveAttribute('href', mockProductUpdatesBanner.firstLink.link)
    expect(
      screen.getByRole('link', {
        name: `${mockProductUpdatesBanner.secondLink.label}, opens in a new tab`,
      })
    ).toHaveAttribute('href', mockProductUpdatesBanner.secondLink.link)

    const closeButton = getByTestId('CloseIcon')
    await user.click(closeButton)
    expect(mockProductUpdatesBanner.closeBanner).toHaveBeenCalled()
  })

  it('does not render optional links when they are not configured', () => {
    vi.spyOn(useProductUpdatesBannerModule, 'useProductUpdatesBanner').mockReturnValue({
      ...mockProductUpdatesBanner,
      firstLink: undefined,
      secondLink: undefined,
    })

    renderWithApplicationContext(<ProductUpdatesBanner />, {
      withRouterContext: true,
    })

    expect(
      screen.queryByRole('link', { name: mockProductUpdatesBanner.firstLink.label })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: mockProductUpdatesBanner.secondLink.label })
    ).not.toBeInTheDocument()
  })
})
