import React from 'react'
import renderer from 'react-test-renderer'
import { StyledSkeleton } from '../StyledSkeleton'

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(<StyledSkeleton />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
