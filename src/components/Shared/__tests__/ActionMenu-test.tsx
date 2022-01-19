import React from 'react'
import renderer from 'react-test-renderer'
import noop from 'lodash/noop'
import { ActionMenu } from '../ActionMenu'

describe('Snapshot test', () => {
  it('renders null with no actions', () => {
    const component = renderer.create(<ActionMenu index={0} actions={[]}></ActionMenu>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders button', () => {
    const actions = [{ onClick: noop, label: 'Azione 1' }]
    const component = renderer.create(<ActionMenu index={0} actions={actions}></ActionMenu>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
