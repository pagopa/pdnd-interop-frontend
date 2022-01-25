import React from 'react'
import renderer from 'react-test-renderer'
import { Contained } from '../Contained'

describe('Snapshot', () => {
  it('matches narrow', () => {
    const component = renderer.create(<Contained type="narrow"></Contained>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches medium', () => {
    const component = renderer.create(<Contained type="medium"></Contained>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
