import React from 'react'
import renderer from 'react-test-renderer'
import { StyledAccordion } from '../StyledAccordion'

const entries = [
  { summary: 'A', details: 'Lorem ipsum dolor sit amet...' },
  { summary: 'B', details: 'Lorem ipsum dolor sit amet...' },
]

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(<StyledAccordion entries={entries} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
