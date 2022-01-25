import React from 'react'
import renderer from 'react-test-renderer'
import { Overlay } from '../Overlay'

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(<Overlay />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
