import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { InfoTooltip, InfoTooltipSkeleton } from '@/components/shared/InfoTooltip'
import userEvent from '@testing-library/user-event'

describe("Checks that InfoTooltip snapshots don't change", () => {
  it('renders correctly', () => {
    const infoTooltip = render(<InfoTooltip label={'label'} />)

    expect(infoTooltip.baseElement).toMatchSnapshot()
  })

  it('renders the tooltip message correctly while hovering', async () => {
    const user = userEvent.setup()
    const infoTooltip = render(<InfoTooltip label={'label'} />)

    const icon = infoTooltip.queryByLabelText('label')
    await user.hover(icon!)

    // This awaits that the tooltip has been shown
    await waitFor(() => {
      expect(infoTooltip.baseElement).toHaveTextContent('label')
    })
    expect(infoTooltip.baseElement).toMatchSnapshot()
  })
})

describe('InfoTooltipSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<InfoTooltipSkeleton />)
    expect(baseElement).toBeInTheDocument()
  })
})
