import React from 'react'
import { render } from '@testing-library/react'
import { InfoTooltip } from '@/components/shared/InfoTooltip'

describe("Checks that InfoTooltip snapshots don't change", () => {
  it('renders correctly', () => {
    const inlineClipboard = render(<InfoTooltip label={'label'} />)

    expect(inlineClipboard).toMatchSnapshot()
  })
})
