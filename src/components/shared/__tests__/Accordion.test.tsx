import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
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

  it('renders first entry correctly', () => {
    const accordion = render(<Accordion entries={entries} />)
    const button = screen.queryByRole('button', { name: 'panel-content-0' })
    fireEvent.click(button!)

    expect(accordion).toMatchSnapshot()
  })

  it('renders second entry correctly', () => {
    const accordion = render(<Accordion entries={entries} />)
    const button = screen.queryByRole('button', { name: 'panel-content-1' })
    fireEvent.click(button!)

    expect(accordion).toMatchSnapshot()
  })
})
