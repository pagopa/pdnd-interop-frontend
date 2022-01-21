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

  // This test won't work correctly for now, due to MUI using Portals on some components,
  // and react-test-renderer not being able to handle them. The workarounds suggested
  // in this issue (https://github.com/facebook/react/issues/11565) don't work with MUI,
  // as it uses Portals internally, so they cannot be mocked from the outside
  // it('renders list', async () => {
  //   const actions = [{ onClick: noop, label: 'Azione 1' }]

  //   const component = renderer.create(
  //     <AllTheProviders defaultTableActionMenu="basic-button-0">
  //       <ActionMenu index={0} actions={actions}></ActionMenu>
  //     </AllTheProviders>
  //   )

  //   const tree = component.toJSON()
  //   expect(tree).toMatchSnapshot()
  // })
})
