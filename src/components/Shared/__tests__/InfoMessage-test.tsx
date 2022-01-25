import React from 'react'
import renderer from 'react-test-renderer'
import { InfoMessage } from '../InfoMessage'

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(<InfoMessage label="This is my message"></InfoMessage>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
