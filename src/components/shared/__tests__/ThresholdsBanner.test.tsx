import React from 'react'
import userEvent from '@testing-library/user-event'
import { ThresholdsBanner } from '../banners/ThresholdsBanner'
import { vi } from 'vitest'
import * as useThresholdsBannerModule from '@/hooks/bannerHooks/useThresholdsBanner'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const mockThresholdsBanner = {
  title: 'This is a threshold message',
  text: 'This is the threshold context',
  isOpen: true,
  closeBanner: vi.fn(),
}

describe('Checks thresholds banner alert', () => {
  it('renders thresholds banner with message and closes on button click', async () => {
    const user = userEvent.setup()

    vi.spyOn(useThresholdsBannerModule, 'useThresholdsBanner').mockReturnValue(mockThresholdsBanner)

    const { getByText, getByTestId } = renderWithApplicationContext(<ThresholdsBanner />, {
      withRouterContext: true,
    })

    expect(getByText(mockThresholdsBanner.title)).toBeInTheDocument()
    expect(getByText(mockThresholdsBanner.text)).toBeInTheDocument()

    const closeButton = getByTestId('CloseIcon')
    await user.click(closeButton)
    expect(mockThresholdsBanner.closeBanner).toHaveBeenCalled()
  })
})
