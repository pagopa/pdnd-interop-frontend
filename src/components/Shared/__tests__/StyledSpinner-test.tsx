import React from 'react'
import renderer from 'react-test-renderer'
import { StyledSpinner } from '../StyledSpinner'

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(<StyledSpinner />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
