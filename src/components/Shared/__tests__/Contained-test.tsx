import React from 'react'
import renderer from 'react-test-renderer'
import { Contained } from '../Contained'

describe('Snapshot test', () => {
  it('renders narrow', () => {
    const component = renderer.create(<Contained type="narrow"></Contained>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders medium', () => {
    const component = renderer.create(<Contained type="medium"></Contained>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
