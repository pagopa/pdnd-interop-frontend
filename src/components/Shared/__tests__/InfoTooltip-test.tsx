import React from 'react'
import renderer from 'react-test-renderer'
import { InfoTooltip } from '../InfoTooltip'

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(<InfoTooltip label="This is my message"></InfoTooltip>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
