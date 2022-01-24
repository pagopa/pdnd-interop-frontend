import React from 'react'
import renderer from 'react-test-renderer'
import { LoadingWithMessage } from '../LoadingWithMessage'

describe('Snapshot', () => {
  it('matches loading message with background - global', () => {
    const component = renderer.create(<LoadingWithMessage label="Il mio messaggio..." />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches loading message with transparent background - contextual', () => {
    const component = renderer.create(
      <LoadingWithMessage label="Il mio messaggio..." transparentBackground={true} />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
