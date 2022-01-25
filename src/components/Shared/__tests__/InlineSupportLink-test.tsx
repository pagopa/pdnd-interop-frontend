import React from 'react'
import renderer from 'react-test-renderer'
import { InlineSupportLink } from '../InlineSupportLink'

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(<InlineSupportLink />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
