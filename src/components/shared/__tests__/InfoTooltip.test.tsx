import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { InfoTooltip, InfoTooltipSkeleton } from '@/components/shared/InfoTooltip'
import userEvent from '@testing-library/user-event'

describe("Checks that InfoTooltip snapshots don't change", () => {
  it('renders the tooltip message correctly while hovering', async () => {
    const user = userEvent.setup()
    const infoTooltip = render(<InfoTooltip label={'label'} />)

    const icon = infoTooltip.queryByLabelText('label')
    await user.hover(icon!)

    // This awaits that the tooltip has been shown
    await waitFor(() => {
      expect(infoTooltip.baseElement).toHaveTextContent('label')
    })
  })
})

describe('InfoTooltipSkeleton', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<InfoTooltipSkeleton />)
    expect(baseElement).toBeInTheDocument()
  })
})
