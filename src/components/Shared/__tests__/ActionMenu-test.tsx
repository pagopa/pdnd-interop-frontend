import React from 'react'
import renderer from 'react-test-renderer'
import noop from 'lodash/noop'
import { ActionMenu } from '../ActionMenu'
// import { AllTheProviders } from '../../../__mocks__/providers'

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

  // it('renders list', () => {
  //   const event = {
  //     type: 'click',
  //     target: { id: 'basic-button-0' },
  //     stopPropagation: noop,
  //     preventDefault: noop,
  //   }
  //   jest.spyOn(event, 'stopPropagation')
  //   jest.spyOn(event, 'preventDefault')

  //   const actions = [{ onClick: noop, label: 'Azione 1' }]
  //   const component = renderer.create(
  //     <AllTheProviders>
  //       <ActionMenu index={0} actions={actions}></ActionMenu>
  //     </AllTheProviders>
  //   )
  //   component.root.findByType('button').props.onClick()
  //   const tree = component.toJSON()
  //   expect(tree).toMatchSnapshot()
  // })
})
