import React from 'react'
import renderer from 'react-test-renderer'
import { LoadingOverlay } from '../LoadingOverlay'

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(<LoadingOverlay loadingText="Sto caricando..." />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
