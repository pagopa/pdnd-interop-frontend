import React from 'react'
import renderer from 'react-test-renderer'
import { Layout } from '../Layout'

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(<Layout sx={{ height: '100%' }} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
