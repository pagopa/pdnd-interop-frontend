import React from 'react'
import { render } from '@testing-library/react'
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

  it('renders correctly', () => {
    const accordion = render(<Accordion entries={entries} />)
    // TODO: add click on first section
    expect(accordion).toMatchSnapshot()
  })

  it('renders correctly', () => {
    const accordion = render(<Accordion entries={entries} />)
    // TODO: add click on second section

    expect(accordion).toMatchSnapshot()
  })
})
