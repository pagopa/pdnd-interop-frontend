import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Accordion } from '@/components/shared/Accordion'

const entries = [
  {
    summary: 'summary1',
    details: 'details1',
  },
  {
    summary: 'summary2',
    summarySecondary: 'summarySecondary2',
    details: 'details2',
  },
]

describe("Checks that Accordion snapshot don't change", () => {
  it('renders correctly', () => {
    const accordion = render(<Accordion entries={entries} />)

    expect(accordion).toMatchSnapshot()
  })

  it('renders first entry correctly', async () => {
    const user = userEvent.setup()
    const accordion = render(<Accordion entries={entries} />)
    const buttons = screen.queryAllByRole('button')
    await user.click(buttons[0])

    expect(accordion).toMatchSnapshot()
  })

  it('renders second entry correctly', async () => {
    const user = userEvent.setup()
    const accordion = render(<Accordion entries={entries} />)
    const buttons = screen.queryAllByRole('button')
    await user.click(buttons[1])

    expect(accordion).toMatchSnapshot()
  })
})
